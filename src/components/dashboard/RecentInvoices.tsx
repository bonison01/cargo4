
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, FilePlus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InvoiceCard, { InvoiceProps } from '@/components/ui/invoice-card';

interface RecentInvoicesProps {
  invoices: InvoiceProps[];
  filteredInvoices: InvoiceProps[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({
  invoices,
  filteredInvoices,
  searchTerm,
  setSearchTerm,
  isLoading
}) => {
  return (
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
  );
};

export default RecentInvoices;
