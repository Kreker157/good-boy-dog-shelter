'use client';

import { DonationFlow } from './components/donation/DonationFlow';
import { DonationFlowProvider } from './components/donation/state/DonationFlowContext';

export default function Page() {
  return (
    <DonationFlowProvider>
      <DonationFlow />
    </DonationFlowProvider>
  );
}
