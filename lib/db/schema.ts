// lib/db/schema.ts
import { pgTable, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export interface ColorVariant {
  name: string;
  image?: string;
  stock: number; // units available for this specific color shade
}

export interface DeliveryZone {
  id: string;
  label: string;
  fee: number;
}

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  description: text('description').default(''),
  imageUrl: text('image_url').notNull(),
  images: json('images').$type<string[]>().default([]),
  colors: json('colors').$type<ColorVariant[]>().default([]),
  inStock: boolean('in_stock').default(true),
  stockQuantity: integer('stock_quantity').default(10),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderReference: text('order_reference').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email').default(''),
  deliveryState: text('delivery_state').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  recipientName: text('recipient_name').default(''),
  recipientPhone: text('recipient_phone').default(''),
  alternateAddress: text('alternate_address').default(''),
  isDropship: boolean('is_dropship').default(false),
  totalAmount: integer('total_amount').notNull(),
  receiptUrl: text('receipt_url'),
  status: text('status').default('pending_verification'),
  items: json('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  role: text('role').default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey(),
  bankName: text('bank_name').default('OPay'),
  accountNumber: text('account_number').default('7062297299'),
  accountName: text('account_name').default('OYELEYE MARVELLOUS'),
  contactAddress: text('contact_address').default('3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State'),
  contactPhone: text('contact_phone').default('+234 706 229 7299'),
  whatsappNumber: text('whatsapp_number').default('07062297299'),
  operatingHours: text('operating_hours').default('Mon – Sat: 8:00 AM – 6:00 PM'),
  deliveryZones: json('delivery_zones')
    .$type<DeliveryZone[]>()
    .default([
      { id: 'pickup', label: 'Store Pickup — 3 Olanipekun St, Ojodu Berger', fee: 0 },
      { id: 'berger_ikeja', label: 'Ojodu Berger / Ikeja / Omole / Magodo', fee: 2500 },
      { id: 'mainland_central', label: 'Yaba / Surulere / Maryland / Gbagada', fee: 3500 },
      { id: 'mainland_outer', label: 'Festac / Alimosho / Ikorodu / Egbeda', fee: 4500 },
      { id: 'island_core', label: 'Lagos Island / Ikoyi / Victoria Island / Lekki Phase 1', fee: 5500 },
      { id: 'island_far', label: 'Chevron / Ajah / Sangotedo / Badore', fee: 7000 },
      { id: 'interstate', label: 'Outside Lagos (Nationwide Interstate Waybill)', fee: 8500 },
    ]),
  updatedAt: timestamp('updated_at').defaultNow(),
});