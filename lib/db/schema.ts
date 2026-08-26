// lib/db/schema.ts
import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// 1. Products Table (Multi-Photo, In-Stock, & Featured Controls)
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(), // Stored in Naira (₦)
  description: text('description'),
  imageUrl: text('image_url').notNull(), // Cover photo
  images: jsonb('images').$type<string[]>().default([]).notNull(), // Photo array for carousel
  inStock: boolean('in_stock').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(), // Flag for homepage hero/featured row
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderReference: text('order_reference').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email').notNull(),
  deliveryState: text('delivery_state').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  totalAmount: integer('total_amount').notNull(),
  receiptUrl: text('receipt_url'),
  status: text('status').default('pending_verification').notNull(),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('customer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});