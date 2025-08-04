import React from 'react';
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  if (location.pathname === "/") return null; // Home 页不显示 Footer
  return (
    <footer className="text-center py-2 text-sm text-blue-700">
      <p>&copy; {new Date().getFullYear()} Abstract Thoughts. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
