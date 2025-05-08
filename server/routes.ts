import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { properties as propertiesSchema, insertPropertySchema, users, type Property, type InsertProperty } from "@shared/schema";
import { mockProperties, mockTestimonials, mockCategories, mockBenefits } from "./mock-data";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize mock data
  await initMockData();

  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { location, type, maxPrice, status } = req.query;
      
      // Fetch properties with optional filters
      const properties = await storage.getProperties({
        location: location as string | undefined,
        type: type as string | undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        status: status as string | undefined
      });
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const featuredProperties = await storage.getFeaturedProperties();
      res.json(featuredProperties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property details" });
    }
  });

  // Contact route
  app.post("/api/contact", async (req, res) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(8),
        message: z.string().min(10),
      });
      
      const validatedData = contactSchema.parse(req.body);
      
      // In a real application, this would send an email or store the contact in a database
      // For now, we'll just return success
      res.json({ success: true, message: "Contact request submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Benefits
  app.get("/api/benefits", async (req, res) => {
    try {
      const benefits = await storage.getBenefits();
      res.json(benefits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch benefits" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real application, this would store the email in a database
      // For now, we'll just return success
      res.json({ success: true, message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize mock data - in a real application, this would come from the database
async function initMockData() {
  try {
    // Insert mock properties if they don't exist yet
    const existingProperties = await storage.getProperties({});
    if (existingProperties.length === 0) {
      for (const property of mockProperties) {
        await storage.createProperty(property);
      }
    }

    // Add mock testimonials
    for (const testimonial of mockTestimonials) {
      await storage.createTestimonial(testimonial);
    }

    // Add mock categories
    for (const category of mockCategories) {
      await storage.createCategory(category);
    }

    // Add mock benefits
    for (const benefit of mockBenefits) {
      await storage.createBenefit(benefit);
    }
  } catch (error) {
    console.error("Failed to initialize mock data:", error);
  }
}
