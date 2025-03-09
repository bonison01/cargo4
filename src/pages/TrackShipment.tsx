
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PackageCheck, Package, Truck, MapPin } from 'lucide-react';
import TrackTimeline, { TrackingStep } from '@/components/ui/track-timeline';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const demoTrackingData: {
  consignmentNo: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation: string;
  steps: TrackingStep[];
} = {
  consignmentNo: 'MT-2024050001',
  status: 'In Transit',
  origin: 'Imphal, Manipur',
  destination: 'New Delhi, Delhi',
  estimatedDelivery: 'May 18, 2024',
  currentLocation: 'Guwahati, Assam',
  steps: [
    {
      status: 'Order Placed',
      location: 'Imphal, Manipur',
      timestamp: 'May 15, 2024 • 09:30 AM',
      isCompleted: true,
      isCurrent: false
    },
    {
      status: 'Picked Up',
      location: 'Imphal, Manipur',
      timestamp: 'May 15, 2024 • 02:15 PM',
      isCompleted: true,
      isCurrent: false
    },
    {
      status: 'In Transit',
      location: 'Guwahati, Assam',
      timestamp: 'May 16, 2024 • 11:45 AM',
      isCompleted: false,
      isCurrent: true
    },
    {
      status: 'Out for Delivery',
      location: 'New Delhi, Delhi',
      timestamp: 'Estimated: May 18, 2024',
      isCompleted: false,
      isCurrent: false
    },
    {
      status: 'Delivered',
      location: 'New Delhi, Delhi',
      timestamp: 'Estimated: May 18, 2024',
      isCompleted: false,
      isCurrent: false
    }
  ]
};

const TrackShipment = () => {
  const { toast } = useToast();
  const [consignmentNo, setConsignmentNo] = useState('');
  const [trackingResult, setTrackingResult] = useState<typeof demoTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consignmentNo) {
      toast({
        title: "Tracking number required",
        description: "Please enter a consignment number to track",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (consignmentNo.toLowerCase() === 'mt-2024050001' || consignmentNo.toLowerCase() === '2024050001') {
        setTrackingResult(demoTrackingData);
      } else {
        toast({
          title: "Shipment not found",
          description: "No shipment found with the given consignment number",
          variant: "destructive",
        });
        setTrackingResult(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  // For demo purposes, you can pre-fill with a valid tracking number
  const fillDemoTracking = () => {
    setConsignmentNo('MT-2024050001');
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Track Shipment - Mateng Shipping</title>
        <meta name="description" content="Track your shipment in real-time between Imphal and Delhi with detailed status updates." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <form onSubmit={handleTrackingSubmit} className="glass-card rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter consignment number (e.g., MT-2024050001)"
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
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tracking...
                      </span>
                    ) : (
                      "Track Shipment"
                    )}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={fillDemoTracking}
                    className="text-sm text-mateng-600 hover:text-mateng-700 underline"
                  >
                    Use demo tracking number
                  </button>
                </div>
              </form>
            </motion.div>
            
            {trackingResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="bg-mateng-50 border-b border-mateng-100 p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">Shipment Details</h2>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-mateng-500/10 text-mateng-700">
                        {trackingResult.status}
                      </span>
                    </div>
                    <p className="text-lg mb-1">{trackingResult.consignmentNo}</p>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">From</p>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                          <p className="font-medium">{trackingResult.origin}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">To</p>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                          <p className="font-medium">{trackingResult.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-b border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Location</p>
                        <div className="flex items-center">
                          <Truck className="h-5 w-5 text-mateng-600 mr-2" />
                          <p className="font-medium">{trackingResult.currentLocation}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                        <div className="flex items-center">
                          <PackageCheck className="h-5 w-5 text-mateng-600 mr-2" />
                          <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Shipment Progress</p>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-full w-3/5 bg-mateng-600 rounded-full"></div>
                          </div>
                          <p className="text-right text-sm text-mateng-600 mt-1">60%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Tracking History</h3>
                  <TrackTimeline steps={trackingResult.steps} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default TrackShipment;
