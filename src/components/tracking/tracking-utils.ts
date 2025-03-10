
// Utility functions for tracking shipments

export const getEstimatedDelivery = (createdAt: string) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 3); // Estimate 3 days for delivery
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getCurrentLocation = (status: string, origin: string, destination: string) => {
  switch(status) {
    case 'pending':
      return origin;
    case 'processing':
      return 'Sorting Center, ' + origin.split(',')[1]?.trim() || origin;
    case 'in-transit':
      return 'Transit Hub, Guwahati';
    case 'delivered':
      return destination;
    default:
      return origin;
  }
};

export interface TrackingResult {
  consignmentNo: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation: string;
  id: string;
}

export const generateTrackingSteps = (data: any) => {
  const steps = [];
  const statuses = ['pending', 'processing', 'in-transit', 'delivered'];
  const statusLabels = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];
  const createdDate = new Date(data.created_at);
  
  // Find the current status index
  const currentStatusIndex = statuses.indexOf(data.status);
  
  for (let i = 0; i < statuses.length; i++) {
    const isCompleted = i <= currentStatusIndex;
    const isCurrent = i === currentStatusIndex;
    
    // Calculate a date that's i days after created date
    const stepDate = new Date(createdDate);
    stepDate.setDate(createdDate.getDate() + i);
    
    steps.push({
      status: statusLabels[i],
      location: i === 0 ? data.from_location : 
                i === statuses.length - 1 ? data.to_location : 
                i === 1 ? 'Sorting Center' : 'Transit Hub',
      timestamp: isCompleted ? 
                stepDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) +
                ' • ' + stepDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) :
                'Estimated: ' + new Date(createdDate.setDate(createdDate.getDate() + 3)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}),
      isCompleted,
      isCurrent
    });
  }
  
  return steps;
};
