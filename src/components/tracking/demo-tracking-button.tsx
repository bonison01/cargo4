
import React from 'react';
import { fetchDemoTrackingNumber } from './demo-invoice-utils';

interface DemoTrackingButtonProps {
  setConsignmentNo: (value: string) => void;
}

const DemoTrackingButton: React.FC<DemoTrackingButtonProps> = ({ setConsignmentNo }) => {
  const handleClick = async () => {
    const demoNumber = await fetchDemoTrackingNumber();
    setConsignmentNo(demoNumber);
  };
  
  return (
    <button 
      type="button" 
      onClick={handleClick}
      className="text-sm text-mateng-600 hover:text-mateng-700 underline"
    >
      Use demo tracking number
    </button>
  );
};

export default DemoTrackingButton;
