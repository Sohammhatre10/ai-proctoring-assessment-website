import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  defaultValue: string;
  language: 'javascript' | 'python' | 'cpp';
  onChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  defaultValue,
  language,
  onChange
}) => {
  const [code, setCode] = useState(defaultValue);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (onChange) {
      onChange(value);
    }
  };

  const getLanguageHighlighter = () => {
    switch (language) {
      case 'javascript':
        return languages.js;
      case 'python':
        return languages.python;
      case 'cpp':
        return languages.cpp;
      default:
        return languages.clike;
    }
  };

  return (
    <div className="h-full w-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <select 
          className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-200"
          defaultValue={language}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
            Format
          </button>
          <button className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
            Reset
          </button>
        </div>
      </div>
      <div className="p-0 h-[calc(100%-40px)]">
        <Editor
          value={code}
          onValueChange={handleCodeChange}
          highlight={code => highlight(code, getLanguageHighlighter(), language)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            height: '100%',
            color: 'var(--tw-prose-body)',
            backgroundColor: 'transparent',
          }}
          className="min-h-[300px] h-full"
        />
      </div>
    </div>
  );
};

export default CodeEditor;