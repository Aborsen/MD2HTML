'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StepperApi, UseStepperOptions } from './types';

/** Headless hook that manages stepper navigation and shared data. */
export function useStepper<TData = undefined>({
  totalSteps,
  initialStep = 0,
  initialData,
  onStepChange,
}: UseStepperOptions<TData>): StepperApi<TData> {
  const clampStep = useCallback((step: number, totalSteps: number) => {
    return Math.max(0, Math.min(totalSteps - 1, step));
  }, []);

  const [currentStep, setCurrentStep] = useState(() =>
    clampStep(initialStep, totalSteps)
  );
  const [data, setData] = useState<TData | undefined>(initialData);

  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
      onStepChangeRef.current?.(currentStep);
    }
  }, [currentStep]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentStep(Math.max(0, Math.min(totalSteps - 1, index)));
    },
    [totalSteps]
  );

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Reset the stepper to the initial step and data.
  const reset = useCallback(() => {
    setCurrentStep(clampStep(initialStep, totalSteps));
    setData(initialData);
  }, [initialStep, initialData, totalSteps, clampStep]);

  return useMemo(
    () => ({
      currentStep,
      totalSteps,
      isFirst: currentStep === 0,
      isLast: currentStep === totalSteps - 1,
      goNext,
      goBack,
      goTo,
      reset,
      data,
      setData,
    }),
    [currentStep, totalSteps, goNext, goBack, goTo, reset, data]
  );
}
