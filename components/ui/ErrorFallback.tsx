'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getUserFriendlyMessage } from '@/lib/errors';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  onRetry?: () => void;
  title?: string;
  showDetails?: boolean;
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  onRetry,
  title = "Something went wrong",
  showDetails = false 
}: ErrorFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  const userMessage = getUserFriendlyMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Error Message */}
      <h3 className="text-2xl font-heading font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-surface-400 max-w-md mb-8 text-lg">
        {userMessage}
      </p>

      {/* Error Details (Optional) */}
      {showDetails && error.message && (
        <details className="mb-8 max-w-2xl w-full">
          <summary className="text-sm text-surface-500 cursor-pointer hover:text-surface-400 transition-colors">
            Technical Details
          </summary>
          <pre className="mt-4 p-4 bg-surface-900 border border-surface-800 rounded-lg text-left text-xs text-surface-400 overflow-auto">
            {error.stack || error.message}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {(onRetry || resetErrorBoundary) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetry}
            className="px-6 py-3 bg-white hover:bg-brand-50 text-black font-semibold rounded-xl transition-colors shadow-lg"
          >
            Try Again
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white font-semibold rounded-xl transition-colors"
        >
          Start Over
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * Section-level error fallback (less prominent)
 */
export function SectionErrorFallback({ 
  sectionName,
  error,
  onRetry 
}: { 
  sectionName: string;
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="p-8 bg-surface-900/30 border border-red-500/20 rounded-2xl backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <span className="text-red-400 text-lg">⚠</span>
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-2">
            {sectionName} unavailable
          </h4>
          <p className="text-surface-400 text-sm mb-4">
            {getUserFriendlyMessage(error)}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Try loading again →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
