import React, { useState } from 'react';
import supabase from '../helper/supabaseClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { signUp } = useAuth();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage("");
  
      try {
        await signUp(email, password);
        setMessage("Account created successfully! Check your email for verification!");
        setEmail("");
        setPassword("");
      } catch (error) {
        setMessage(error.message);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-3 text-pink-500">Register</h2>
        {message && <div className="text-red-500 mb-4">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 space-x-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded px-4 py-2 w-64"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded px-4 py-2 w-64"
          />
          <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-200">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-gray-200">
          Already have an account? <Link to="/login" className="text-pink-500 hover:underline">Login :D</Link>
        </p>
      </div>
    );
};

export default Register;