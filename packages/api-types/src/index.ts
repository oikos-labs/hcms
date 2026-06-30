export interface User {
  id: string;
  email: string;
  name: string;
  churchId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}