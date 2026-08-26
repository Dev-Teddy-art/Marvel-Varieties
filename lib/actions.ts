'use server';

import { db } from '@/lib/db';
import { products, orders, users } from '@/lib/db/schema';
import { desc, eq, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ==========================================
// 1. PRODUCT ACTIONS
// ==========================================

export async function getProductsAction() {
  try {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function addProductAction(formData: {
  title: string;
  category: string;
  price: number;
  description?: string;
  images: string[];
  inStock: boolean;
  isFeatured?: boolean;
}) {
  try {
    const id = `prod_${Date.now()}`;
    const allImages = formData.images && formData.images.length > 0 
      ? formData.images 
      : ['/MARVEL VARIETIES.png'];

    await db.insert(products).values({
      id,
      title: formData.title,
      category: formData.category,
      price: formData.price,
      description: formData.description || '',
      imageUrl: allImages[0],
      images: allImages,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured || false,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: 'Database error creating product' };
  }
}

export async function updateProductAction(id: string, formData: {
  title: string;
  category: string;
  price: number;
  description?: string;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
}) {
  try {
    const allImages = formData.images && formData.images.length > 0 
      ? formData.images 
      : ['/MARVEL VARIETIES.png'];

    await db.update(products).set({
      title: formData.title,
      category: formData.category,
      price: formData.price,
      description: formData.description || '',
      imageUrl: allImages[0],
      images: allImages,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
    }).where(eq(products.id, id));

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Database error updating product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false };
  }
}

// ==========================================
// 2. ORDER ACTIONS (WITH DELETE ORDER)
// ==========================================

export async function getOrdersAction() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function createOrderAction(orderData: {
  orderReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryState: string;
  deliveryAddress: string;
  totalAmount: number;
  receiptUrl?: string;
  items: any;
}) {
  try {
    const id = `ord_${Date.now()}`;
    await db.insert(orders).values({
      id,
      orderReference: orderData.orderReference,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryState: orderData.deliveryState,
      deliveryAddress: orderData.deliveryAddress,
      totalAmount: orderData.totalAmount,
      receiptUrl: orderData.receiptUrl,
      status: 'pending_verification',
      items: orderData.items,
    });
    revalidatePath('/admin');
    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    console.error('Failed to record order:', error);
    return { success: false, error: 'Failed to record order' };
  }
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  try {
    await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId));
    revalidatePath('/admin');
    revalidatePath('/track');
    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false };
  }
}

export async function deleteOrderAction(id: string) {
  try {
    await db.delete(orders).where(eq(orders.id, id));
    revalidatePath('/admin');
    revalidatePath('/account');
    revalidatePath('/track');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete order:', error);
    return { success: false, error: 'Database error deleting order' };
  }
}

export async function searchOrderAction(query: string) {
  try {
    const cleaned = query.trim();
    const results = await db
      .select()
      .from(orders)
      .where(or(eq(orders.orderReference, cleaned), eq(orders.customerPhone, cleaned)))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    console.error('Failed to find order:', error);
    return null;
  }
}

// ==========================================
// 3. AUTH & USER ACTIONS
// ==========================================

export async function registerUserAction(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    const cleanEmail = data.email.toLowerCase().trim();
    const cleanPhone = data.phone.trim();

    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, cleanEmail), eq(users.phone, cleanPhone)))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: 'An account with this email or phone number already exists.' };
    }

    const id = `usr_${Date.now()}`;
    const role = cleanEmail.includes('admin') || cleanEmail.includes('marvel') ? 'admin' : 'customer';

    await db.insert(users).values({
      id,
      fullName: data.fullName,
      email: cleanEmail,
      phone: cleanPhone,
      password: data.password,
      role,
    });

    return { 
      success: true, 
      user: { id, fullName: data.fullName, email: cleanEmail, phone: cleanPhone, role } 
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: 'Database error creating account' };
  }
}

export async function loginUserAction(identifier: string, pass: string) {
  try {
    const cleaned = identifier.trim().toLowerCase();
    const found = await db
      .select()
      .from(users)
      .where(or(eq(users.email, cleaned), eq(users.phone, cleaned)))
      .limit(1);

    if (found.length === 0 || found[0].password !== pass) {
      return { success: false, error: 'Invalid email/phone or password.' };
    }

    const u = found[0];
    return {
      success: true,
      user: {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

export async function getCustomerOrdersAction(phoneOrEmail: string) {
  try {
    const cleaned = phoneOrEmail.trim();
    return await db
      .select()
      .from(orders)
      .where(or(eq(orders.customerPhone, cleaned), eq(orders.customerEmail, cleaned)))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}