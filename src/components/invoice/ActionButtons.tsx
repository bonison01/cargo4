
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText, FilePdf, Download } from 'lucide-react';

interface ActionButtonsProps {
  onPrintLabel: () => void;
  onDownloadInvoice: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPrintLabel, onDownloadInvoice }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onPrintLabel}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Shipping Label
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onDownloadInvoice}
        >
          <FilePdf className="h-4 w-4 mr-2" />
          Download Invoice PDF
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
