import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

const NavBar = () => {
    const [session, setSession] = useState(null);
    const [hasNewComments, setHasNewComments] = useState(false);
    const [lastVisitTime, setLastVisitTime] = useState(null);
    const location = useLocation();


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 获取用户的所有帖子ID
    const fetchUserPosts = async (userId) => {
        const { data: posts, error } = await supabase
            .from('Post')
            .select('id')
            .eq('user_id', userId);
        
        if (error) {
            console.error('Error fetching user posts:', error);
            return [];
        }
        return posts.map(post => post.id);
    };

    // 检查新评论
    const checkNewComments = async (userId) => {
        try {
            const userPostIds = await fetchUserPosts(userId);
            if (userPostIds.length === 0) return;

            const { data: comments, error } = await supabase
                .from('Comments')
                .select('*')
                .in('post_id', userPostIds)
                .gt('created_at', lastVisitTime || new Date(0).toISOString());

            if (error) {
                console.error('Error checking new comments:', error);
                return;
            }

            if (comments && comments.length > 0) {
                setHasNewComments(true);
            }
        } catch (error) {
            console.error('Error in checkNewComments:', error);
        }
    };

    // 初始化lastVisitTime和检查新评论
    useEffect(() => {
        if (session?.user) {
            const storedTime = localStorage.getItem('lastVisitTime');
            if (!storedTime) {
                const now = new Date().toISOString();
                localStorage.setItem('lastVisitTime', now);
                setLastVisitTime(now);
            } else {
                setLastVisitTime(storedTime);
            }
            checkNewComments(session.user.id);
        }
    }, [session]);

    // 监听新评论
    useEffect(() => {
        if (!session?.user) return;

        const setupSubscription = async () => {
            const userPostIds = await fetchUserPosts(session.user.id);
            if (userPostIds.length === 0) return;

            const subscription = supabase
                .channel('comments')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'Comments',
                        filter: `post_id=in.(${userPostIds.join(',')})`
                    },
                    (payload) => {
                        if (payload?.new) {
                            setHasNewComments(true);
                        }
                    }
                )
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        };

        setupSubscription();
    }, [session]);

    // 当用户访问Message页面时重置通知状态
    useEffect(() => {
        if (location.pathname === '/message') {
            setHasNewComments(false);
            const now = new Date().toISOString();
            localStorage.setItem('lastVisitTime', now);
            setLastVisitTime(now);
        }
    }, [location]);

    const handleMessageClick = (e) => {
        if (location.pathname === '/message') {
            e.preventDefault();
            // 如果在Message页面，则刷新页面
            window.location.reload();
        } else {
            // 如果不在Message页面，则正常导航并重置通知
            setHasNewComments(false);
            const now = new Date().toISOString();
            localStorage.setItem('lastVisitTime', now);
            setLastVisitTime(now);
        }
    };


    if (location.pathname === "/") return null; // Home 页不显示 Navbar
    if (location.pathname === "/register") return null;
    if (location.pathname === "/login") return null;

    return (
        <nav className="p-1 pb-4 pt-4 flex justify-between items-center ">
            <Link to="/" className="text-2xl font-extrabold text-blue-700 hover:text-purple-300">
                Abstract Thoughts 抽象的人
            </Link>
            <div className="flex gap-6">
                <Link to="/about" className="text-xl text-blue-700 font-extrabold hover:text-pink-500 hover:underline">
                    关于
                </Link>
                <Link to="/write" className="text-xl text-blue-700 font-extrabold hover:text-pink-500 hover:underline">
                    发布
                </Link>
                <Link to="/dashboard" className="text-xl text-blue-700 font-extrabold hover:text-pink-500 hover:underline">
                    评论
                </Link>
                <Link to="/message" className="text-xl text-blue-700 font-extrabold hover:text-pink-500 hover:underline"  onClick={handleMessageClick}>
                    灵感库 {hasNewComments && <span className="text-red-500">💗</span>}
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;