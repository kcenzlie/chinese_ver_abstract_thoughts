import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Write from './pages/Write';
import Message from './pages/Message';
import Login from './pages/Login';
import { AuthProvider } from './context/auth-context';
import Dashboard from './pages/Dashboard';
import Wrapper from './pages/Wrapper';
import Comments from './components/Comments';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import About from './pages/About';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-black p-4 overflow-y-auto animate-fadeIn">
            <NavBar />
            <main className="flex-1 flex justify-center items-center rounded-lg p-4 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/write" element={<Write />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/message" element={<Message />} />
                <Route 
                  path="/about" 
                  element={<About />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <Wrapper>
                      <Dashboard />
                    </Wrapper>
                  }
                />
                <Route 
                  path="/comments" 
                  element={
                    <Wrapper>
                      <Comments />
                    </Wrapper>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;


// https://www.youtube.com/watch?v=_sSTzz13tVY 拯救我的tutorial
