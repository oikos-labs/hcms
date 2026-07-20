/** A user record shared by API consumers and the backend. */
export interface User {
  id: string;
  email: string;
  name: string;
  churchId: string;
  createdAt: string;
}

/**
 * Standard envelope returned by HCMS API endpoints.
 *
 * @typeParam T - The endpoint-specific response payload.
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
