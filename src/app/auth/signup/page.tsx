'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [step, setStep] = useState(1);

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

  const slideVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
      x: -30, 
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.2 }
    }
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getPasswordStrengthText = () => {
    if (!password) return '';
    if (passwordStrength <= 25) return 'Sangat lemah';
    if (passwordStrength <= 50) return 'Lemah';
    if (passwordStrength <= 75) return 'Sedang';
    return 'Kuat';
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setError('Nama dan email harus diisi');
      return;
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password harus diisi');
      return;
    }
    
    if (password.length < 8) {
      setError('Password harus minimal 8 karakter');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password tidak cocok dengan konfirmasi password');
      return;
    }

    if (!agreedToTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat registrasi');
      }
      
      // Registration success animation
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16 xl:px-24">
        <motion.div 
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buat akun baru
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Isi form berikut untuk membuat akun Anda
            </p>
          </motion.div>

          <div className="relative">
            {step === 1 && (
              <motion.form 
                className="space-y-6"
                onSubmit={handleNextStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
              >
                {/* Step indicator */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">1</div>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Informasi Dasar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium text-sm">2</div>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Keamanan</span>
                  </div>
                </div>
                
                {/* Name Input */}
                <div className="relative">
                  <label 
                    htmlFor="name" 
                    className={`absolute left-3 pointer-events-none transition-all duration-300 ${
                      nameFocused || name ? 'text-xs -translate-y-6 text-indigo-600 dark:text-indigo-400' : 'text-sm translate-y-2 text-gray-500'
                    }`}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    required
                    className="block w-full px-3 pt-4 pb-2 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 focus:border-indigo-600 dark:border-gray-700 dark:text-white dark:focus:border-indigo-500 text-gray-900 transition-all duration-300"
                  />
                </div>

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

                {/* Next Step Button */}
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                          text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                          hover:from-indigo-700 hover:to-purple-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                          shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                          transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Lanjutkan
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                className="space-y-6"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
              >
                {/* Step indicator */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-indigo-600/40 flex items-center justify-center text-white font-medium text-sm">✓</div>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Informasi Dasar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">2</div>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Keamanan</span>
                  </div>
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
                  
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getPasswordStrengthText()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {password.length < 8 ? `Min. 8 karakter (${password.length}/8)` : 'Panjang mencukupi'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <label 
                    htmlFor="confirm-password" 
                    className={`absolute left-3 pointer-events-none transition-all duration-300 ${
                      confirmPasswordFocused || confirmPassword ? 'text-xs -translate-y-6 text-indigo-600 dark:text-indigo-400' : 'text-sm translate-y-2 text-gray-500'
                    }`}
                  >
                    Konfirmasi Password
                  </label>
                  <div className="flex items-center">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      required
                      className="block w-full px-3 pt-4 pb-2 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 focus:border-indigo-600 dark:border-gray-700 dark:text-white dark:focus:border-indigo-500 text-gray-900 transition-all duration-300"
                    />
                    <button 
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                      {confirmPasswordVisible ? (
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
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="mt-1">
                      <span className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        {password === confirmPassword ? '✓ Password cocok' : '✗ Password tidak cocok'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-center mt-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Saya setuju dengan <Link href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Syarat dan Ketentuan</Link> dan <Link href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Kebijakan Privasi</Link>
                  </label>
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

                {/* Button Group */}
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg
                            text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            transition-all duration-200"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Kembali
                  </motion.button>

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
                    ) : 'Daftar'}
                  </motion.button>
                </div>
              </motion.form>
            )}
            
            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sudah punya akun?{' '}
                <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
            
            {/* Footer */}
            <motion.p 
              variants={itemVariants} 
              className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              &copy; {new Date().getFullYear()} Catatan Uang. Semua hak dilindungi.
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      {/* Right Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700 to-indigo-500 opacity-90 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
        ></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-6">Kelola Keuangan</h1>
            <p className="text-white/90 text-xl mb-8 leading-relaxed">
              Catatan Uang membantu Anda mengatur keuangan pribadi dan bisnis dengan lebih efektif dan terorganisir.
            </p>
            <div className="flex justify-center space-x-3 mt-10">
              <span className="h-2 w-2 rounded-full bg-white/30"></span>
              <span className="h-2 w-6 rounded-full bg-white"></span>
              <span className="h-2 w-2 rounded-full bg-white/30"></span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 