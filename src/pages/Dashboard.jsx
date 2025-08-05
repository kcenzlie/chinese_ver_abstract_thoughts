import React, { useState, useEffect } from 'react';
import supabase from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';

const comments = [
    "顺着这个想法延伸下去吗？",
    "让这个想法再抽象一点吗？",
    "帮助这个想法变成现实吗？",
    "换个角度帮忙思考这个想法吗？",
    "延伸讨论一下这个想法吗？",
    "给这个想法加个新转折吗？",
    "把这个想法说得更具体点吗？",
    "深入探索一下这个想法的本质吗？",
    "把这个想法和其他的疯狂点子串联起来吗？",
    "进一步挑战这个想法吗？",
    "把这个想法玩出新高度吗？",
    "挖掘出这个想法中的深意吗？",
    "想象如何利用这个想法创造出美好的东西吗？",
];

function getComments() {
  return comments[Math.floor(Math.random() * comments.length)];
}

const Dashboard = () => {
    const [comment] = React.useState(getComments());
    const navigate = useNavigate();
    const [randomPost, setRandomPost] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(null);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate("/login");
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                setErrorMessage('Failed to fetch user information.');
                return;
            }
            setUserId(user.id);
        };

        fetchUser();
    }, []);

    const fetchRandomPost = async () => {
        try {
            // First fetch a random post excluding the user's own posts
            const { data: posts, error: postsError } = await supabase
                .from('Post')
                .select('id, post, created_at, user_id')
                .neq('user_id', userId) // Exclude posts by the current user
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error('Error fetching posts:', postsError);
                setErrorMessage('Failed to fetch posts.');
                return;
            }

            if (posts.length === 0) {
                setErrorMessage('暂时还没有想法。');
                return;
            }

            // Select a random post
            const randomIndex = Math.floor(Math.random() * posts.length);
            const selectedPost = posts[randomIndex];

            // Then fetch comments for this specific post
            const { data: comments, error: commentsError } = await supabase
                .from('Comments')
                .select('id, comments, created_at')
                .eq('post_id', selectedPost.id)
                .order('created_at', { ascending: true });

            if (commentsError) {
                console.error('Error fetching comments:', commentsError);
                setErrorMessage('Failed to fetch comments.');
                return;
            }

            // Combine post with its comments
            const postWithComments = {
                ...selectedPost,
                Comments: comments || []
            };

            setRandomPost(postWithComments);
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchRandomPost(); // Only call fetchRandomPost when userId is set
        }
    }, [userId]);

    return (
        <div className="w-2/3 mx-auto p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-300">你能...</h1>
            <div className="text-2xl font-bold text-gray-300 mb-6">{comment}</div>
            <div className="text-gray-200 mt-2 text-sm">一些提示：</div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200 text-sm mb-6">
                    <li>
                        这是专属于你的独特舞台，快用你<span className="font-semibold text-blue-400">独一份的脑洞</span>来为这些想法添砖加瓦吧！
                    </li>
                    <li>
                        记得带上你的<span className="font-semibold text-blue-400">快乐、善意和幽默感</span>，这里是个充满正能量的地方哦~
                    </li>
                    <li>
                        帮别人<span className="font-semibold text-blue-400">点亮</span>他们想法里的灵感小火花，是让你们<span className="font-semibold text-blue-400">有趣的灵魂连接</span>的绝妙方式！
                    </li>
                    <li>
                        偶尔会有巡逻小精灵路过，它会帮忙清理一些不合适的内容，请不要介意。
                    </li>
                </ul>
            <button 
                onClick={signOut} 
                className="text-xs font-bold text-gray-500 hover:text-blue-700 underline mb-4"
            >
                登出
            </button>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {randomPost ? (
                <div className="mt-3 p-4">
                    <p className="text-gray-200 text-2xl font-bold mb-6">{randomPost.post}</p>
                    <small className="text-white font-thin block mt-2 ">
                        发布于 {new Date(randomPost.created_at).toLocaleString()}
                    </small>
                    <div className="p-4 text-white mt-4 rounded-lg shadow-sm">
                        <Comments
                            postId={randomPost.id}
                            initialComments={randomPost.Comments}
                            refreshPost={fetchRandomPost}
                        />
                    </div>
                </div>
            ) : (
                <p className="mt-6 text-pink-400 text-thin text-center">加载想法中...</p>
            )}
        </div>
    );
};

export default Dashboard;