
import React from 'react';
import { CheckCircle2, Clock, Package, MapPin, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TrackingStep {
  status: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackTimelineProps {
  steps: TrackingStep[];
}

const statusIcons = {
  'Order Placed': Package,
  'Picked Up': MapPin,
  'In Transit': Truck,
  'Out for Delivery': Truck,
  'Delivered': CheckCircle2,
};

const TrackTimeline: React.FC<TrackTimelineProps> = ({ steps }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || Clock;
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-8"
    >
      {steps.map((step, index) => {
        const Icon = getStatusIcon(step.status);
        return (
          <motion.div 
            key={index} 
            variants={item}
            className="relative"
          >
            <div className={`flex items-start mb-8 ${index === steps.length - 1 ? '' : 'relative'}`}>
              <div className="mr-4 flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.isCompleted 
                    ? 'bg-mateng-100 text-mateng-600' 
                    : step.isCurrent
                      ? 'bg-mateng-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                {index !== steps.length - 1 && (
                  <div className={`absolute ml-5 w-0.5 h-full top-10 ${
                    step.isCompleted ? 'bg-mateng-400' : 'bg-muted'
                  }`}></div>
                )}
              </div>
              <div className={`glass-card p-4 rounded-lg flex-grow ${
                step.isCurrent ? 'border-l-4 border-l-mateng-500' : ''
              }`}>
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-foreground">{step.status}</h4>
                  {step.isCurrent && (
                    <span className="text-xs font-medium bg-mateng-100 text-mateng-600 py-0.5 px-2 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.location}</p>
                <p className="text-xs text-muted-foreground mt-2">{step.timestamp}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TrackTimeline;
