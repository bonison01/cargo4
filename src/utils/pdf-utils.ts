
import { Invoice } from "@/types/invoice";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFontSize(20);
  doc.text("Mateng Shipping Invoice", 20, 20);
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #${invoice.consignment_no}`, 20, 40);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 50);
  
  // Shipping details
  doc.text("Shipping Details", 20, 70);
  doc.text(`From: ${invoice.from_location}`, 20, 80);
  doc.text(`To: ${invoice.to_location}`, 20, 90);
  
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
  
  // Charges table
  (doc as any).autoTable({
    startY: 100,
    head: [['Description', 'Amount']],
    body: [
      ['Basic Freight', `₹${charges.basicFreight}`],
      ['COD', `₹${charges.cod}`],
      ['Freight Handling', `₹${charges.freightHandling}`],
      ['Pickup & Delivery', `₹${charges.pickupDelivery}`],
      ['Packaging', `₹${charges.packaging}`],
      ['CWB Charge', `₹${charges.cwbCharge}`],
      ['Other Charges', `₹${charges.otherCharges}`],
      ['Subtotal', `₹${subtotal}`],
      ['Tax (18% GST)', `₹${tax}`],
      ['Total', `₹${total}`],
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
