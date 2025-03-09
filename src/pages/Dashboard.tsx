
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import PageTransition from '@/components/ui/page-transition';
import InvoiceCard, { InvoiceProps } from '@/components/ui/invoice-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FilePlus, Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';

const demoInvoices: InvoiceProps[] = [
  {
    id: '1',
    consignmentNo: 'MT-2024050001',
    from: 'Imphal',
    to: 'Delhi',
    date: 'May 15, 2024',
    status: 'in-transit',
    amount: '₹2,500'
  },
  {
    id: '2',
    consignmentNo: 'MT-2024050002',
    from: 'Delhi',
    to: 'Imphal',
    date: 'May 14, 2024',
    status: 'processing',
    amount: '₹1,800'
  },
  {
    id: '3',
    consignmentNo: 'MT-2024050003',
    from: 'Imphal',
    to: 'Delhi',
    date: 'May 10, 2024',
    status: 'delivered',
    amount: '₹3,200'
  },
  {
    id: '4',
    consignmentNo: 'MT-2024050004',
    from: 'Delhi',
    to: 'Imphal',
    date: 'May 5, 2024',
    status: 'delivered',
    amount: '₹2,100'
  },
  {
    id: '5',
    consignmentNo: 'MT-2024050005',
    from: 'Imphal',
    to: 'Delhi',
    date: 'May 1, 2024',
    status: 'delivered',
    amount: '₹1,950'
  },
  {
    id: '6',
    consignmentNo: 'MT-2024050006',
    from: 'Delhi',
    to: 'Imphal',
    date: 'May 18, 2024',
    status: 'pending',
    amount: '₹2,750'
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredInvoices, setFilteredInvoices] = React.useState(demoInvoices);

  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(demoInvoices);
      return;
    }
    
    const filtered = demoInvoices.filter(invoice => 
      invoice.consignmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm]);

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
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-blue-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Active Shipments</h3>
              </div>
              <p className="text-3xl font-bold mb-1">3</p>
              <p className="text-sm text-muted-foreground">Currently in progress</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-green-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium">Delivered</h3>
              </div>
              <p className="text-3xl font-bold mb-1">28</p>
              <p className="text-sm text-muted-foreground">Successfully delivered</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-orange-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-medium">Pending</h3>
              </div>
              <p className="text-3xl font-bold mb-1">2</p>
              <p className="text-sm text-muted-foreground">Awaiting processing</p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="bg-purple-50 p-2 rounded-md mr-3">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Total Value</h3>
              </div>
              <p className="text-3xl font-bold mb-1">₹14,300</p>
              <p className="text-sm text-muted-foreground">All shipments</p>
            </div>
          </div>
          
          {/* Recent Invoices */}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice, index) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-muted-foreground">No invoices found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Dashboard;
