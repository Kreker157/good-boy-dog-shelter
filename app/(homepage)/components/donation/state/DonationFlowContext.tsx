'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type Step = 1 | 2 | 3;
export type DonationType = 'foundation' | 'shelter';
export type PhoneCountry = '+421' | '+420';
export type PresetAmount = 5 | 10 | 20 | 30 | 50 | 100 | 'custom' | null;

export type DonationFlowState = {
  step: Step;
  donationType: DonationType;
  presetAmount: PresetAmount;
  phoneCountry: PhoneCountry;
  submitStatus: 'idle' | 'loading' | 'success' | 'error';
  completed: Record<Step, boolean>;
};

export type DonationFlowAction =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GOTO'; step: Step }
  | { type: 'SET_DONATION_TYPE'; donationType: DonationType }
  | { type: 'SET_PRESET_AMOUNT'; presetAmount: PresetAmount }
  | { type: 'SET_PHONE_COUNTRY'; phoneCountry: PhoneCountry }
  | {
      type: 'SET_SUBMIT_STATUS';
      submitStatus: DonationFlowState['submitStatus'];
    }
  | { type: 'MARK_STEP_DONE'; step: Step; done: boolean }
  | { type: 'RESET_FLOW' };

const initialState: DonationFlowState = {
  step: 1,
  donationType: 'foundation',
  presetAmount: 50,
  phoneCountry: '+421',
  submitStatus: 'idle',
  completed: { 1: false, 2: false, 3: false },
};

function clampStep(n: number): Step {
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return n as Step;
}

function reducer(
  state: DonationFlowState,
  action: DonationFlowAction,
): DonationFlowState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: clampStep(state.step + 1) };
    case 'BACK':
      return { ...state, step: clampStep(state.step - 1) };
    case 'GOTO':
      return { ...state, step: action.step };
    case 'SET_DONATION_TYPE': {
      return { ...state, donationType: action.donationType };
    }
    case 'SET_PRESET_AMOUNT':
      return { ...state, presetAmount: action.presetAmount };
    case 'SET_PHONE_COUNTRY':
      return { ...state, phoneCountry: action.phoneCountry };
    case 'SET_SUBMIT_STATUS':
      return { ...state, submitStatus: action.submitStatus };
    case 'MARK_STEP_DONE':
      return {
        ...state,
        completed: { ...state.completed, [action.step]: action.done },
      };
    case 'RESET_FLOW':
      return initialState;
    default:
      return state;
  }
}

type CtxValue = {
  state: DonationFlowState;
  dispatch: React.Dispatch<DonationFlowAction>;
};

const DonationFlowContext = createContext<CtxValue | null>(null);

export function DonationFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <DonationFlowContext.Provider value={value}>
      {children}
    </DonationFlowContext.Provider>
  );
}

export function useDonationFlow() {
  const ctx = useContext(DonationFlowContext);
  if (!ctx)
    throw new Error('useDonationFlow must be used within DonationFlowProvider');
  return ctx;
}
