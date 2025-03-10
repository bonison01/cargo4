import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import InvoiceCard, { InvoiceProps } from '@/components/ui/invoice-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FilePlus, Search, Package, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<InvoiceProps[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    pending: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        
        const { data: invoiceData, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (invoiceData) {
          const transformedInvoices: InvoiceProps[] = invoiceData.map(invoice => ({
            id: invoice.id,
            consignmentNo: invoice.consignment_no,
            from: invoice.from_location,
            to: invoice.to_location,
            date: new Date(invoice.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            status: invoice.status as 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled',
            amount: `₹${Number(invoice.amount).toLocaleString('en-IN')}`
          }));
          
          setInvoices(transformedInvoices);
          setFilteredInvoices(transformedInvoices);
          
          const active = invoiceData.filter(i => 
            i.status === 'processing' || i.status === 'in-transit'
          ).length;
          
          const delivered = invoiceData.filter(i => i.status === 'delivered').length;
          const pending = invoiceData.filter(i => i.status === 'pending').length;
          const totalValue = invoiceData.reduce((sum, i) => sum + Number(i.amount), 0);
          
          setStats({
            active,
            delivered,
            pending,
            totalValue
          });
        }
      } catch (error: any) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error fetching invoices",
          description: error.message || "Could not load your invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, [toast]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.consignmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return (
    <PageTransition>
      <Helmet>
        <title>Dashboard - Mateng Shipping</title>
        <meta name="description" content="Manage your shipments and invoices in your Mateng dashboard." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your shipments and invoices</p>
            </div>
            <Link to="/invoices/new">
              <Button className="bg-mateng-600 hover:bg-mateng-700">
                <FilePlus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-blue-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Active Shipments</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Currently in progress</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-green-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium">Delivered</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.delivered}</p>
              <p className="text-sm text-muted-foreground">Successfully delivered</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-orange-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-medium">Pending</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Awaiting processing</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-purple-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Total Value</h3>
              </div>
              <p className="text-3xl font-bold mb-1">₹{stats.totalValue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-muted-foreground">All shipments</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold">Recent Invoices</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-mateng-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      {searchTerm 
                        ? "No invoices found matching your search." 
                        : "No invoices yet. Create your first invoice!"}
                    </p>
                    {!searchTerm && (
                      <Link to="/invoices/new" className="mt-4 inline-block">
                        <Button className="bg-mateng-600 hover:bg-mateng-700">
                          <FilePlus className="mr-2 h-4 w-4" />
                          Create Invoice
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Dashboard;
