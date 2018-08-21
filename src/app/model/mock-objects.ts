import { UserParkingSpot } from './user-parking-spot';
import { UserHallOfFame } from './user-hall-of-fame';
import { UserCredentials } from './user-credentials';
import { User } from './user';



const SIGN_IN_MOCK: Array<UserCredentials> = [
    {
        email: 'admin',
        password: 'admin'
    }
];

const COLLEGUES_MOCK: Array<User> = [
    { id: 1, firstName: 'Vukasin', lastName: 'Jelic', email: 'vukasin.jelic@svea.com', phone: '+381692211519', hasFixedSpot: false },
    { id: 2, firstName: 'Ivan', lastName: 'Herceg', email: 'ivan.herceg@svea.com', phone: '+381658352495', hasFixedSpot: true },
    { id: 3, firstName: 'Nemanja', lastName: 'Vuckovic', email: 'nemanja.vuckovic@svea.com', phone: '0631199309', hasFixedSpot: false },
    { id: 4, firstName: 'Srdjan', lastName: 'Debic', email: 'srdjan.debic@svea.com', phone: '+38162316837', hasFixedSpot: false },
    { id: 5, firstName: 'Savo', lastName: 'Garovic', email: 'savo.garovic@svea.com', phone: '+381646125366', hasFixedSpot: false },
    { id: 6, firstName: 'Djordje', lastName: 'Andric', email: 'djordje.andric@svea.com', phone: '+381652271986', hasFixedSpot: true }
];


const IMPERSONATED_COLLEGUES_MOCK: Array<User> = [
    { id: 2, firstName: 'Ivan', lastName: 'Herceg' },
    { id: 3, firstName: 'Nemanja', lastName: 'Vuckovic' }
];

const HALL_OF_FAME_USERS_MOCK: Array<UserHallOfFame> = [
    { id: 1, firstName: 'Vukasin', lastName: 'Jelic', tookParkingCounter: 10 },
    { id: 2, firstName: 'Ivan', lastName: 'Herceg', tookParkingCounter: 5 },
    { id: 3, firstName: 'Nemanja', lastName: 'Vuckovic', tookParkingCounter: 1 },
    { id: 4, firstName: 'Srdjan', lastName: 'Debic', tookParkingCounter: 4 },
    { id: 5, firstName: 'Savo', lastName: 'Garovic', tookParkingCounter: 12 },
    { id: 6, firstName: 'Djordje', lastName: 'Andric', tookParkingCounter: 16 }
];

const AVAILABLE_PARKING_SPOTS_TODAY: Array<UserParkingSpot> = [
    { id: 2, firstName: 'Ivan', lastName: 'Herceg', hasParkingSpot: true },
    { id: 3, firstName: 'Nemanja', lastName: 'Vuckovic', hasParkingSpot: true }
];

const AVAILABLE_PARKING_SPOTS_TOMORROW: Array<UserParkingSpot> = [
    { id: 4, firstName: 'Srdjan', lastName: 'Debic', hasParkingSpot: true },
    { id: 5, firstName: 'Savo', lastName: 'Garovic' , hasParkingSpot: true},
];

export const Mocks = {
    signIn: SIGN_IN_MOCK,
    collegues: COLLEGUES_MOCK,
    impersonatedCollegues: IMPERSONATED_COLLEGUES_MOCK,
    hallOfFameUsers: HALL_OF_FAME_USERS_MOCK,
    availableParkingSpotsToday: AVAILABLE_PARKING_SPOTS_TODAY,
    availableParkingSpotsTomorrow: AVAILABLE_PARKING_SPOTS_TOMORROW
};