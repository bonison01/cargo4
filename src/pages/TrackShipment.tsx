
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

const TrackShipment = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const consignmentParam = searchParams.get('consignment');
  
  const [consignmentNo, setConsignmentNo] = useState(consignmentParam || '');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  // Auto-track if consignment number is provided in URL
  useEffect(() => {
    if (consignmentParam) {
      console.log("Auto-tracking with consignment parameter:", consignmentParam);
      const trackingFormRef = document.getElementById('tracking-form') as HTMLFormElement;
      if (trackingFormRef) {
        trackingFormRef.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    }
  }, [consignmentParam]);

  const handleTrackingResult = (result: TrackingResult | null, steps: TrackingStep[]) => {
    setTrackingResult(result);
    setTrackingSteps(steps);
    
    // Update URL with consignment number for shareable link
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
            />
            
            <TrackingResultDisplay
              trackingResult={trackingResult}
              trackingSteps={trackingSteps}
              onViewInvoice={viewInvoiceDetails}
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default TrackShipment;
