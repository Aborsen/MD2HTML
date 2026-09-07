import type { Dispatch, ReactNode, Ref, SetStateAction } from 'react';

/** Navigation and shared-state API exposed to step renderers and via ref. */
export interface StepperApi<TData = undefined> {
  /** Current step index (0-based). */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** True when on the first step. */
  isFirst: boolean;
  /** True when on the last step. */
  isLast: boolean;
  /** Advance to the next step. No-op on the last step. */
  goNext: () => void;
  /** Go back to the previous step. No-op on the first step. */
  goBack: () => void;
  /** Jump to a specific step by index. Clamped to [0, totalSteps - 1]. */
  goTo: (index: number) => void;
  /** Reset to the initial step and initial data. */
  reset: () => void;
  /** Shared data across steps. `undefined` until `initialData` or `setData` provides a value. */
  data: TData | undefined;
  /** Update shared data (value or updater function). */
  setData: Dispatch<SetStateAction<TData | undefined>>;
}

/** Render function for a single step — receives the full stepper API. */
export type StepRenderer<TData = undefined> = (
  api: StepperApi<TData>
) => ReactNode;

export interface UseStepperOptions<TData = undefined> {
  totalSteps: number;
  /** @default 0 */
  initialStep?: number;
  initialData?: TData;
  /** Called after the active step changes (not on mount). */
  onStepChange?: (index: number) => void;
}

export interface StepperProps<TData = undefined> {
  steps: StepRenderer<TData>[];
  /** @default 0 */
  initialStep?: number;
  /** Initial shared data available to all steps via `api.data`. */
  initialData?: TData;
  /** Called after the active step changes (not on mount). */
  onStepChange?: (index: number) => void;
  /** Ref to access the stepper API imperatively. */
  ref?: Ref<StepperApi<TData>>;
}
