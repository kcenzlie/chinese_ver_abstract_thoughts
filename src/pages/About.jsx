import React from "react";
import image from "../assets/logo_official.png";
import { Link, useNavigate } from 'react-router-dom';

const quirkyFacts = [
  "白日梦就是我充电的方式。",
  "有时我会把代码当人，跟它聊上两句。",
  "我是个内向的人，却偏偏爱在网上分享脑洞。",
  "极简是我的美学信条，生活如此，写代码也一样。",
  "我笃信简单与清晰的力量。",
  "灵感都是从日常生活中来的！",
  "我喜欢创造让人能沉浸思考的空间。",
  "我把代码看作挥洒抽象灵感的画布。",
  "艺术与技术的交汇处，总让我发现别样的美。",
  "写着代码，我常会琢磨起，人存在，到底有什么意义？",
  "我享受那些安静的时刻，能让我梳理思路。",
  "我创造的东西就是我内心的模样。",
  "从无到有的创造过程，总能带给我纯粹的快乐。",
  "调试时走神，思绪飘远是常有的事。",
];

function getRandomFact() {
  return quirkyFacts[Math.floor(Math.random() * quirkyFacts.length)];
}

const About = () => {
  const [fact] = React.useState(getRandomFact());
  return (
    <div className="flex justify-center items-center">
      <section className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md border border-purple-100 animate-fadeIn">
        <img
            src={image}
            alt="logo"
            className="w-1/6 mb-5 animate-pulse rounded-lg"
        />
        <h1 className="text-3xl font-light text-blue-700 mb-6 tracking-wide">什么鬼，我...到底在哪里？</h1>
        <p className="text-2xl text-gray-700 font-bold mb-6 mr-5 ml-5 text-center">
          你位于<span className="text-pink-500 font-bold">Abstract Thoughts 抽象的人</span> —— 一个你可以安心畅所欲言、分享有趣的想法，并与同样<span className="text-blue-500 font-medium">抽象/有趣/疯狂</span>的朋友交流的空间。
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          你是否曾觉得自己的想法太过抽象、过于独特，或者与周围人格格不入，难以跟他们分享？这里就是为你准备的空间！在这个地方，我们欣赏抽象思想的美妙，并鼓励你，一个抽象的人类，畅所欲言。
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          在本网站，所有分享均为匿名发布。在这里，你无需再担忧被评判或误解，可以快乐地说出你的想法，分享你的灵感，不必害怕任何批评。
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          其他人——无论与你相似或不同——都会为你的想法留下他们的建议、意见和真诚的鼓励。你也可以阅读他人疯狂的灵感，分享自己的经验，并给予建议。
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          这里是一片创意、友爱与连接的土壤，天马行空、尚未成型或看似疯狂的奇思妙想，将在此被孵化成具体而成熟的思想。你留下的见解，或许正是他人所需的星火，能为这世界增添多一份温暖与美好。
        </p>
        <p className="mt-4 text-gray-800 mb-8 text-2xl">
          有什么有趣的想法吗？ <Link to="/write" className="font-bold text-pink-500 hover:underline">快快快来分享 :D</Link>
        </p>
        <div className="w-full flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">关于我，一个网站开发爱好者/创作者/艺术家的有趣事实：</span>
          <div className="text-base text-blue-600 italic font-light bg-gray-100 px-4 py-2 rounded-lg border border-yellow-200 shadow-sm">
          {fact}
          </div>
        </div>
        <svg className="mt-8" width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="10" rx="28" ry="6" fill="#f4d5d5" fillOpacity="0.6" />
        </svg>
        <div className="mt-6 text-xs text-gray-400 font-thin">设计初衷：怀揣一颗跳动的<span className="animate-pulse">♥</span>，期许自由与爱。</div>
      </section>


    </div>
    
  );
};

export default About;
