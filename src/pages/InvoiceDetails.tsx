
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, ArrowRight, Printer, Clock, Edit, FileText, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import TrackTimeline, { TrackingStep } from '@/components/ui/track-timeline';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email || '';
        setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
      }
    };
    
    checkAdminStatus();
  }, []);

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setInvoice(data);
          
          // Generate tracking steps based on status
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
        }
      } catch (error: any) {
        console.error('Error fetching invoice details:', error);
        toast({
          title: "Error fetching invoice details",
          description: error.message || "Could not load the invoice. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchInvoiceDetails();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-mateng-600" />
          </div>
        </main>
      </PageTransition>
    );
  }

  if (!invoice) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Invoice Not Found</h1>
            <p className="mb-8">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/dashboard">
              <Button className="bg-mateng-600 hover:bg-mateng-700">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Invoice #{invoice.consignment_no} - Mateng Shipping</title>
        <meta name="description" content={`Details for shipment from ${invoice.from_location} to ${invoice.to_location}`} />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">Invoice Details</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  invoice.status === 'delivered' 
                    ? 'bg-status-delivered/10 text-status-delivered' 
                    : invoice.status === 'in-transit'
                      ? 'bg-status-transit/10 text-status-transit'
                      : invoice.status === 'processing'
                        ? 'bg-status-processing/10 text-status-processing'
                        : invoice.status === 'cancelled'
                          ? 'bg-status-cancelled/10 text-status-cancelled'
                          : 'bg-status-pending/10 text-status-pending'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground">Consignment #{invoice.consignment_no}</p>
            </div>
            <div className="flex gap-3">
              {isAdmin && (
                <Link to={`/admin/invoices/edit/${invoice.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Invoice
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipment Information */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-mateng-600" />
                  <h2 className="text-xl font-semibold">Shipment Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                      <p className="font-medium">{invoice.from_location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                      <p className="font-medium">{invoice.to_location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created On</p>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-mateng-600 mr-2" />
                      <p className="font-medium">{new Date(invoice.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product Value</p>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-mateng-600 mr-2" />
                      <p className="font-medium">₹{invoice.amount}</p>
                    </div>
                  </div>
                  {invoice.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p className="font-medium">{invoice.weight} kg</p>
                    </div>
                  )}
                  {invoice.items && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Items</p>
                      <p className="font-medium">{invoice.items}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tracking Timeline */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-mateng-600" />
                  <h2 className="text-xl font-semibold">Tracking History</h2>
                </div>
                
                <TrackTimeline steps={trackingSteps} />
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Pricing Summary */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>₹{Math.round(Number(invoice.amount) * 0.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight Charges</span>
                    <span>₹{invoice.weight ? Math.round(Number(invoice.weight) * 50) : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Handling Fee</span>
                    <span>₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Charges</span>
                    <span>₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    <span>₹150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>₹{Math.round((Number(invoice.amount) * 0.1 + (invoice.weight ? Number(invoice.weight) * 50 : 0) + 450) * 0.18)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{Math.round((Number(invoice.amount) * 0.1 + (invoice.weight ? Number(invoice.weight) * 50 : 0) + 450) * 1.18)}</span>
                  </div>
                </div>
              </div>
              
              {/* Additional Actions */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Shipping Label
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Invoice PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default InvoiceDetails;
