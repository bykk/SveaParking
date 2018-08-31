import { User } from './user';

export interface UserParkingSpot {
    id: number;
    parkingSpotNumber: string;
    startDate: Date;
    endDate: Date;
    user: User;
    daysLeft: any;
    parkingType: string;
    parkingPeriod?: string;
}