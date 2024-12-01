import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InitialVectorAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, label: 'Unstructured Data', icon: '📄' },
    { id: 1, label: 'Embedding Model (LLM)', icon: '🤖' },
    { id: 2, label: 'Vector Embeddings', icon: '🔢' },
    { id: 3, label: 'Vector Database', icon: '🗄️' },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>What Are Vector Embeddings?</h1>

      {/* Main Flow Animation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {/* Unstructured Data */}
        <motion.div
          initial={{ scale: 0 }}
          animate={currentStep >= 0 ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', opacity: currentStep >= 0 ? 1 : 0.3 }}
        >
          <div style={{ fontSize: '3rem' }}>{steps[0].icon}</div>
          <div>{steps[0].label}</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={currentStep >= 1 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '2rem' }}
        >
          ➡️
        </motion.div>

        {/* Embedding Model */}
        <motion.div
          initial={{ scale: 0 }}
          animate={currentStep >= 1 ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', opacity: currentStep >= 1 ? 1 : 0.3 }}
        >
          <div style={{ fontSize: '3rem' }}>{steps[1].icon}</div>
          <div>{steps[1].label}</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={currentStep >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '2rem' }}
        >
          ➡️
        </motion.div>

        {/* Vector Embeddings */}
        <motion.div
          initial={{ scale: 0 }}
          animate={currentStep >= 2 ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', opacity: currentStep >= 2 ? 1 : 0.3 }}
        >
          <div style={{ fontSize: '3rem' }}>{steps[2].icon}</div>
          <div>{steps[2].label}</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={currentStep >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '2rem' }}
        >
          ➡️
        </motion.div>

        {/* Vector Database */}
        <motion.div
          initial={{ scale: 0 }}
          animate={currentStep >= 3 ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', opacity: currentStep >= 3 ? 1 : 0.3 }}
        >
          <div style={{ fontSize: '3rem' }}>{steps[3].icon}</div>
          <div>{steps[3].label}</div>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleNextStep}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
          disabled={currentStep >= steps.length - 1}
        >
          Next
        </button>
        <button
          onClick={handleReset}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default InitialVectorAnimation;
