
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FilePlus, Search, Package, Loader2, Eye, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        return;
      }
      
      const userEmail = session.user.email || '';
      setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
      
      if (!userEmail.endsWith('@mateng.com') && !userEmail.includes('admin')) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
    };
    
    checkAdminStatus();
  }, [toast]);

  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        setIsLoading(true);
        
        // Fixed query: Don't try to join on user_id, just fetch invoices
        const { data: invoiceData, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (invoiceData) {
          setInvoices(invoiceData);
          setFilteredInvoices(invoiceData);
        }
      } catch (error: any) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error fetching invoices",
          description: error.message || "Could not load invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchAllInvoices();
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.consignment_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to_location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  if (!isAdmin) {
    return (
      <PageTransition>
        <Helmet>
          <title>Admin Access Denied - Mateng Shipping</title>
        </Helmet>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-8">You don't have permission to access the admin dashboard.</p>
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
        <title>Admin Dashboard - Mateng Shipping</title>
        <meta name="description" content="Admin dashboard for Mateng Shipping." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all shipments and invoices</p>
            </div>
            <Link to="/invoices/new">
              <Button className="bg-mateng-600 hover:bg-mateng-700">
                <FilePlus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          </div>
          
          <div className="mb-8">
            <div className="relative w-full md:w-96 mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search invoices by consignment no, origin, or destination..."
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
            <div className="glass-card rounded-xl p-6 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
              
              {filteredInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consignment No</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Product Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.consignment_no}</TableCell>
                        <TableCell>{invoice.from_location}</TableCell>
                        <TableCell>{invoice.to_location}</TableCell>
                        <TableCell>₹{invoice.amount}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link to={`/invoices/${invoice.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/admin/invoices/edit/${invoice.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    {searchTerm 
                      ? "No invoices found matching your search." 
                      : "No invoices have been created yet."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
