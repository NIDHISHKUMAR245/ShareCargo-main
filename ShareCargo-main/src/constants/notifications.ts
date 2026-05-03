export interface AppNotification {
  id: string;
  type: "shipment" | "match" | "payment" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-001",
    type: "shipment",
    title: "Shipment milestone reached",
    message: "Your shipment SC2024-0891-TL arrived at Singapore transshipment hub.",
    timestamp: "2025-04-19T10:32:00Z",
    read: false,
  },
  {
    id: "notif-002",
    type: "match",
    title: "New container match found",
    message: "A 97% match is available for your Shanghai → Rotterdam route departing Jan 22.",
    timestamp: "2025-04-19T08:15:00Z",
    read: false,
  },
  {
    id: "notif-003",
    type: "payment",
    title: "Payment confirmed",
    message: "Your payment of $765 for SC2024-0891-TL has been successfully processed.",
    timestamp: "2025-04-18T16:44:00Z",
    read: false,
  },
  {
    id: "notif-004",
    type: "shipment",
    title: "Vessel departed",
    message: "COSCO Shipping vessel carrying your cargo departed Shanghai at 22:00 UTC.",
    timestamp: "2025-04-17T22:10:00Z",
    read: true,
  },
  {
    id: "notif-005",
    type: "match",
    title: "Container space filling up",
    message: "The 40ft container on your LA → Hamburg route is now 92% full. Book now.",
    timestamp: "2025-04-17T09:05:00Z",
    read: true,
  },
  {
    id: "notif-006",
    type: "system",
    title: "Identity verification complete",
    message: "Your account has been upgraded to Verified status. You now have full platform access.",
    timestamp: "2025-04-15T13:20:00Z",
    read: true,
  },
  {
    id: "notif-007",
    type: "shipment",
    title: "Delivery confirmed",
    message: "Shipment SC2024-0612-SG has been delivered to Sydney, Australia successfully.",
    timestamp: "2025-04-14T07:55:00Z",
    read: true,
  },
];
