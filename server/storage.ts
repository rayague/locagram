import { 
  users, 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty, 
  type Testimonial,
  type Category,
  type Benefit,
  type PropertySearchParams
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getProperties(params: PropertySearchParams): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: Testimonial): Promise<Testimonial>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: Category): Promise<Category>;

  // Benefit methods
  getBenefits(): Promise<Benefit[]>;
  createBenefit(benefit: Benefit): Promise<Benefit>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private testimonials: Map<number, Testimonial>;
  private categories: Map<string, Category>;
  private benefits: Map<string, Benefit>;
  
  private userCurrentId: number;
  private propertyCurrentId: number;
  private testimonialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.testimonials = new Map();
    this.categories = new Map();
    this.benefits = new Map();
    
    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.testimonialCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user", 
      createdAt: now,
      fullName: insertUser.fullName || null
    };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(params: PropertySearchParams): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    // Apply filters if provided
    if (params.location) {
      properties = properties.filter(p => 
        p.location.toLowerCase().includes(params.location!.toLowerCase()) ||
        p.city.toLowerCase().includes(params.location!.toLowerCase())
      );
    }
    
    if (params.type) {
      properties = properties.filter(p => p.type === params.type);
    }
    
    if (params.maxPrice) {
      properties = properties.filter(p => p.price <= params.maxPrice!);
    }
    
    if (params.status) {
      properties = properties.filter(p => p.status === params.status);
    }

    return properties;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.isFeatured);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const now = new Date();
    
    // Create the property with explicit typing to handle optional fields
    const property: Property = { 
      id,
      title: insertProperty.title,
      description: insertProperty.description,
      price: insertProperty.price,
      priceUnit: insertProperty.priceUnit,
      location: insertProperty.location,
      city: insertProperty.city,
      country: insertProperty.country,
      bedrooms: insertProperty.bedrooms,
      bathrooms: insertProperty.bathrooms,
      area: insertProperty.area,
      type: insertProperty.type,
      status: insertProperty.status,
      images: insertProperty.images,
      features: insertProperty.features,
      landArea: insertProperty.landArea || null,
      isFurnished: insertProperty.isFurnished || false,
      isFeatured: insertProperty.isFeatured || false,
      createdAt: now,
      updatedAt: now
    };
    
    this.properties.set(id, property);
    return property;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: Testimonial): Promise<Testimonial> {
    const id = testimonial.id || this.testimonialCurrentId++;
    const newTestimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: Category): Promise<Category> {
    this.categories.set(category.id, category);
    return category;
  }

  // Benefit methods
  async getBenefits(): Promise<Benefit[]> {
    return Array.from(this.benefits.values());
  }

  async createBenefit(benefit: Benefit): Promise<Benefit> {
    this.benefits.set(benefit.id, benefit);
    return benefit;
  }
}

export const storage = new MemStorage();
