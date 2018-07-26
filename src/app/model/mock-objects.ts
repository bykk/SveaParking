import { User } from './user';


const SIGN_IN_MOCK: Array<User> = [
    {
        email: 'admin',
        password: 'admin'
    }
];

export const Mocks = {
    signIn: SIGN_IN_MOCK
};