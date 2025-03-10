
export interface Invoice {
  id: string;
  consignment_no: string;
  from_location: string;
  to_location: string;
  amount: number;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
  user_id?: string;
  weight?: number | null;
  items?: string | null;
}

export interface InvoiceFormData {
  consignmentNo: string;
  from: string;
  to: string;
  amount: string;
  items: string;
  weight: string;
  status: string;
  handlingFee: string;
  pickupFee: string;
  deliveryFee: string;
  dimensions: string;
}
