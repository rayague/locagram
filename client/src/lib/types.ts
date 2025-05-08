export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  location: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  landArea?: number;
  isFurnished?: boolean;
  type: PropertyType;
  status: PropertyStatus;
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'land' | 'all';
export type PropertyStatus = 'for_sale' | 'for_rent';

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface SearchParams {
  location?: string;
  type?: PropertyType;
  maxPrice?: number;
  minBedrooms?: number;
  status?: PropertyStatus;
}
