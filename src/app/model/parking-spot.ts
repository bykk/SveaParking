import { User } from './user';

export interface ParkingSpot {
    id: number;
    userId: number;
    userIdReplace?: number;
    userWhoReleasedTheParking?: number;
    date?: Date;
    endDate?: Date;
    replaceUser?: User;
    user: User;
    parkingSpotNumber: number;
    isLoggedInUser: boolean;
}