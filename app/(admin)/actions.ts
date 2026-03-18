'use server'

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { AdminCredentials, CustomMessage, products, Orders, OrderItems } from "@/db/schema";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
    try {
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const firstUser = await db.select().from(AdminCredentials);

        if (firstUser.length === 0) {
            let newPasswordHash = await bcrypt.hash(password, 10);
            await db.insert(AdminCredentials).values({
                username: username,
                passwordHash: newPasswordHash,
            });
            await createSession(username);
            return { success: true, message: "New admin user created and logged in." };
        } else {
            const userCheck = await db.select()
                .from(AdminCredentials)
                .where(eq(AdminCredentials.username, username));

            if (userCheck.length === 0) {
                return { success: false, message: "Invalid username" };
            } else {
                const passwordCheck = await bcrypt.compare(password, userCheck[0].passwordHash);
                if (passwordCheck) {
                    await createSession(userCheck[0].username);
                    return { success: true, message: "Login successful." };
                } else {
                    return { success: false, message: "Invalid password." };
                }
            }
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred during the login process." };
    }
}

export async function Logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('session');
        cookieStore.set('session', '', {
            expires: new Date(0),
            path: '/admin-portal',
        });
        revalidatePath('/admin-portal', 'layout');
    } catch (error) {
        console.error(error);
        // We don't return here because we want to attempt the redirect regardless
    }
    // Redirect must be outside the try/catch
    redirect("/admin-portal");
}

export async function updateMessage(newMessage: string) {
    try {
        if (newMessage.length > 0) {
            const response = await db.update(CustomMessage).set({ message: newMessage }).where(eq(CustomMessage.id, 1));
            if (response.rowCount != null && response.rowCount > 0) {
                return { success: true, message: "Custom message updated successfully." };
            } else {
                return { success: false, message: "Failed to update custom message." };
            }
        } else {
            return { success: false, message: "Custom message cannot be empty." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Database error updating custom message." };
    }
}

export async function UpdateUserPassword(userId: number, newPassword: string) {
    try {
        if (newPassword.length > 6) {
            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const response = await db.update(AdminCredentials).set({ passwordHash: newPasswordHash }).where(eq(AdminCredentials.id, userId));
            if (response.rowCount != null && response.rowCount > 0) {
                return { success: true, message: "Password updated successfully." };
            } else {
                return { success: false, message: "Failed to update password." };
            }
        } else {
            return { success: false, message: "Password must be at least 6 characters long." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Internal error updating password." };
    }
}

export async function DeleteUser(username: string) {
    try {
        const deleteRequest = await db.delete(AdminCredentials).where(eq(AdminCredentials.username, username));
        if (deleteRequest.rowCount! > 0) {
            return { success: true, message: "User Deleted!" }
        } else {
            return { success: false, message: "Error deleting user!" }
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete user due to a server error." };
    }
}

export async function AddNewUser(username: string, password: string, role: any) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await db.insert(AdminCredentials).values({ username: username, passwordHash: hashedPassword, userRole: role });
        if (response.rowCount != null) {
            return { success: true, message: "New User successfully added!" }
        } else {
            return { success: false, message: "Error creating user." }
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Could not add user. Check if the username is already taken." };
    }
}

export async function GetUserRole(username: string) {
    try {
        const roleRequest = await db.select().from(AdminCredentials).where(eq(AdminCredentials.username, username));
        if (roleRequest.length != 0) {
            return roleRequest[0].userRole
        } else {
            return "";
        }
    } catch (error) {
        console.error(error);
        return "";
    }
}

export async function DeleteInventoryItem(itemId: number) {
    try {
        const response = await db.delete(products).where(eq(products.id, itemId));
        const newList = await db.select().from(products);
        if (response.rowCount != null && response.rowCount > 0) {
            return { success: true, message: "Inventory item deleted successfully.", inventory: newList };
        } else {
            return { success: false, message: "Failed to delete inventory item." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred while deleting the item." };
    }
}

export async function SaveInventoryItem(itemId: number, name: string, description: string, price: number, photo: string, count: number = 0) {
    try {
        const response = await db.update(products).set({ name, description, price, photo, count }).where(eq(products.id, itemId));
        const newList = await db.select().from(products);
        if (response.rowCount != null && response.rowCount > 0) {
            return { success: true, message: "Inventory item updated successfully.", inventory: newList };
        } else {
            return { success: false, message: "Failed to update inventory item." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred while updating the inventory item." };
    }
}

export async function AddInventoryItem(name: string, description: string, price: number, photo: string, count: number = 0) {
    try {
        const response = await db.insert(products).values({ name, description, price, photo, count });
        const newList = await db.select().from(products);
        if (response.rowCount != null && response.rowCount > 0) {
            return { success: true, message: "Inventory item added successfully.", inventory: newList };
        } else {
            return { success: false, message: "Failed to add inventory item." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred while adding the inventory item." };
    }
}

export async function MarkOrderFulfilled(orderId: number) {
    try {
        const response = await db.update(Orders).set({ status: 'fulfilled' }).where(eq(Orders.id, orderId));
        if (response.rowCount != null && response.rowCount > 0) {
            return { success: true, message: 'Order marked fulfilled' };
        }
        return { success: false, message: 'Failed to update order status' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Server error marking order as fulfilled.' };
    }
}

export async function GetOrderItems(orderId: number) {
    try {
        const response = await db.select().from(OrderItems).where(eq(OrderItems.orderId, orderId));
        if (response.length > 0) {
            return { success: true, items: response as any[] }
        } else {
            return { success: false, items: null }
        }
    } catch (error) {
        console.error(error);
        return { success: false, items: null };
    }
}