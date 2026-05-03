import { useState, useCallback } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  address?: string;
  company?: string;
  companyType?: string;
  companyAddress?: string;
  pincode?: string;
  passwordHash?: string;
  verificationLevel: "basic" | "verified" | "premium";
  joinedAt: string;
}

const STORAGE_KEY = "sc_auth_user";
const USERS_DB_KEY = "sc_users_db";

// Simple hash function for demo purposes
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

function getUserFromDatabase(email: string): AuthUser | null {
  try {
    const db = localStorage.getItem(USERS_DB_KEY);
    if (!db) return null;
    const users: AuthUser[] = JSON.parse(db);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch {
    return null;
  }
}

function saveUserToDatabase(user: AuthUser) {
  try {
    let users: AuthUser[] = [];
    const db = localStorage.getItem(USERS_DB_KEY);
    if (db) {
      users = JSON.parse(db);
      // Remove if user already exists
      users = users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
    }
    users.push(user);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving user to database:", e);
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const signup = useCallback((email: string, password: string, name?: string, company?: string, address?: string, companyType?: string, companyAddress?: string, pincode?: string, phone?: string, country?: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        if (getUserFromDatabase(email)) {
          reject(new Error("Email already registered"));
          return;
        }

        const newUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name: name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          address,
          company,
          companyType,
          companyAddress,
          pincode,
          phone,
          country,
          passwordHash: simpleHash(password),
          verificationLevel: "verified",
          joinedAt: new Date().toISOString(),
        };
        saveUserToDatabase(newUser);
        storeUser(newUser);
        setUser(newUser);
        resolve(newUser);
      }, 1200);
    });
  }, []);

  const login = useCallback((email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dbUser = getUserFromDatabase(email);
        
        if (!dbUser) {
          reject(new Error("Email not found"));
          return;
        }

        if (!dbUser.passwordHash || simpleHash(password) !== dbUser.passwordHash) {
          reject(new Error("Incorrect password"));
          return;
        }

        storeUser(dbUser);
        setUser(dbUser);
        resolve(dbUser);
      }, 1200);
    });
  }, []);

  // Legacy function for backward compatibility during signup
  const legacyLogin = useCallback((email: string, _password: string, name?: string, company?: string, address?: string, companyType?: string, companyAddress?: string, pincode?: string): Promise<AuthUser> => {
    return signup(email, _password, name, company, address, companyType, companyAddress, pincode);
  }, [signup]);

  const logout = useCallback(() => {
    storeUser(null);
    setUser(null);
  }, []);

  return { user, login, signup, logout, isAuthenticated: !!user };
}
