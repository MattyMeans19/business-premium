export type User = {
    id: number;
    username: string;
    passwordHash: string;
}

export type SessionPayload = {
  username: string, 
  expiresAt: Date
}

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    photo: string;
    count: number;
}

export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    photo: string;
}