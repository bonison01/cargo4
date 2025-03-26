
import { Invoice } from "@/types/invoice";
import jsPDF from "jspdf";
// Import jspdf-autotable correctly
import 'jspdf-autotable';
// Ensure we have the correct type for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFontSize(20);
  doc.text("Mateng Shipping Invoice", 20, 20);
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #${invoice.consignment_no}`, 20, 40);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 50);
  
  // From/To details with sender and receiver info
  doc.setFontSize(14);
  doc.text("Shipping Details", 20, 70);
  
  doc.setFontSize(12);
  // From details
  doc.text("From:", 20, 85);
  doc.text(`${invoice.from_location}`, 25, 95);
  if (invoice.sender_info) {
    doc.text(`Sender: ${invoice.sender_info}`, 25, 105);
  }

  // To details
  doc.text("To:", 120, 85);
  doc.text(`${invoice.to_location}`, 125, 95);
  if (invoice.receiver_info) {
    doc.text(`Receiver: ${invoice.receiver_info}`, 125, 105);
  }
  
  // Parse charges from invoice.item_description if it exists and contains charge data
  let charges = {
    basicFreight: 0,
    cod: 0,
    freightHandling: 0,
    pickupDelivery: 0,
    packaging: 0,
    cwbCharge: 0,
    otherCharges: 0
  };
  
  // Try to parse charges from item_description if available
  if (invoice.item_description && invoice.item_description.includes('charges:')) {
    try {
      const chargesStr = invoice.item_description.split('charges:')[1].trim();
      charges = JSON.parse(chargesStr);
    } catch (e) {
      console.log('Error parsing charges from item_description:', e);
    }
  }
  
  const subtotal = charges.basicFreight + charges.cod + charges.freightHandling + 
                   charges.pickupDelivery + charges.packaging + charges.cwbCharge + 
                   charges.otherCharges;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  
  // Shipment details
  doc.text("Shipment Information", 20, 125);
  doc.autoTable({
    startY: 130,
    head: [['Description', 'Value']],
    body: [
      ['Weight', `${invoice.weight || 'N/A'} kg`],
      ['Items', invoice.items || 'N/A'],
      ['Product Value', `₹${invoice.amount}`],
      ['Status', invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)],
      ['Mode', invoice.mode || 'Road']
    ],
  });
  
  // Charges table
  doc.text("Pricing Details", 20, doc.lastAutoTable.finalY + 15);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Charge Type', 'Amount (₹)']],
    body: [
      ...(charges.basicFreight > 0 ? [['Basic Freight', charges.basicFreight]] : []),
      ...(charges.cod > 0 ? [['COD', charges.cod]] : []),
      ...(charges.freightHandling > 0 ? [['Freight Handling', charges.freightHandling]] : []),
      ...(charges.pickupDelivery > 0 ? [['Pickup & Delivery', charges.pickupDelivery]] : []),
      ...(charges.packaging > 0 ? [['Packaging', charges.packaging]] : []),
      ...(charges.cwbCharge > 0 ? [['CWB Charge', charges.cwbCharge]] : []),
      ...(charges.otherCharges > 0 ? [['Other Charges', charges.otherCharges]] : []),
      ['Subtotal', subtotal],
      ['Tax (18% GST)', tax],
      ['Total', total],
    ],
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.text("Thank you for choosing Mateng Shipping!", 20, pageHeight - 20);
  
  return doc;
};

export const generateShippingLabel = (invoice: Invoice) => {
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFontSize(16);
  doc.text("Mateng Shipping Label", 20, 20);
  
  // Barcode or QR code could be added here
  doc.setFontSize(14);
  doc.text(`Consignment #${invoice.consignment_no}`, 20, 40);
  
  // From address
  doc.setFontSize(12);
  doc.text("From:", 20, 60);
  doc.text(invoice.from_location, 20, 70);
  
  // To address
  doc.text("To:", 20, 90);
  doc.text(invoice.to_location, 20, 100);
  
  // Additional details
  doc.text(`Weight: ${invoice.weight}kg`, 20, 120);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 130);
  
  return doc;
};
