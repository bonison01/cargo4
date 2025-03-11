import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Truck, PackageCheck, Share2, Twitter, Facebook, Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackTimeline from '@/components/ui/track-timeline';
import { TrackingResult } from './tracking-utils';
import { toast } from 'sonner';

interface TrackingResultDisplayProps {
  trackingResult: TrackingResult | null;
  trackingSteps: any[];
  onViewInvoice: () => void;
  isLoading?: boolean;
}

const TrackingResultDisplay: React.FC<TrackingResultDisplayProps> = ({ 
  trackingResult, 
  trackingSteps,
  onViewInvoice,
  isLoading
}) => {
  if (!trackingResult) return null;
  
  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString())
      .then(() => toast.success('Tracking link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Track my shipment #${trackingResult.consignmentNo} from ${trackingResult.origin} to ${trackingResult.destination}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };
  
  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };
  
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Track my shipment #${trackingResult.consignmentNo}`);
    const body = encodeURIComponent(
      `Track my shipment #${trackingResult.consignmentNo} from ${trackingResult.origin} to ${trackingResult.destination}. Current status: ${trackingResult.status}. Check it here: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="bg-mateng-50 border-b border-mateng-100 p-5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Shipment Details</h2>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-mateng-500/10 text-mateng-700">
              {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
            </span>
          </div>
          <p className="text-lg mb-1">{trackingResult.consignmentNo}</p>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                <p className="font-medium">{trackingResult.origin}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">To</p>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
                <p className="font-medium">{trackingResult.destination}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Location</p>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-mateng-600 mr-2" />
                <p className="font-medium">{trackingResult.currentLocation}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
              <div className="flex items-center">
                <PackageCheck className="h-5 w-5 text-mateng-600 mr-2" />
                <p className="font-medium">{trackingResult.estimatedDelivery}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shipment Progress</p>
              <div className="mt-2">
                <div className="w-full h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-mateng-600 rounded-full" 
                    style={{ 
                      width: trackingResult.status === 'pending' ? '25%' : 
                             trackingResult.status === 'processing' ? '50%' : 
                             trackingResult.status === 'in-transit' ? '75%' : 
                             trackingResult.status === 'delivered' ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <p className="text-right text-sm text-mateng-600 mt-1">
                  {trackingResult.status === 'pending' ? '25%' : 
                   trackingResult.status === 'processing' ? '50%' : 
                   trackingResult.status === 'in-transit' ? '75%' : 
                   trackingResult.status === 'delivered' ? '100%' : '0%'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <p className="text-sm text-muted-foreground mr-2 w-full sm:w-auto">Share:</p>
              <Button 
                onClick={handleCopyLink} 
                size="icon" 
                variant="outline" 
                className="h-8 w-8"
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleShareTwitter} 
                size="icon" 
                variant="outline" 
                className="h-8 w-8"
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleShareFacebook}
                size="icon" 
                variant="outline" 
                className="h-8 w-8"
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleShareEmail}
                size="icon" 
                variant="outline" 
                className="h-8 w-8"
                title="Share via Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={onViewInvoice}
              className="text-sm"
              variant="outline"
            >
              View Invoice Details
            </Button>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Tracking History</h3>
        <TrackTimeline steps={trackingSteps} />
      </div>
    </motion.div>
  );
};

export default TrackingResultDisplay;
