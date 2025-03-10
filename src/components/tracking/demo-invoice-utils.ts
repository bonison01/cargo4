
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a demo invoice for tracking if it doesn't already exist
 */
export const createDemoInvoice = async (): Promise<void> => {
  try {
    console.log("Creating demo invoice as no invoices exist");
    
    const demoInvoice = {
      consignment_no: 'MT-202503657',
      from_location: 'Imphal, Manipur',
      to_location: 'Delhi, India',
      status: 'in-transit',
      amount: 1250,
      weight: 5.2,
      user_id: '00000000-0000-0000-0000-000000000000', // Placeholder ID for public tracking
      items: 'Demo Shipment Package'
    };
    
    // First check if the demo invoice already exists
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('consignment_no', demoInvoice.consignment_no)
      .maybeSingle();
    
    if (existingInvoice) {
      console.log("Demo invoice already exists, skipping creation");
      return;
    }
    
    const { error } = await supabase
      .from('invoices')
      .insert(demoInvoice);
    
    if (error) {
      console.error("Error creating demo invoice:", error);
    } else {
      console.log("Demo invoice created successfully");
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
    
    // First check if MT-202503657 exists
    const { data: demoData } = await supabase
      .from('invoices')
      .select('consignment_no')
      .eq('consignment_no', 'MT-202503657')
      .maybeSingle();
    
    if (demoData) {
      console.log("Found demo tracking with MT-202503657");
      return demoData.consignment_no;
    }
    
    // If not, try to find any invoice
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
      return data[0].consignment_no;
    } else {
      // If no invoices exist, create one and use it
      console.log("No invoices found, creating demo invoice");
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
  } catch (error) {
    console.error("Error in checkForDemoData:", error);
  }
};
