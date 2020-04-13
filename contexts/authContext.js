import React, { createContext, useReducer } from 'react';
import { authReducer } from '../reducers/authReducer';


export const AuthContext = createContext();

export default function AuthContextProvider(props) {
    const [authData, dispatch] = useReducer(authReducer, {
        isAuth: false,
        username: null
    });

    return (
        <AuthContext.Provider value={{authData, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    );
}