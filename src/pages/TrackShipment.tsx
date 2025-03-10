
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PackageCheck, Package, Truck, MapPin } from 'lucide-react';
import TrackTimeline, { TrackingStep } from '@/components/ui/track-timeline';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from 'react-router-dom';

const TrackShipment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const consignmentParam = searchParams.get('consignment');
  
  const [consignmentNo, setConsignmentNo] = useState(consignmentParam || '');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  // Auto-track if consignment number is provided in URL
  useEffect(() => {
    if (consignmentParam) {
      handleTrackingSubmit(null, consignmentParam);
    }
  }, [consignmentParam]);

  const handleTrackingSubmit = async (e: React.FormEvent | null, initialConsignment?: string) => {
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
    
    setIsLoading(true);
    
    try {
      // Query Supabase for the tracking info without requiring auth
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('consignment_no', trackingNumber.trim())
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTrackingResult({
          consignmentNo: data.consignment_no,
          status: data.status,
          origin: data.from_location,
          destination: data.to_location,
          estimatedDelivery: getEstimatedDelivery(data.created_at),
          currentLocation: getCurrentLocation(data.status, data.from_location, data.to_location),
          id: data.id,
        });
        
        // Generate tracking steps
        const steps: TrackingStep[] = [];
        const statuses = ['pending', 'processing', 'in-transit', 'delivered'];
        const statusLabels = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];
        const createdDate = new Date(data.created_at);
        
        // Find the current status index
        const currentStatusIndex = statuses.indexOf(data.status);
        
        for (let i = 0; i < statuses.length; i++) {
          const isCompleted = i <= currentStatusIndex;
          const isCurrent = i === currentStatusIndex;
          
          // Calculate a date that's i days after created date
          const stepDate = new Date(createdDate);
          stepDate.setDate(createdDate.getDate() + i);
          
          steps.push({
            status: statusLabels[i],
            location: i === 0 ? data.from_location : 
                     i === statuses.length - 1 ? data.to_location : 
                     i === 1 ? 'Sorting Center' : 'Transit Hub',
            timestamp: isCompleted ? 
                      stepDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) +
                      ' • ' + stepDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) :
                      'Estimated: ' + new Date(createdDate.setDate(createdDate.getDate() + 3)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}),
            isCompleted,
            isCurrent
          });
        }
        
        setTrackingSteps(steps);
        
        // Update URL with consignment number for shareable link
        if (!initialConsignment) {
          setSearchParams({ consignment: trackingNumber });
        }
      } else {
        toast({
          title: "Shipment not found",
          description: "No shipment found with the given consignment number",
          variant: "destructive",
        });
        setTrackingResult(null);
        setTrackingSteps([]);
      }
    } catch (error: any) {
      console.error('Error tracking shipment:', error);
      toast({
        title: "Error tracking shipment",
        description: error.message || "An error occurred while tracking your shipment",
        variant: "destructive",
      });
      setTrackingResult(null);
      setTrackingSteps([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getEstimatedDelivery = (createdAt: string) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 3); // Estimate 3 days for delivery
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getCurrentLocation = (status: string, origin: string, destination: string) => {
    switch(status) {
      case 'pending':
        return origin;
      case 'processing':
        return 'Sorting Center, ' + origin.split(',')[1]?.trim() || origin;
      case 'in-transit':
        return 'Transit Hub, Guwahati';
      case 'delivered':
        return destination;
      default:
        return origin;
    }
  };

  // For demo purposes, find a valid tracking number
  const fillDemoTracking = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('consignment_no')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setConsignmentNo(data.consignment_no);
      } else {
        // If no invoices exist, use a demo one
        setConsignmentNo('MT-2024050001');
      }
    } catch (error) {
      console.error('Error fetching demo tracking:', error);
      // Fallback to static demo
      setConsignmentNo('MT-2024050001');
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
                        {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
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
                            <div 
                              className="h-full bg-mateng-600 rounded-full" 
                              style={{ 
                                width: trackingResult.status === 'pending' ? '25%' : 
                                       trackingResult.status === 'processing' ? '50%' : 
                                       trackingResult.status === 'in-transit' ? '75%' : 
                                       trackingResult.status === 'delivered' ? '100%' : '0%'
                              }}
                            ></div>
                          </div>
                          <p className="text-right text-sm text-mateng-600 mt-1">
                            {trackingResult.status === 'pending' ? '25%' : 
                             trackingResult.status === 'processing' ? '50%' : 
                             trackingResult.status === 'in-transit' ? '75%' : 
                             trackingResult.status === 'delivered' ? '100%' : '0%'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Tracking History</h3>
                  <TrackTimeline steps={trackingSteps} />
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
