
import { supabase } from '@/integrations/supabase/client';
import { createDemoInvoice } from './demo-invoice-utils';
import { TrackingResult } from './tracking-utils';

/**
 * Track a shipment by consignment number
 */
export const trackShipment = async (
  trackingNumber: string
): Promise<{ trackingResult: TrackingResult | null; trackingSteps: any[] }> => {
  try {
    console.log("Tracking number:", trackingNumber.trim());
    
    // Direct query to Supabase without authentication
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
      // If the shipment isn't found and it's the demo tracking number, create it
      if (trackingNumber.trim() === 'MT-202503657') {
        console.log("Creating demo invoice and retrying tracking");
        await createDemoInvoice();
        
        // Try tracking again after creating the demo
        return new Promise((resolve) => {
          setTimeout(async () => {
            const result = await trackShipment(trackingNumber);
            resolve(result);
          }, 500);
        });
      }
      
      return { trackingResult: null, trackingSteps: [] };
    }
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
};
