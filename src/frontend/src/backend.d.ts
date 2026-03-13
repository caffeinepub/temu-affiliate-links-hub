import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    affiliateUrl: string;
    isActive: boolean;
    imageUrl: string;
    category: string;
    price: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: string, affiliateUrl: string, imageUrl: string, category: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllActiveProducts(): Promise<Array<Product>>;
    getAllCategories(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleProductActive(id: bigint): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: string, affiliateUrl: string, imageUrl: string, category: string): Promise<void>;
}
