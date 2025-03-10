
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrackingFormProps {
  initialConsignment?: string;
  onTrackingResult: (result: any, steps: any[]) => void;
  setLoading: (loading: boolean) => void;
  setConsignmentNo: (value: string) => void;
  consignmentNo: string;
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
  
  // Check if we need to create a demo record on first load
  useEffect(() => {
    const checkForDemoData = async () => {
      // Check if any records exist in the database
      const { count, error } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error checking for invoice records:", error);
        return;
      }
      
      // If no records exist, create a demo record
      if (count === 0) {
        await createDemoInvoice();
      }
    };
    
    checkForDemoData();
  }, []);

  // Create a demo invoice for tracking
  const createDemoInvoice = async () => {
    console.log("Creating demo invoice as no invoices exist");
    
    const demoInvoice = {
      consignment_no: 'MT-202503657',
      from_location: 'Imphal, Manipur',
      to_location: 'Delhi, India',
      status: 'in-transit',
      amount: 1250,
      weight: 5.2,
      user_id: '00000000-0000-0000-0000-000000000000', // Placeholder ID
      items: 'Demo Shipment Package'
    };
    
    const { error } = await supabase
      .from('invoices')
      .insert(demoInvoice);
    
    if (error) {
      console.error("Error creating demo invoice:", error);
    } else {
      console.log("Demo invoice created successfully");
    }
  };

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
      console.log("Tracking number:", trackingNumber.trim());
      
      // Query Supabase for the tracking info - No auth required for tracking
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('consignment_no', trackingNumber.trim())
        .maybeSingle();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Tracking result:", data);
      
      if (data) {
        import('./tracking-utils').then(({ getEstimatedDelivery, getCurrentLocation, generateTrackingSteps }) => {
          const trackingResult = {
            consignmentNo: data.consignment_no,
            status: data.status,
            origin: data.from_location,
            destination: data.to_location,
            estimatedDelivery: getEstimatedDelivery(data.created_at),
            currentLocation: getCurrentLocation(data.status, data.from_location, data.to_location),
            id: data.id,
          };
          
          // Generate tracking steps
          const steps = generateTrackingSteps(data);
          
          onTrackingResult(trackingResult, steps);
        });
      } else {
        // If the shipment isn't found, try creating a demo invoice with the entered tracking number
        if (trackingNumber === 'MT-202503657') {
          await createDemoInvoice();
          
          // Try tracking again after creating the demo
          handleTrackingSubmit(null);
          return;
        }
        
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

  // For demo purposes, find a valid tracking number
  const fillDemoTracking = async () => {
    try {
      console.log("Fetching demo tracking number");
      // Using a more direct approach to ensure we can fetch without auth
      const { data, error } = await supabase
        .from('invoices')
        .select('consignment_no')
        .limit(1);
      
      if (error) {
        console.error("Demo tracking error:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Found demo tracking:", data[0].consignment_no);
        setConsignmentNo(data[0].consignment_no);
      } else {
        // If no invoices exist, create one and use it
        console.log("No invoices found, creating demo invoice");
        await createDemoInvoice();
        setConsignmentNo('MT-202503657');
      }
    } catch (error) {
      console.error('Error fetching demo tracking:', error);
      // Fallback to static demo
      setConsignmentNo('MT-202503657');
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
  );
};

export default TrackingForm;
