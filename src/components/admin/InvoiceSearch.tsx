
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InvoiceSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const InvoiceSearch: React.FC<InvoiceSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};

export default InvoiceSearch;
