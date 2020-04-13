import { setIsAuth } from '../storage/isAuth';

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            setIsAuth(true);
            return {
                isAuth: true,
                username: action.username
            }
        case 'LOGOUT':
            setIsAuth(false);
            return {
                isAuth: false,
                username: null
            }
        default:
            return state;
    }
}