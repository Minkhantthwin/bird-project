/** Auth-specific types used across the auth layer. */

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: string; // role name from Roles table
  avatar?: string;
}

export type AuthResult =
  | { success: true; user: SessionUser }
  | { success: false; error: string };

export interface AuthFormState {
  errors?: Record<string, string[]>;
  serverError?: string;
  success?: boolean;
}
