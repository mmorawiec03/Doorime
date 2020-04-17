export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuth: true,
                username: action.username
            }
        case 'LOGOUT':
            return {
                isAuth: false,
                username: null
            }
        default:
            return state;
    }
}