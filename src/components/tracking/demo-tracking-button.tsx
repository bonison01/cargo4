
import React from 'react';

interface DemoTrackingButtonProps {
  setConsignmentNo: (value: string) => void;
}

const DemoTrackingButton: React.FC<DemoTrackingButtonProps> = ({ setConsignmentNo }) => {
  const handleClick = () => {
    // Use the fixed demo tracking number
    setConsignmentNo('MT-202503657');
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
