/** Public listing (catalog / search results). */
export interface PropertyListItem {
  _id: string;
  slug: string;
  title: string;
  purpose: string;
  type: string;
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  city: string;
  areaName: string;
  images: Array<string | { url: string; publicId?: string }>;
  isFeatured: boolean;
  dealerId?: { agencyName: string; isVerified: boolean };
  createdAt: string;
}

export interface PropertyDealerPublic {
  _id: string;
  agencyName: string;
  whatsapp: string;
  city: string;
  bio: string;
  logo: string;
  isVerified: boolean;
  areasServed: string[];
  experience: number;
}

/** Single property (detail page). */
export interface PropertyDetail {
  _id: string;
  title: string;
  description: string;
  purpose: string;
  type: string;
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  furnishing?: string;
  buildYear?: number;
  city: string;
  areaName: string;
  address?: string;
  images: Array<string | { url: string; publicId?: string }>;
  amenities?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  contactEmail?: string;
  contactMobiles?: string[];
  contactLandline?: string;
  features?: Record<string, string | number | boolean>;
  installmentAvailable?: boolean;
  advanceAmount?: number;
  noOfInstallments?: number;
  monthlyInstallment?: number;
  balloonPayment?: boolean;
  balloonAmount?: number;
  noOfBalloonPayments?: number;
  ballotingFee?: number;
  possessionFee?: number;
  developmentFee?: number;
  slug: string;
  status: string;
  isFeatured: boolean;
  dealerId?: PropertyDealerPublic;
  createdAt: string;
}
