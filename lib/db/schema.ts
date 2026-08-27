// lib/db/schema.ts
import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('customer'), // 'admin' (Super Admin) | 'editor' (Staff Admin) | 'customer'
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  description: text('description').default(''),
  imageUrl: text('image_url').notNull(),
  images: jsonb('images').$type<string[]>().default([]),
  inStock: boolean('in_stock').default(true),
  stockQuantity: integer('stock_quantity').default(10), // Live product stock count
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderReference: text('order_reference').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  deliveryState: text('delivery_state').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  recipientName: text('recipient_name'),
  recipientPhone: text('recipient_phone'),
  alternateAddress: text('alternate_address'),
  isDropship: boolean('is_dropship').default(false),
  totalAmount: integer('total_amount').notNull(),
  receiptUrl: text('receipt_url'),
  status: text('status').notNull().default('pending_verification'),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});