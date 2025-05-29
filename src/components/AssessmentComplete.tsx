import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AssessmentCompleteProps {
  reason: "submitted" | "violations";
  violationCount?: number;
}

const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({
  reason,
  violationCount,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform animate-fadeIn">
        {reason === "submitted" ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Assessment Submitted!
            </h2>
            <p className="text-gray-600">
              Your assessment has been successfully submitted. You may now close
              this window.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Assessment Terminated
            </h2>
            <p className="text-gray-600">
              Your assessment has been terminated due to {violationCount}{" "}
              proctoring violations.
            </p>
          </div>
        )}
        <button
          onClick={() => window.close()}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

export default AssessmentComplete;
