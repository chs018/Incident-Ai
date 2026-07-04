'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingShell } from './onboarding-shell';
import { OnboardingFormData, defaultFormData } from './onboarding-types';
import { StepWelcome } from './step-welcome';
import { StepOrganization } from './step-organization';
import { StepWorkspace } from './step-workspace';
import { StepTeam } from './step-team';
import { StepPreferences } from './step-preferences';
import { StepSummary } from './step-summary';
import { StepProductTour } from './step-product-tour';

const STORAGE_KEY = 'ai_incident_commander_onboarding';

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData);
  const [isMounted, setIsMounted] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to load onboarding state:', e);
    }
  }, []);

  // Save to sessionStorage on change
  const updateForm = (updates: Partial<OnboardingFormData>) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save onboarding state:', e);
      }
      return next;
    });
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch on server render
  }

  return (
    <OnboardingShell currentStep={currentStep}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {currentStep === 0 && <StepWelcome onNext={nextStep} />}
          {currentStep === 1 && (
            <StepOrganization
              formData={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 2 && (
            <StepWorkspace
              formData={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <StepTeam
              formData={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <StepPreferences
              formData={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <StepSummary
              formData={formData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 6 && (
            <StepProductTour formData={formData} />
          )}
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}
