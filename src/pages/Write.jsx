import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { Link } from 'react-router-dom';
import supabase from '../helper/supabaseClient';

const questions = [
    "让你憋到抓狂，不吐不快？",
    "但是找不到懂你的嘴替？",
    "是疯到离谱/抽象到裂开/私密到社死的？",
    "让周围人听了都瞳孔地震？",
    "在等一个能封神的高光时刻？",
    "让你深夜上头，修仙到天亮？",
    "它藏着你的颅内高潮/狂野脑洞/深夜破防？",
    "让你觉得能颅内放烟花？",
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
                    你必须登录才能发表抽象想法。请{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">登录:D</Link>.
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
            const { error: insertError } = await supabase.from('Post_chinese_version').insert([
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
                <span className="font-semibold text-gray-300 font-bold text-3xl">你有没有什么抽象的想法...</span>
                <div className="font-semibold text-gray-300 font-bold text-2xl mb-10">{question}</div>
                <div className="text-gray-200 mt-2 text-sm">一些提示：</div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200 text-sm">
                    <li>
                        欢迎你来到属于你的脑洞现场，此刻，麦是你的！
                    </li>
                    <li>
                        当你的点子收割<span className="font-semibold text-blue-400">评论+1</span>时，它会自动<span className="font-semibold text-blue-400">存档到灵感库</span>，随时翻牌重温！
                    </li>
                    <li>
                        注意！这里是<span className="font-semibold text-blue-400">公共空间</span>，注意你所有的言论和行为哦~
                    </li>
                    <li>
                        一起守护这个<span className="font-semibold text-blue-400">脑洞发电站</span>和<span className="font-semibold text-blue-400">灵感能量池</span>！拒绝负面言论，只种快乐的脑洞！
                    </li>
                    <li>
                        偶尔会有巡逻小精灵路过，它会帮忙清理一些不合适的内容，请不要介意。
                    </li>
                </ul>
                <div className="mt-3 font-bold text-pink-300 text-lg">
                    这里是一个让你畅所欲言的地方，尽情释放你的想法吧！
                </div>
            </div>
            <div className="w-full">
                {errorMessage && <div className="text-red-500 mb-4 font-semibold">{errorMessage}</div>}
                {isSubmitted && !errorMessage && <div className="text-purple-400 mb-4 font-semibold">Post submitted successfully!</div>}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={post}
                        onChange={handleInputChange}
                        placeholder="开始写你的抽象想法吧..."
                        className="bg-white border border-black-300 rounded-lg w-full p-10 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none overflow-hidden text-blue-700"
                        rows="1"
                    />
                    <button
                        type="submit"
                        className="w-full bg-pink-400 text-white py-2 rounded-lg transition-all font-bold shadow-md hover:bg-yellow-300"
                    >
                        我想知道别人怎么想！
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Write;