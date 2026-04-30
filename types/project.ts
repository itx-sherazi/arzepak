export interface ProjectUnit {
  name: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ProjectUpdate {
  _id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
}

export interface NearbyItem {
  label: string;
  mapsUrl?: string;
}

export interface ProjectDetail {
  _id: string;
  title: string;
  slug: string;
  city: string;
  address: string;
  description?: string;
  developer?: string;
  marketedBy?: string;
  minPrice?: number;
  maxPrice?: number;
  totalUnits?: number;
  completionDate?: string;
  offering: string[];
  amenities?: string[];
  features?: {
    mainFeatures: string[];
    plotFeatures: string[];
    businessComm: string[];
    nearbyFacilities: string[];
    otherFacilities: string[];
  };
  logo?: string;
  images: string[];
  floorPlans: { label: string; image: string }[];
  galleries?: { title: string; images: string[] }[];
  paymentPlan?: string;
  paymentPlans?: { label: string; image: string }[];
  units?: ProjectUnit[];
  updates?: ProjectUpdate[];
  isFeatured: boolean;
  status: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  nearbyNote?: string;
  nearbyItems?: NearbyItem[];
}

export interface ProjectListItem {
  _id: string;
  title: string;
  slug: string;
  city: string;
  address: string;
  developer?: string;
  minPrice?: number;
  maxPrice?: number;
  images: string[];
  isFeatured: boolean;
  offering: string[];
  status: string;
  createdAt: string;
}

/** Landing “New Projects” card — minimal + units for min price. */
export interface ProjectCardPreview {
  _id: string;
  slug: string;
  title: string;
  developer?: string;
  city: string;
  status: string;
  images: string[];
  units?: { name: string; minPrice: number }[];
}
