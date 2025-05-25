import React from 'react';

interface ProblemDescriptionProps {
  title: string;
  description: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ 
  title, 
  description, 
  difficulty 
}) => {
  const difficultyColors = {
    Easy: 'bg-green-500 dark:bg-green-600',
    Medium: 'bg-yellow-500 dark:bg-yellow-600',
    Hard: 'bg-red-500 dark:bg-red-600'
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          <span className={`${difficultyColors[difficulty]} px-2 py-1 rounded text-xs text-white font-medium`}>
            {difficulty}
          </span>
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;