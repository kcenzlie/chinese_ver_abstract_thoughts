import React, { useState, useEffect } from 'react';
import supabase from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';

const comments = [
    "build from this idea?",
    "make this idea even more abstract?",
    "turn this idea into a reality?",
    "help to see this idea from a different perspective?",
    "expand on this idea?",
    "add a twist to this idea?",
    "make this idea more concrete?",
    "explore the depths of this idea?",
    "connect this idea with other ideas?",
    "challenge this idea further?",
    "take this idea to the next level?",
    "find the hidden meaning in this idea?",
    "create something beautiful from this idea?",
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
                setErrorMessage('No posts available.');
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
            <h1 className="text-3xl font-bold text-gray-300">Can you...</h1>
            <div className="text-2xl font-bold text-gray-300 mb-6">{comment}</div>
            <div className="text-gray-200 mt-2 text-sm"> A few notes:</div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200 text-sm mb-6">
                    <li>
                        This is a space for the unique you to contribute to the ideas!
                    </li>
                    <li>
                        Remember to be positive, constructive, and respectful.
                    </li>
                    <li>
                        Helping others to see the beauty in their ideas is a wonderful way to connect.
                    </li>
                    <li>
                        Some content may be moderated to ensure a safe and welcoming environment for all.
                    </li>
                </ul>
            <button 
                onClick={signOut} 
                className="text-xs font-bold text-gray-500 hover:text-blue-700 underline mb-4"
            >
                Sign out
            </button>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {randomPost ? (
                <div className="mt-3 p-4">
                    <p className="text-gray-200 text-2xl font-bold mb-6">{randomPost.post}</p>
                    <small className="text-white font-thin block mt-2 ">
                        Posted on: {new Date(randomPost.created_at).toLocaleString()}
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
                <p className="mt-6 text-pink-400 text-thin text-center">Loading an idea...</p>
            )}
        </div>
    );
};

export default Dashboard;