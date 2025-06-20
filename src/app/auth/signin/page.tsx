'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError('Email atau password salah');
        return;
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90 z-10"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
        ></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-6">Catatan Uang</h1>
            <p className="text-white/90 text-xl mb-8 leading-relaxed">
              Kelola keuangan pribadi dan bisnis Anda dengan mudah, cepat, dan aman.
            </p>
            <div className="flex justify-center space-x-3 mt-10">
              <span className="h-2 w-2 rounded-full bg-white/30"></span>
              <span className="h-2 w-6 rounded-full bg-white"></span>
              <span className="h-2 w-2 rounded-full bg-white/30"></span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16 xl:px-24">
        <motion.div 
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Selamat datang kembali
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Silakan masuk untuk melanjutkan
            </p>
          </motion.div>

          <motion.form 
            className="space-y-6"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            {/* Email Input */}
            <div className="relative">
              <label 
                htmlFor="email" 
                className={`absolute left-3 pointer-events-none transition-all duration-300 ${
                  emailFocused || email ? 'text-xs -translate-y-6 text-indigo-600 dark:text-indigo-400' : 'text-sm translate-y-2 text-gray-500'
                }`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                className="block w-full px-3 pt-4 pb-2 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 focus:border-indigo-600 dark:border-gray-700 dark:text-white dark:focus:border-indigo-500 text-gray-900 transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label 
                htmlFor="password" 
                className={`absolute left-3 pointer-events-none transition-all duration-300 ${
                  passwordFocused || password ? 'text-xs -translate-y-6 text-indigo-600 dark:text-indigo-400' : 'text-sm translate-y-2 text-gray-500'
                }`}
              >
                Password
              </label>
              <div className="flex items-center">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="block w-full px-3 pt-4 pb-2 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 focus:border-indigo-600 dark:border-gray-700 dark:text-white dark:focus:border-indigo-500 text-gray-900 transition-all duration-300"
                />
                <button 
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Ingat saya
                </label>
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Lupa password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border-l-4 border-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                        text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                        hover:from-indigo-700 hover:to-purple-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                        transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : 'Masuk'}
            </motion.button>
            
            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Atau masuk dengan</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                  <svg className="w-5 h-5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </a>
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                  <svg className="w-5 h-5 text-[#050708]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12.001C2 16.991 5.107 21.127 9.444 22.618C9.332 22.409 9.279 22.164 9.279 21.902V20.023C8.882 20.023 8.196 20.023 8.024 20.023C7.368 20.023 6.777 19.766 6.499 19.267C6.189 18.703 6.14 17.861 5.44 17.317C5.16 17.073 5.336 16.797 5.656 16.829C6.216 16.958 6.667 17.304 7.089 17.863C7.509 18.423 7.715 18.552 8.56 18.552C8.913 18.552 9.44 18.521 9.936 18.428C10.206 17.736 10.647 17.113 11.192 16.779C7.71 16.384 6.058 14.51 6.058 12.153C6.058 11.013 6.499 9.904 7.271 8.976C7.04 8.047 6.723 6.456 7.368 5.881C9.076 5.881 10.107 7.022 10.341 7.273C11.176 7.023 12.107 6.886 13.075 6.886C14.043 6.886 14.976 7.023 15.812 7.273C16.045 7.021 17.076 5.881 18.784 5.881C19.431 6.456 19.111 8.05 18.879 8.978C19.649 9.905 20.089 11.012 20.089 12.153C20.089 14.51 18.438 16.386 14.951 16.779C15.79 17.29 16.393 18.613 16.393 19.736V21.902C16.393 22.039 16.367 22.147 16.349 22.263C20.227 20.551 23 16.575 23 11.999C23 6.477 18.523 2 12 2Z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Belum punya akun?{' '}
                <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </motion.form>
          
          {/* Footer */}
          <motion.p 
            variants={itemVariants} 
            className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400"
          >
            &copy; {new Date().getFullYear()} Catatan Uang. Semua hak dilindungi.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
} 