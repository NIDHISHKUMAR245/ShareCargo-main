export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  cargoType: string;
  weight: number; // kg
  volume: number; // CBM
  status: ShipmentStatus;
  containerShare: ContainerShare;
  pricing: PricingBreakdown;
  coShippers: CoShipper[];
  milestones: TrackingMilestone[];
  createdAt: string;
}

export type ShipmentStatus =
  | "pending_match"
  | "matched"
  | "confirmed"
  | "in_transit"
  | "arrived"
  | "delivered"
  | "cancelled";

export interface ContainerShare {
  containerType: "20ft" | "40ft" | "40ft HC";
  totalCapacity: number; // CBM
  usedCapacity: number; // CBM
  yourShare: number; // CBM
  fillPercentage: number;
}

export interface PricingBreakdown {
  fullContainerCost: number;
  yourBaseCost: number;
  bookingFee: number;
  serviceFee: number;
  managementFee: number;
  totalCost: number;
  savings: number;
  savingsPercentage: number;
  currency: string;
}

export interface CoShipper {
  id: string;
  name: string;
  verificationLevel: "basic" | "verified" | "premium";
  cargoType: string;
  volumeShare: number;
}

export interface TrackingMilestone {
  id: string;
  event: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface ShipmentFormData {
  // Origin & Destination
  originPort: string;
  destinationPort: string;
  // Cargo Details
  cargoType: string;
  cargoDescription: string;
  weight: number;
  volume: number;
  // Timeline
  readyDate: string;
  preferredDeparture: string;
  // Preferences
  flexibilityDays: number;
  hazardous: boolean;
  temperatureControlled: boolean;
}

export interface ContainerMatch {
  id: string;
  matchScore: number;
  containerType: "20ft" | "40ft" | "40ft HC";
  availableSpace: number;
  departureDate: string;
  originPort: string;
  destinationPort: string;
  currentShippers: number;
  maxShippers: number;
  estimatedTransitDays: number;
  pricing: PricingBreakdown;
  coShippers: CoShipper[];
  shippingLine: string;
}

export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  totalSavings: number;
  avgSavingsPercentage: number;
  totalVolumeShipped: number;
  co2Saved: number;
}
