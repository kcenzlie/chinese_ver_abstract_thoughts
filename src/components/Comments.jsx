import React, { useState, useEffect, useRef } from 'react';
import supabase from '../helper/supabaseClient';

const Comments = ({ postId, initialComments = [], refreshPost }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(initialComments);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);

    const fetchComments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('Comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
            
        if (error) {
            console.error('Error fetching comments:', error);
            setErrorMessage('Failed to fetch comments.');
        } else {
            setComments(data || []);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim() === '') return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error('Error fetching user:', userError);
            setErrorMessage('Failed to get user information.');
            return;
        }

        const { error: insertError } = await supabase.from('Comments').insert([
            {
                post_id: postId,
                comments: comment,
            },
        ]);

        if (insertError) {
            console.error('Error inserting comment:', insertError);
            setErrorMessage('Failed to submit comment. Please try again.');
        } else {
            setComment('');
            setErrorMessage('');
            await fetchComments();
            refreshPost();
        }
    };

    const handleInput = (e) => {
        setComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="flex items-start mb-5 gap-2">
                <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={handleInput}
                    placeholder="在这里留下你的评论吧..."
                    className="flex-1 p-4 bg-gray-200 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none overflow-shown text-blue-700"
                    rows={1}
                    style={{ minHeight: '90px', maxHeight: '300px', overflowY: 'auto' }}
                />
                <button
                    type="submit"
                    className="p-4 rounded text-white bg-pink-400 h-fit hover:font-bold hover:bg-yellow-300"
                    style={{ minHeight: '90px', minWidth: '60px' }}
                >
                    提交
                </button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div>
                <div className="font-bold text-gray-200">评论：</div>
                {isLoading ? (
                    <p>加载评论中...</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.id}>
                            <div className="text-pink-500 pb-4 pt-4">{c.comments}</div>
                            <small className="font-thin text-xs">{new Date(c.created_at).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;