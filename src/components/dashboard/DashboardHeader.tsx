
import React from 'react';
import { FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHeader: React.FC = () => {
  return (
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
  );
};

export default DashboardHeader;
