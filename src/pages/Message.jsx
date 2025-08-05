import React, { useEffect, useState } from 'react';
import supabase from '../helper/supabaseClient';

const Message = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPostsAndComments = async (userId) => {
        try {
            const { data: postsData, error: postsError } = await supabase
                .from('Post')
                .select(`
                    id,
                    post,
                    created_at,
                    Comments (
                        id,
                        comments,
                        created_at
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error('Error fetching posts:', postsError);
                return [];
            }

            // Sort posts by their latest comment or post creation time
            return postsData.map(post => ({
                ...post,
                Comments: post.Comments?.sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ) || []
            })).sort((a, b) => {
                const latestCommentA = a.Comments?.length > 0
                    ? new Date(a.Comments[0].created_at).getTime()
                    : new Date(a.created_at).getTime();
                const latestCommentB = b.Comments?.length > 0
                    ? new Date(b.Comments[0].created_at).getTime()
                    : new Date(b.created_at).getTime();

                return latestCommentB - latestCommentA;
            });
        } catch (error) {
            console.error('Error fetching posts and comments:', error);
            return [];
        }
    };

    const handleNewComment = async (newComment) => {
        try {
            setPosts(prevPosts => {
                const existingPost = prevPosts.find(post => post.id === newComment.post_id);
                
                if (existingPost) {
                    // Update existing post's comments
                    const updatedPost = {
                        ...existingPost,
                        Comments: [newComment, ...(existingPost.Comments || [])]
                    };
                    
                    // Remove the old version and add the updated one at the beginning
                    return [updatedPost, ...prevPosts.filter(post => post.id !== updatedPost.id)];
                }
                
                // If post doesn't exist, fetch it
                return prevPosts;
            });
        } catch (error) {
            console.error('Error in handleNewComment:', error);
        }
    };

    useEffect(() => {
        let subscription = null;

        const initialize = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                console.error('User session not found.');
                setLoading(false);
                return;
            }

            const sortedPosts = await fetchPostsAndComments(session.user.id);
            setPosts(sortedPosts);
            setLoading(false);

            const { data: userPosts } = await supabase
                .from('Post')
                .select('id')
                .eq('user_id', session.user.id);

            const userPostIds = userPosts?.map(post => post.id) || [];

            if (userPostIds.length > 0) {
                subscription = supabase
                    .channel('comments')
                    .on(
                        'postgres_changes',
                        { 
                            event: 'INSERT', 
                            schema: 'public', 
                            table: 'Comments',
                            filter: `post_id=in.(${userPostIds.join(',')})`
                        },
                        async (payload) => {
                            if (payload?.new) {
                                handleNewComment(payload.new);
                            }
                        }
                    )
                    .subscribe();
            }
        };

        initialize();

        return () => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, []);

    if (loading) return <div className="text-center text-gray-500 mt-10">加载中...</div>;

    return (
        <div className="p-6 w-3/4 mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-200">已存档的想法和评论</h2>
            {posts.length === 0 ? (
                <p className="text-pink-600">你还没有发布任何想法。不急，先看看也可以！</p>
            ) : (
                <div className="max-h-[500px] overflow-y-auto bg-trasnparent">
                    <ul className="p-3 space-y-2">
                        {posts.map((post) => (
                            <li key={post.id} className="p-2">
                                <div>
                                    <h3 className="text-lg text-blue-500">{post.post}</h3>
                                    <small className="text-gray-200 font-thin block mt-1">
                                        Created at: {new Date(post.created_at).toLocaleString()}
                                    </small>
                                    <ul className="mt-3 space-y-3">
                                        {!post.Comments?.length ? (
                                            <li className="text-gray-300 text-sm">还没有评论，过两天再来看看吧！</li>
                                        ) : (
                                            post.Comments.map((comment) => (
                                                <li key={comment.id} className="p-3">
                                                    <p className="text-pink-400">{comment.comments}</p>
                                                    <small className="text-gray-300 font-thin block mt-1">
                                                        评论于 {new Date(comment.created_at).toLocaleString()}
                                                    </small>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Message;


//有各种各样的想法，怎样验证？找爸妈，找同学，老师，陌生人。但是需要很多的精力，可能不能给一个建设性的意见。
//可能很多人很shy，不愿意把自己的想法说出来，不愿社交。
//给一个很安全的safe space去交流想法。文字形式，小纸条，匿名发送给另外一个用户，匿名回复。再发给下一个人。十个人后，回到你的手上
//很多人的feedback，转一圈，回到你的手上。
//mvp