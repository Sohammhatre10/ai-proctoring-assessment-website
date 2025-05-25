import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Code2, Users, Shield, Brain, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Real-time Coding',
      description: 'Write and test code in multiple programming languages with instant feedback.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'AI Proctoring',
      description: 'Advanced AI-powered proctoring system to ensure assessment integrity.'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Smart Analysis',
      description: 'Detailed performance analytics and personalized improvement suggestions.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaborative Learning',
      description: 'Join a community of learners and share your coding journey.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-cyan-600 flex items-center justify-center text-white font-bold">
                CA
              </div>
              <span className="ml-2 font-semibold text-lg text-cyan-600 dark:text-cyan-400">
                CodingAssessment
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 
                          hover:bg-cyan-200 dark:hover:bg-cyan-700 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link
                to="/login"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Master Your Coding Skills</span>
              <span className="block text-cyan-600 dark:text-cyan-400">With AI-Powered Assessment</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Take your coding skills to the next level with our advanced assessment platform. Practice, learn, and excel in a secure environment.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-32">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="absolute -top-4 left-4 w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2024 CodingAssessment. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;