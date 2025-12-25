
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface User {
  id: string;
  nombre: string;
  role: UserRole;
}

export interface Student {
  id: string;
  nombre: string;
  carrera: string;
  votos: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  studentName: string;
  carrera: string;
  correo: string;
  receiptName: string;
  receiptUrl: string; // Base64 or URL
  status: TransactionStatus;
  type: 'registration' | 'bet';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
