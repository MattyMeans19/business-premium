import { integer, pgTableCreator, varchar, text, doublePrecision, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `business_premium_${name}`);
export const roleEnum = pgEnum('user_role', ['Employee', 'Manager', 'Admin']);
export type Role = (typeof roleEnum.enumValues)[number];

export const products = pgTable("products", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    price: doublePrecision("price").notNull(),
    photo: text("photo").notNull(),
    count: integer("count").notNull()
});

export const AdminCredentials = pgTable("admin_credentials", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    userRole: roleEnum('user_role').default('Employee').notNull(),

});

export const CustomMessage = pgTable("custom_message", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    message: text("message").notNull(),
    userRole: roleEnum('user_role').default('Employee').notNull(),
});

export const Orders = pgTable("orders", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    customerName: varchar("customer_name", {length: 60}).notNull(),
    customerEmail: varchar("email", {length: 255}).notNull(),
    customerPhone: varchar("phone", {length: 20}),
    subtotal: doublePrecision("subtotal").notNull(),
    taxAmount: doublePrecision("tax_amount").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    totalAmount: doublePrecision("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    orderNumber: varchar("order_number", {length: 255}).notNull().unique()
});

export const OrderItems = pgTable("order_items", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").notNull(),
    productName: varchar("product_name", {length: 255}).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: doublePrecision("unit_price").notNull(),
    totalPrice: doublePrecision("total_price").notNull(),
});