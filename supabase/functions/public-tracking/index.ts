
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'

// Allow requests from any origin
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Parse the request body
    const { trackingNumber, mode } = await req.json()
    console.log("Public tracking request:", { trackingNumber, mode })

    // If mode is 'demo', return a demo tracking number
    if (mode === 'demo') {
      // Check if a demo invoice already exists
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('consignment_no')
        .eq('consignment_no', 'MT-202503657')
        .limit(1)

      if (invoiceError) {
        console.error("Error checking for demo invoice:", invoiceError)
        return new Response(
          JSON.stringify({ error: 'Failed to check for demo invoice' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (invoices && invoices.length > 0) {
        return new Response(
          JSON.stringify({ demoConsignment: invoices[0].consignment_no }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ demoConsignment: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // If mode is 'check-demo', check if demo data exists
    if (mode === 'check-demo') {
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('id')
        .eq('consignment_no', 'MT-202503657')
        .limit(1)

      if (invoiceError) {
        console.error("Error checking for demo data:", invoiceError)
        return new Response(
          JSON.stringify({ error: 'Failed to check for demo data' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ demoExists: invoices && invoices.length > 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch invoice data by tracking number
    if (trackingNumber) {
      // Add logging for debugging
      console.log("Fetching invoice with consignment number:", trackingNumber)
      
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('consignment_no', trackingNumber)
        .maybeSingle()

      if (invoiceError) {
        console.error("Error fetching invoice data:", invoiceError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch invoice data', details: invoiceError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Add logging to see what was returned
      console.log("Invoice data found:", invoice ? "Yes" : "No")
      
      return new Response(
        JSON.stringify({ invoice: invoice || null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error("Public tracking error:", error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
