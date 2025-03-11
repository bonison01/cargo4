
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import TrackingLoadingIndicator from './tracking-loading-indicator';
import DemoTrackingButton from './demo-tracking-button';
import { trackShipment } from './tracking-service';

interface TrackingFormProps {
  initialConsignment?: string | null;
  onTrackingResult: (result: any, steps: any[]) => void;
  setLoading: (loading: boolean) => void;
  setConsignmentNo: (value: string) => void;
  consignmentNo: string;
  onTrack: (trackingNumber: string) => Promise<void>;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  initialConsignment,
  onTrackingResult,
  setLoading,
  setConsignmentNo,
  consignmentNo
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackingSubmit = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    
    const trackingNumber = initialConsignment || consignmentNo;
    
    if (!trackingNumber) {
      toast({
        title: "Tracking number required",
        description: "Please enter a consignment number to track",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setIsLoading(true);
    
    try {
      const { trackingResult, trackingSteps } = await trackShipment(trackingNumber);
      
      if (trackingResult) {
        onTrackingResult(trackingResult, trackingSteps);
      } else {
        toast({
          title: "Shipment not found",
          description: "No shipment found with the given consignment number",
          variant: "destructive",
        });
        onTrackingResult(null, []);
      }
    } catch (error: any) {
      console.error('Error tracking shipment:', error);
      toast({
        title: "Error tracking shipment",
        description: error.message || "An error occurred while tracking your shipment",
        variant: "destructive",
      });
      onTrackingResult(null, []);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <form onSubmit={handleTrackingSubmit} className="glass-card rounded-xl p-6 mb-8" id="tracking-form">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter consignment number (e.g., MT-202503657)"
              value={consignmentNo}
              onChange={(e) => setConsignmentNo(e.target.value)}
              className="pl-10 py-6 text-base"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>
          <Button 
            type="submit" 
            className="bg-mateng-600 hover:bg-mateng-700 py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <TrackingLoadingIndicator isLoading={isLoading} />
            ) : (
              "Track Shipment"
            )}
          </Button>
        </div>
        <div className="text-center mt-4">
          <DemoTrackingButton setConsignmentNo={setConsignmentNo} />
        </div>
      </form>
    </motion.div>
  );
};

export default TrackingForm;
