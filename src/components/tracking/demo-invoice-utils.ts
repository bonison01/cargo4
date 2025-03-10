
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a demo invoice for tracking if it doesn't already exist
 * Note: This function now delegates to an edge function to bypass RLS
 */
export const createDemoInvoice = async (): Promise<void> => {
  try {
    console.log("Creating demo invoice through edge function");
    
    const { data, error } = await supabase.functions.invoke('create-demo-invoice', {
      body: { trackingNumber: 'MT-202503657' }
    });
    
    if (error) {
      console.error("Error creating demo invoice:", error);
    } else {
      console.log("Demo invoice created successfully via edge function:", data);
    }
  } catch (error) {
    console.error("Error in createDemoInvoice:", error);
  }
};

/**
 * Fetches a demo tracking number for quick testing
 */
export const fetchDemoTrackingNumber = async (): Promise<string> => {
  try {
    console.log("Fetching demo tracking number");
    
    // Get a demo tracking number from public-tracking function
    const { data, error } = await supabase.functions.invoke('public-tracking', {
      body: { mode: 'demo' }
    });
    
    if (error) {
      console.error("Demo tracking error:", error);
      throw error;
    }
    
    if (data && data.demoConsignment) {
      console.log("Found demo tracking:", data.demoConsignment);
      return data.demoConsignment;
    } else {
      // If no demo invoice exists, trigger creation and use the standard demo number
      console.log("No demo invoice found, creating one");
      await createDemoInvoice();
      return 'MT-202503657';
    }
  } catch (error) {
    console.error('Error fetching demo tracking:', error);
    // Fallback to static demo and create it if it doesn't exist
    console.log("Using fallback demo tracking number MT-202503657");
    await createDemoInvoice();
    return 'MT-202503657';
  }
};

/**
 * Checks if we need to create a demo record on first load
 */
export const checkForDemoData = async (): Promise<void> => {
  try {
    // Check if demo invoice exists through the public function
    const { data, error } = await supabase.functions.invoke('public-tracking', {
      body: { mode: 'check-demo' }
    });
    
    if (error) {
      console.error("Error checking for demo data:", error);
      return;
    }
    
    // If no demo record exists, create it
    if (!data.demoExists) {
      await createDemoInvoice();
    }
  } catch (error) {
    console.error("Error in checkForDemoData:", error);
  }
};
