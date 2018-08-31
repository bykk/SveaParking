
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    userName?: string;
    isAdmin?: boolean;
    activated?: boolean;
    active?: boolean;    
}