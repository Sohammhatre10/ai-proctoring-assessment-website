import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Moon,
  Sun,
  Layout,
  Clock,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Filter,
  BarChart2
} from 'lucide-react';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAssessments = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '2 hours',
      difficulty: 'Medium'
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      date: '2024-03-22',
      time: '2:00 PM',
      duration: '1.5 hours',
      difficulty: 'Easy'
    },
    {
      id: 3,
      title: 'System Design Interview',
      date: '2024-03-25',
      time: '11:00 AM',
      duration: '3 hours',
      difficulty: 'Hard'
    }
  ];

  const stats = [
    { label: 'Completed', value: '24', icon: <Award className="w-5 h-5" /> },
    { label: 'Success Rate', value: '85%', icon: <BarChart2 className="w-5 h-5" /> },
    { label: 'Hours Practiced', value: '48', icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-md bg-cyan-600 flex items-center justify-center text-white font-bold">
            CA
          </div>
          <span className="ml-2 font-semibold text-lg text-cyan-600 dark:text-cyan-400">
            CodingAssessment
          </span>
        </div>
        <nav className="mt-6 px-4">
          <div className="space-y-4">
            <a className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200">
              <Layout className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Clock className="mr-3 h-5 w-5" />
              Assessments
            </a>
            <a className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Award className="mr-3 h-5 w-5" />
              Performance
            </a>
            <a className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </a>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4">
            <button className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assessments..."
                className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 
                        hover:bg-cyan-200 dark:hover:bg-cyan-700 transition-colors duration-200"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</span>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex items-center"
              >
                <div className="rounded-full p-3 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Assessments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Assessments</h2>
                <button className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingAssessments.map((assessment) => (
                <div key={assessment.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{assessment.date}</span>
                      <span>•</span>
                      <span>{assessment.time}</span>
                      <span>•</span>
                      <span>{assessment.duration}</span>
                    </div>
                  </div>
                  <Link
                    to={`/assessment/${assessment.id}`}
                    className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                  >
                    Start
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;