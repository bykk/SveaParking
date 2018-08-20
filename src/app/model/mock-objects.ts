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
    { id: 1, firstName: 'Vukasin', lastName: 'Jelic' },
    { id: 2, firstName: 'Ivan', lastName: 'Herceg' },
    { id: 3, firstName: 'Nemanja', lastName: 'Vuckovic' },
    { id: 4, firstName: 'Srdjan', lastName: 'Debic' },
    { id: 5, firstName: 'Savo', lastName: 'Garovic' },
    { id: 6, firstName: 'Djordje', lastName: 'Andric' }
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
]

export const Mocks = {
    signIn: SIGN_IN_MOCK,
    collegues: COLLEGUES_MOCK,
    impersonatedCollegues: IMPERSONATED_COLLEGUES_MOCK,
    hallOfFameUsers: HALL_OF_FAME_USERS_MOCK
};