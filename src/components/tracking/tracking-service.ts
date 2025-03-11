
import { supabase } from '@/integrations/supabase/client';
import { TrackingResult } from './tracking-utils';
import { Invoice } from '@/types/invoice';

/**
 * Track a shipment by consignment number
 */
export const trackShipment = async (
  trackingNumber: string
): Promise<{ trackingResult: TrackingResult | null; trackingSteps: any[] }> => {
  try {
    console.log("Tracking number:", trackingNumber.trim());
    
    // Use edge function as the primary method for public tracking
    try {
      console.log("Using edge function for public tracking");
      const { data: publicTrackingData, error: publicTrackingError } = await supabase.functions.invoke('public-tracking', {
        body: { trackingNumber: trackingNumber.trim() }
      });
      
      if (publicTrackingError) {
        console.error("Error invoking public tracking function:", publicTrackingError);
        // Fall through to try other methods if edge function fails
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
      }
    } catch (error) {
      console.error("Edge function failed:", error);
      // Continue to next method
    }
    
    // As fallback, try direct database query (for authenticated users)
    try {
      console.log("Trying direct database query");
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('consignment_no', trackingNumber.trim())
        .maybeSingle();
      
      if (invoiceData && !invoiceError) {
        console.log("Direct database query successful:", invoiceData);
        const { getEstimatedDelivery, getCurrentLocation, generateTrackingSteps } = await import('./tracking-utils');
        
        const trackingResult = {
          consignmentNo: invoiceData.consignment_no,
          status: invoiceData.status,
          origin: invoiceData.from_location,
          destination: invoiceData.to_location,
          estimatedDelivery: getEstimatedDelivery(invoiceData.created_at),
          currentLocation: getCurrentLocation(invoiceData.status, invoiceData.from_location, invoiceData.to_location),
          id: invoiceData.id,
        };
        
        // Generate tracking steps
        const steps = generateTrackingSteps(invoiceData);
        return { trackingResult, trackingSteps: steps };
      }
    } catch (error) {
      console.error("Direct database query failed:", error);
    }
    
    // Use demo tracking as final fallback only for specific demo tracking number
    if (trackingNumber.trim() === 'MT-202503657') {
      console.log("Using demo tracking data fallback");
      
      // Create a mock invoice object
      const demoInvoice: Invoice = {
        id: 'demo-id-123456',
        consignment_no: 'MT-202503657',
        from_location: 'Imphal, Manipur',
        to_location: 'Delhi, NCR',
        amount: 2500,
        status: 'in-transit',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        weight: 5,
        items: 'Electronics and Books',
        origin_city: 'Imphal',
        destination_city: 'Delhi',
        sender_info: 'John Doe (+91 9876543210)',
        receiver_info: 'Jane Smith (+91 9876543211)',
        item_count: 2,
        item_description: 'Laptop and reference books'
      };
      
      const { getEstimatedDelivery, getCurrentLocation, generateTrackingSteps } = await import('./tracking-utils');
      
      const trackingResult = {
        consignmentNo: demoInvoice.consignment_no,
        status: demoInvoice.status,
        origin: demoInvoice.origin_city || demoInvoice.from_location,
        destination: demoInvoice.destination_city || demoInvoice.to_location,
        estimatedDelivery: getEstimatedDelivery(demoInvoice.created_at),
        currentLocation: getCurrentLocation(demoInvoice.status, demoInvoice.from_location, demoInvoice.to_location),
        id: demoInvoice.id,
      };
      
      // Generate tracking steps
      const steps = generateTrackingSteps(demoInvoice);
      
      return { trackingResult, trackingSteps: steps };
    }
    
    // If no tracking data found
    console.log("No tracking data found for:", trackingNumber);
    return { trackingResult: null, trackingSteps: [] };
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return { trackingResult: null, trackingSteps: [] }; // Return empty result instead of throwing
  }
};
