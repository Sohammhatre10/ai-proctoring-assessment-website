import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

const WebcamMonitor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Webcam Monitor</h3>
        <button 
          onClick={() => setIsEnabled(!isEnabled)}
          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          {isEnabled ? (
            <CameraOff size={16} />
          ) : (
            <Camera size={16} />
          )}
        </button>
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center">
        {isEnabled ? (
          <Webcam
            audio={false}
            height={160}
            width={240}
            screenshotFormat="image/jpeg"
            className="rounded border border-gray-300 dark:border-gray-600"
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <Camera size={24} className="mx-auto mb-2 opacity-50" />
            <p>Camera is disabled</p>
            <button 
              onClick={() => setIsEnabled(true)}
              className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-xs transition-colors"
            >
              Enable Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamMonitor;