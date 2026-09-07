'use client';

import { useImperativeHandle } from 'react';
import type { StepperProps } from './types';
import { useStepper } from './use-stepper';

/**
 * Headless stepper that renders the current step's render function,
 * passing the full stepper API. Exposes the API via ref for imperative control.
 */
function Stepper<TData = undefined>({
  steps,
  initialStep,
  initialData,
  onStepChange,
  ref,
}: StepperProps<TData>) {
  const api = useStepper<TData>({
    totalSteps: steps.length,
    initialStep,
    initialData,
    onStepChange,
  });

  useImperativeHandle(ref, () => api, [api]);

  const currentRenderer = steps[api.currentStep];

  return currentRenderer ? currentRenderer(api) : null;
}

Stepper.displayName = 'Stepper';

export { Stepper };
