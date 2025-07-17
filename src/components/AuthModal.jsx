import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Success - close modal and redirect to app
    onSuccess();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#141414] rounded-2xl shadow-2xl border border-[#303030] max-w-[512px] w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#ababab] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303030] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-8">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold">StreakMaster</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                isSignUp 
                  ? 'bg-black text-white' 
                  : 'bg-transparent text-[#ababab] hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                !isSignUp 
                  ? 'bg-[#303030] text-white' 
                  : 'bg-transparent text-[#ababab] hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
          <h2 className="text-white text-[28px] font-bold leading-tight text-center pb-6">
            {isSignUp ? 'Sign up for StreakMaster' : 'Welcome back to StreakMaster'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-xl bg-[#303030] text-white placeholder:text-[#ababab] border-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-xl bg-[#303030] text-white placeholder:text-[#ababab] border-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
              />
            </div>

            {/* Confirm Password (only for sign up) */}
            {isSignUp && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full h-14 px-4 rounded-xl bg-[#303030] text-white placeholder:text-[#ababab] border-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <p className="text-[#ababab] text-sm text-center py-4">Or continue with</p>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 h-10 bg-[#303030] text-white font-bold rounded-full hover:bg-[#404040] transition-colors">
              Continue with Google
            </button>
            <button className="flex-1 h-10 bg-[#303030] text-white font-bold rounded-full hover:bg-[#404040] transition-colors">
              Continue with Apple
            </button>
          </div>

          {/* Switch Mode */}
          <p className="text-[#ababab] text-sm text-center pt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white underline hover:no-underline"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}