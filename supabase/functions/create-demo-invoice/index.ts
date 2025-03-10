
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'

// Allow requests from any origin
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Parse the request body
    const { trackingNumber } = await req.json()
    console.log("Creating demo invoice:", { trackingNumber })

    if (!trackingNumber) {
      return new Response(
        JSON.stringify({ error: 'Tracking number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if invoice already exists
    const { data: existingInvoice, error: checkError } = await supabase
      .from('invoices')
      .select('id')
      .eq('consignment_no', trackingNumber)
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing invoice:", checkError)
      return new Response(
        JSON.stringify({ error: 'Failed to check for existing invoice' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // If invoice already exists, return success
    if (existingInvoice && existingInvoice.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Demo invoice already exists', id: existingInvoice[0].id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a demo invoice
    const demoInvoice = {
      consignment_no: trackingNumber,
      from_location: 'Imphal, Manipur',
      to_location: 'Delhi, NCR',
      status: 'in-transit',
      weight: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: null, // This makes it a public demo invoice
      sender_name: 'Demo Sender',
      sender_phone: '9876543210',
      recipient_name: 'Demo Recipient',
      recipient_phone: '1234567890',
      item_description: 'Demo Package',
      amount: 500.00,
      payment_status: 'paid',
      mode: 'road',
    }

    // Insert the demo invoice
    const { data: newInvoice, error: insertError } = await supabase
      .from('invoices')
      .insert(demoInvoice)
      .select('id')
      .single()

    if (insertError) {
      console.error("Error creating demo invoice:", insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create demo invoice', details: insertError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Demo invoice created successfully', id: newInvoice.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in create-demo-invoice:", error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
