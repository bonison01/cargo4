
import { supabase } from '@/integrations/supabase/client';
import { TrackingResult } from './tracking-utils';

/**
 * Track a shipment by consignment number
 */
export const trackShipment = async (
  trackingNumber: string
): Promise<{ trackingResult: TrackingResult | null; trackingSteps: any[] }> => {
  try {
    console.log("Tracking number:", trackingNumber.trim());
    
    // Use a public function to avoid RLS policy restrictions for tracking
    const { data: publicTrackingData, error: publicTrackingError } = await supabase.functions.invoke('public-tracking', {
      body: { trackingNumber: trackingNumber.trim() }
    });
    
    if (publicTrackingError) {
      console.error("Error invoking public tracking function:", publicTrackingError);
      throw publicTrackingError;
    }
    
    console.log("Public tracking result:", publicTrackingData);
    
    if (publicTrackingData?.invoice) {
      const data = publicTrackingData.invoice;
      const { getEstimatedDelivery, getCurrentLocation, generateTrackingSteps } = await import('./tracking-utils');
      
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
      
      return { trackingResult, trackingSteps: steps };
    } else {
      // Only create demo invoice for the specific demo tracking number
      if (trackingNumber.trim() === 'MT-202503657') {
        console.log("Creating demo invoice and retrying tracking");
        // Use the edge function to create the demo invoice to bypass RLS
        await supabase.functions.invoke('create-demo-invoice', {
          body: { trackingNumber: trackingNumber.trim() }
        });
        
        // Try tracking again after creating the demo
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const result = await trackShipment(trackingNumber);
              resolve(result);
            } catch (error) {
              console.error("Error in retry tracking:", error);
              resolve({ trackingResult: null, trackingSteps: [] });
            }
          }, 2000); // Increased timeout to give the function time to complete
        });
      }
      
      return { trackingResult: null, trackingSteps: [] };
    }
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return { trackingResult: null, trackingSteps: [] }; // Return empty result instead of throwing
  }
};
