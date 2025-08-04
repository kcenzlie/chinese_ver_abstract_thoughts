import React from "react";
import image from "../assets/logo_official.png";
import { Link, useNavigate } from 'react-router-dom';

const quirkyFacts = [
  "Daydreaming is my form of meditation.",
  "Sometimes I talk to my code as if it were a person.",
  "I'm an introvert who loves sharing thoughts online.",
  "Minimalism is my aesthetic, both in life and code.",
  "I believe in the power of simplicity and clarity.",
  "I often find inspiration in the mundane.",
  "I enjoy creating spaces that encourage deep thinking.",
  "I think of my code as a canvas for abstract ideas.",
  "I find beauty in the intersection of art and technology.",
  "I often ponder the meaning of existence while coding.",
  "I enjoy the quiet moments when I can focus on my thoughts.",
  "I think of my code as a reflection of my inner self.",
  "I find joy in the process of creating something from nothing.",
  "I often get lost in thought while debugging.",
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
            className="w-1/6 mb-5 animate-pulse"
        />
        <h1 className="text-3xl font-light text-blue-700 mb-2 tracking-wide">Where on earth am I?</h1>
        <p className="text-lg text-gray-700 font-bold mb-6 text-center">
          You're at <span className="text-pink-500 font-bold">Abstract Thoughts</span>, a safe space where you can express your thoughts, share your ideas, and connect with others <span className="text-blue-500 font-medium">who appreciate the beauty of abstract thinking</span>.
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          Have you ever felt like your thoughts were too abstract, too unique, or too unconventional to share with the people around you? This is the place for you! Here, we celebrate the beauty of abstract ideas and encourage you to express yourself freely.
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          Everything shared on this website is anonymous. Here, you no longer need to worry about being judged or misunderstood. You can share your thoughts, ideas, and inspirations without fear of criticism.
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          Others—like you or unlike you—will leave behind their advice, suggestions, and heartfelt encouragement for your ideas. You can also read the unspoken ideas of others, share your own experiences, and offer guidance.
        </p>
        <p className="text-gray-600 mt-4 mb-4 mr-5 ml-5">
          This is a place of creativity, love, and connection, where abstract, unfinished, or crazy ideas are refined into concrete and mature thoughts. The ideas you comment might also help someone else, filling this world with a little more warmth and beauty.
        </p>
        <p className="mt-4 text-gray-800 mb-8 text-2xl">
          Got an idea? <Link to="/write" className="font-bold text-pink-500 hover:underline">Share it here :D</Link>
        </p>
        <div className="w-full flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">A fun fact about me, the website developer/designer/artist:</span>
          <div className="text-base text-blue-600 italic font-light bg-gray-100 px-4 py-2 rounded-lg border border-yellow-200 shadow-sm">
          {fact}
          </div>
        </div>
        <svg className="mt-8" width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="10" rx="28" ry="6" fill="#f4d5d5" fillOpacity="0.6" />
        </svg>
        <div className="mt-6 text-xs text-gray-400 font-thin">Designed with <span className="animate-pulse">♥</span> hopes of freedom & love</div>
      </section>


    </div>
    
  );
};

export default About;
