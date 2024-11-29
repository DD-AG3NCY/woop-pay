import React from "react";
import Image from 'next/image';
import createButton from '../../public/create-button.png';
import paymentRequest from '../../public/payment-request.png';

interface HomepageProps {
  onNavigateToPaymentRequest: () => void;
}

export default function Homepage({ onNavigateToPaymentRequest }: HomepageProps) {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl mb-1 text-center">Receive crypto,</h1>
      <h1 className="text-4xl mb-8 text-center">easily.</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Option Card 1 */}
        <div className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
          <Image
            src={paymentRequest}
            alt="Payment Request"
            width={90}
            height={90}
            className="mb-2"
          />
          <div className="text-center">
            <p className="text-sm text-white mb-4">
              A quick and easy payment request.
            </p>
          </div>
          <button
            type="button"
            className="w-[200px] text-center whitespace-nowrap bg-blue text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-blue-700 focus:outline-none focus:bg-blue-500/80"
            onClick={onNavigateToPaymentRequest}
          >
            Create payment link
          </button>
        </div>

        {/* Option Card 2 */}
        <div className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
          <Image
            src={createButton}
            alt="Customize Button"
            width={105}
            height={105}
            className="mb-2"
          />
          <div className="text-center">
            <p className="text-sm text-white mb-4">
              Fundraise right from your website.
            </p>
          </div>
          <button
            type="button"
            className="w-[200px] text-center whitespace-nowrap bg-blue text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-blue-700 focus:outline-none focus:bg-blue-500/80"
          >
            Coming soon...
          </button>
        </div>
      </div>
    </div>
  );
}
