import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context"; // Import useAuth
import image from "../assets/logo_official.png";

function Home() {
    const { user } = useAuth(); // Get user from context
    const [expand, setExpand] = useState(false);

    return (
        <div className="">
           {!expand && (
                <img
                    src={image}
                    alt="logo"
                    className="w-1/5 mx-auto my-auto animate-pulse transition-all ease-in-out cursor-pointer"
                    onClick={() => setExpand(true)}
                />
            )}
            {expand && (
                <div className="fixed top-0 left-0 w-screen h-screen z-50 flex flex-col items-center justify-center bg-black/80">
                    <img
                        src={image}
                        alt="logo"
                        className="w-1/6 mb-8 animate-pulse"
                        style={{ background: 'black' }}
                    />
                    <header className="text-pink-400 p-2 text-center font-bold text-3xl md:text-4xl lg:text-5xl drop-shadow-lg">
                        嘿嘿，又一只好奇的人类！
                    </header>
                    <header className="text-pink-200 p-10 text-center text-2xl md:text-3xl font-bold drop-shadow-lg">
                        快来潜入你内心的抽象深处。
                    </header>
                    <main className="p-2 max-w-3xl mx-auto text-center">
                        {user ? (
                            <section className="mb-7 font-bold flex flex-col">
                                <Link to="/about" className="font-bold text-2xl text-white underline hover:text-blue-400 mb-10">什么鬼，我到底在哪里？</Link>
                                <Link to="/write" className="font-bold text-2xl text-white underline hover:text-blue-400 mb-10">我有一个抽象的想法</Link>
                                <Link to="/dashboard" className="font-bold text-2xl text-white underline hover:text-blue-400 mb-10">我好好奇其他人发了什么</Link>
                                <Link to="/message" className="font-bold text-2xl text-white underline hover:text-blue-400">让我看看我之前发的想法有没有新的评论！</Link>
                            </section>
                        ) : (
                            <section className="mb-7 font-bold flex">
                                <Link to="/register" className="text-blue-500 text-2xl hover:underline mr-4">注册</Link>
                                <div className="text-white text-2xl">|</div>
                                <Link to="/login" className="ml-4 text-blue-500 text-2xl hover:underline">登录</Link>
                            </section>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}

export default Home;