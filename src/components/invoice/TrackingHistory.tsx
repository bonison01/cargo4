
import React from 'react';
import { Clock } from 'lucide-react';
import TrackTimeline, { TrackingStep } from '@/components/ui/track-timeline';

interface TrackingHistoryProps {
  steps: TrackingStep[];
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({ steps }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-mateng-600" />
        <h2 className="text-xl font-semibold">Tracking History</h2>
      </div>
      
      <TrackTimeline steps={steps} />
    </div>
  );
};

export default TrackingHistory;
