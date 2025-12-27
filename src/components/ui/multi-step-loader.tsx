"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface LoadingStep {
  text: string;
}

interface MultiStepLoaderProps {
  steps: LoadingStep[];
  currentStep: number;
  loading: boolean;
}

export function MultiStepLoader({ steps, currentStep, loading }: MultiStepLoaderProps) {
  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-blue-500/10 border border-blue-500/20' 
                      : isCompleted 
                        ? 'bg-green-500/5' 
                        : 'opacity-40'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </motion.div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center">
                        <span className="text-xs text-[#666666]">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-white' 
                      : isCompleted 
                        ? 'text-green-400' 
                        : 'text-[#666666]'
                  }`}>
                    {step.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 h-1 bg-[#262626] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-center text-[#666666] text-xs mt-4">
            Step {currentStep + 1} of {steps.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MultiStepLoader;
