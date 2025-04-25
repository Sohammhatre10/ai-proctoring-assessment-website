import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

interface TestCasesProps {
  testCases: TestCase[];
}

const TestCases: React.FC<TestCasesProps> = ({ testCases }) => {
  const [expandedCase, setExpandedCase] = useState<number | null>(0);

  const toggleExpand = (id: number) => {
    setExpandedCase(expandedCase === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">Test Cases</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {testCases.map((testCase) => (
          <div key={testCase.id} className="text-sm">
            <button
              onClick={() => toggleExpand(testCase.id)}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Case {testCase.id}
              </span>
              {expandedCase === testCase.id ? (
                <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>
            
            {expandedCase === testCase.id && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs">
                <div className="mb-2">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Input:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {testCase.input}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Expected Output:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCases;