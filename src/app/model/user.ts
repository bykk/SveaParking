
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    hasFixedSpot?: boolean;
}