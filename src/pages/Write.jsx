import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { Link } from 'react-router-dom';
import supabase from '../helper/supabaseClient';

const questions = [
    "that you desperately want to share with others?",
    "that you can't find the right people to share it with?",
    "that is too crazy, too abstract, or too personal to share?",
    "that nobody around you seems to understand?",
    "that you've been waiting for the right moment to let it out?",
    "that keeps you up at night?",
    "that contains your deepest thoughts, wildest dreams, or darkest fears?",
    "that you think is the most fascinating to you?",
];

function getQuestions() {
  return questions[Math.floor(Math.random() * questions.length)];
}

const Write = () => {
    const [question] = React.useState(getQuestions());
    const { user } = useAuth();
    const [post, setPost] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setPost(e.target.value);
        e.target.style.height = 'auto'; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-center">
                <p className="text-gray-700">
                    You must be logged in to write a post. Please{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">log in</Link>.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (post.trim() === '') {
            setErrorMessage('Post content cannot be empty.');
            return;
        }

        console.log('Authenticated User ID:', user.id); // Debugging log

        try {
            const { error: insertError } = await supabase.from('Post').insert([
                {
                    user_id: user.id,
                    post: post,
                },
            ]);

            if (insertError) {
                console.error('Error inserting post:', insertError);
                setErrorMessage('Failed to submit post. Please try again.');
            } else {
                setPost(''); // Clear the input field
                setErrorMessage(''); // Clear the error message
                setIsSubmitted(true); // Mark as successfully submitted
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center flex flex-col">
            <div className="mb-8 text-base leading-relaxed">
                <span className="font-semibold text-gray-300 font-bold text-3xl">What is an idea... </span>
                <div className="font-semibold text-gray-300 font-bold text-2xl mb-10">{question}</div>
                <div className="text-gray-200 mt-2 text-sm"> A few notes:</div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200 text-sm">
                    <li>
                        This is a space for you to share your thoughts, ideas, and inspirations with the world.
                    </li>
                    <li>
                        Once your idea gathers <span className="font-semibold text-blue-400"> echos</span> from other souls, it wiill be automatically archived in the messages page, where you can revisit them anytime.
                    </li>
                    <li>
                        Keep in mind that this is <span className="font-semibold text-blue-400">a public space</span>, so be mindful of what you share.
                    </li>
                    <li>
                        Let's keep it <span className="font-semibold text-blue-400"> positive</span> and <span className="font-semibold text-blue-400"> constructive</span>. This is a place for sharing, not for negativity.
                    </li>
                    <li>
                        Some content may be moderated to ensure a safe and welcoming environment for all.
                    </li>
                </ul>
                <div className="mt-3 font-bold text-pink-300 text-lg">
                    Let's build a community of abstract thinkers and dreamers!
                </div>
            </div>
            <div className="w-full">
                {errorMessage && <div className="text-red-500 mb-4 font-semibold">{errorMessage}</div>}
                {isSubmitted && !errorMessage && <div className="text-purple-400 mb-4 font-semibold">Post submitted successfully!</div>}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={post}
                        onChange={handleInputChange}
                        placeholder="Enter your crazy thoughts..."
                        className="bg-white border border-black-300 rounded-lg w-full p-10 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none overflow-hidden text-blue-700"
                        rows="1"
                    />
                    <button
                        type="submit"
                        className="w-full bg-pink-400 text-white py-2 rounded-lg transition-all font-bold shadow-md hover:bg-yellow-300"
                    >
                        I wanna know how others think about this!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Write;