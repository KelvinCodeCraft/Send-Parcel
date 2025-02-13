export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
  }
  
  export interface Data {
    id: string;
    name: string;
    role: string;
    email: string;
    iat: number;
    exp: number;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    end_date: string;
    user_id: string;
    email: string;
  }