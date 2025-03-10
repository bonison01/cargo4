
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
  pickup_date?: string | null;
  origin_city?: string | null;
  destination_city?: string | null;
  sender_info?: string | null;
  receiver_info?: string | null;
  item_count?: number | null;
  item_photo?: string | null;
  item_description?: string | null;
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
  pickupDate: string;
  originCity: string;
  destinationCity: string;
  senderInfo: string;
  receiverInfo: string;
  itemCount: string;
  itemPhoto: string;
  itemDescription: string;
}
