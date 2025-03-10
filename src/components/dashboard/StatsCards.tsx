
import React from 'react';
import { Package } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    active: number;
    delivered: number;
    pending: number;
    totalValue: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsCards;
