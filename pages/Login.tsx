import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleIcon = () => (
    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
        <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-5.2 5.71 5.84 5.84 0 0 0 5.525 5.789 5.424 5.424 0 0 0 5.228-3.39h-5.228V9.113h9.083A8.821 8.821 0 0 1 8.842 18.083Z" clipRule="evenodd"/>
    </svg>
);

const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);


const Login = () => {
    const [email, setEmail] = useState('manager@adityabirla.com');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        navigate('/');
    };
    
    const handleGoogleLogin = () => {
        login('admin@adityabirla.com');
        navigate('/admin');
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-800">
                
                {/* Image Column */}
                <div className="relative hidden md:block">
                    <img className="w-full h-full object-cover" src="https://picsum.photos/seed/proud-construction-team/800/1200" alt="A proud team of architects and engineers in front of their completed modern building project." />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Aditya Birla</h2>
                        <p className="text-gray-200 mt-1">Project Management Platform</p>
                    </div>
                </div>

                {/* Form Column */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Sign in to access your projects.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white sr-only">Your email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <EnvelopeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <LockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    defaultValue="password"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all">
                            Sign In
                        </button>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-sm text-gray-400 dark:text-gray-500">OR</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                        </div>
                         <button type="button" onClick={handleGoogleLogin} className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center justify-center dark:focus:ring-[#4285F4]/55 transition-all">
                            <GoogleIcon />
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;