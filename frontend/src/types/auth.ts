export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CANDIDATE" | "AGENT" | "QA" | "ADMIN" | "OPERATIONS";
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
