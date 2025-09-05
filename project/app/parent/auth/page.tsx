'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ParentAuth() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('create-account');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create Account form state
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Sign In form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (createForm.password !== createForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for demo purposes
      const userData = {
        email: createForm.email,
        fullName: createForm.fullName,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('authToken', 'demo-auth-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(userData));
      
      alert('Account created successfully!');
      // Redirect to parent dashboard
      router.push('/parent/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      // In a real app, this would validate against a backend
      if (signInForm.email && signInForm.password) {
        const userData = {
          email: signInForm.email,
          fullName: 'Demo Parent',
          loginAt: new Date().toISOString()
        };
        
        localStorage.setItem('authToken', 'demo-auth-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(userData));
        
        alert('Signed in successfully!');
        // Redirect to parent dashboard
        router.push('/parent/dashboard');
      } else {
        alert('Please enter both email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    alert('Google Sign In (demo)');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 font-fredoka">Parent Zone</h1>
            <p className="text-gray-600 text-lg">Manage settings, PIN, and permissions.</p>
          </div>

          {/* Auth Card */}
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Tiger Image at Top of Card */}
            <div className="p-6 pb-0 text-center">
              <div className="relative w-64 h-64 mx-auto">
                <Image
                  src="\images\signInTiger.png"
                  alt="Friendly tiger welcoming parents"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain rounded-2xl" 
                  priority
                />
              </div>
            </div>

              {/* Tabs */}
              <div className="px-6 pt-6">
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                  <button
                    onClick={() => setActiveTab('create-account')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'create-account'
                        ? 'bg-white text-wiggle-purple shadow-md'
                        : 'text-gray-600 hover:text-wiggle-purple'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => setActiveTab('sign-in')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'sign-in'
                        ? 'bg-white text-wiggle-purple shadow-md'
                        : 'text-gray-600 hover:text-wiggle-purple'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-96 overflow-y-auto px-6 pb-6">
                
                {/* Create Account Tab */}
                {activeTab === 'create-account' && (
                  <motion.form
                    onSubmit={handleCreateAccountSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={createForm.fullName}
                        onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="createEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="createEmail"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="createPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="createPassword"
                          value={createForm.password}
                          onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-wiggle-purple"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={createForm.confirmPassword}
                          onChange={(e) => setCreateForm({...createForm, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-wiggle-purple"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:border-wiggle-purple transition-all flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </motion.button>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={createForm.agreeToTerms}
                        onChange={(e) => setCreateForm({...createForm, agreeToTerms: e.target.checked})}
                        className="mt-1 w-4 h-4 text-wiggle-purple border-gray-300 rounded focus:ring-wiggle-purple"
                        required
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                        I agree to the <a href="#" className="text-wiggle-purple hover:underline">Terms</a> & <a href="#" className="text-wiggle-purple hover:underline">Privacy Policy</a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-wiggle-purple to-wiggle-pink text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </motion.button>

                    {/* Switch to Sign In */}
                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('sign-in')}
                        className="text-wiggle-purple hover:underline font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* Sign In Tab */}
                {activeTab === 'sign-in' && (
                  <motion.form
                    onSubmit={handleSignInSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Email */}
                    <div>
                      <label htmlFor="signInEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="signInEmail"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="signInPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="signInPassword"
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wiggle-purple focus:border-wiggle-purple transition-all"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-wiggle-purple"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:border-wiggle-purple transition-all flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </motion.button>

                    {/* Remember Me */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={signInForm.rememberMe}
                        onChange={(e) => setSignInForm({...signInForm, rememberMe: e.target.checked})}
                        className="w-4 h-4 text-wiggle-purple border-gray-300 rounded focus:ring-wiggle-purple"
                      />
                      <label htmlFor="rememberMe" className="text-sm text-gray-600">
                        Remember me on this device
                      </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-wiggle-purple to-wiggle-pink text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </motion.button>

                    {/* Forgot Links */}
                    <div className="flex justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => alert('Forgot Password modal (demo)')}
                        className="text-wiggle-purple hover:underline"
                      >
                        Forgot Password?
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Forgot PIN modal (demo)')}
                        className="text-wiggle-purple hover:underline"
                      >
                        Forgot PIN?
                      </button>
                    </div>

                    {/* Switch to Create Account */}
                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('create-account')}
                        className="text-wiggle-purple hover:underline font-medium"
                      >
                        Create Account
                      </button>
                    </p>
                  </motion.form>
                )}
              </div>
            </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <motion.a
              href="/"
              className="text-gray-600 hover:text-wiggle-purple font-medium transition-colors inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Home
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}