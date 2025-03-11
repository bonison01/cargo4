
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a demo tracking number for quick testing
 */
export const fetchDemoTrackingNumber = async (): Promise<string> => {
  try {
    console.log("Using fixed demo tracking number MT-202503657");
    return 'MT-202503657';
  } catch (error) {
    console.error('Error fetching demo tracking:', error);
    // Always fall back to the static demo number
    return 'MT-202503657';
  }
};

/**
 * Creates a demo invoice for tracking if it doesn't already exist
 * This is mostly for documentation purposes - we use the fallback mechanism now
 */
export const createDemoInvoice = async (): Promise<void> => {
  console.log("Demo tracking now uses client-side fallback");
};

/**
 * Checks if we need to create a demo record on first load
 */
export const checkForDemoData = async (): Promise<void> => {
  console.log("Demo tracking now uses client-side fallback");
};
