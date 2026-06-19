/** Auth-specific types used across the auth layer. */

export const USER_ROLES = ['Admin', 'Instructor', 'Member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.some((role) => role === value);
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole; // role name from Roles table
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
