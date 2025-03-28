import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TrackingForm from '@/components/tracking/tracking-form';
import TrackingResultDisplay from '@/components/tracking/tracking-result';
import { TrackingResult } from '@/components/tracking/tracking-utils';
import { TrackingStep } from '@/components/ui/track-timeline';
import { trackShipment } from '@/components/tracking/tracking-service';
import { useToast } from '@/hooks/use-toast';

const TrackShipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const consignmentParam = searchParams.get('consignment');
  
  const [consignmentNo, setConsignmentNo] = useState(consignmentParam || '');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  const handleTrack = async (trackingNumber: string) => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a consignment number to track your shipment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { trackingResult, trackingSteps } = await trackShipment(trackingNumber);
      
      setTrackingResult(trackingResult);
      setTrackingSteps(trackingSteps);
      
      if (trackingResult && trackingNumber) {
        setSearchParams({ consignment: trackingNumber });
      } else if (!trackingResult) {
        toast({
          title: "Shipment not found",
          description: "No shipment found with the provided tracking number. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      toast({
        title: "Tracking failed",
        description: "We encountered an error while tracking your shipment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (consignmentParam) {
      console.log("Auto-tracking with consignment parameter:", consignmentParam);
      handleTrack(consignmentParam);
    }
  }, [consignmentParam]);

  const handleTrackingResult = (result: TrackingResult | null, steps: TrackingStep[]) => {
    setTrackingResult(result);
    setTrackingSteps(steps);
    
    if (result && consignmentNo) {
      setSearchParams({ consignment: consignmentNo });
    }
  };

  const viewInvoiceDetails = () => {
    if (trackingResult) {
      navigate(`/invoices/${trackingResult.id}`);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Track Shipment - Mateng Shipping</title>
        <meta name="description" content="Track your shipment in real-time between Imphal and Delhi with detailed status updates." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-20 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-3">Track Your Shipment</h1>
              <p className="text-muted-foreground">Enter your consignment number to get real-time tracking information</p>
            </motion.div>
            
            <TrackingForm
              initialConsignment={consignmentParam}
              onTrackingResult={handleTrackingResult}
              setLoading={setIsLoading}
              setConsignmentNo={setConsignmentNo}
              consignmentNo={consignmentNo}
              onTrack={handleTrack}
            />
            
            <TrackingResultDisplay
              trackingResult={trackingResult}
              trackingSteps={trackingSteps}
              onViewInvoice={viewInvoiceDetails}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default TrackShipment;
