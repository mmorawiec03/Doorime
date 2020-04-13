import React from 'react';
import AuthNavigator from './routes/authNavigator';
import AuthContextProvider from './contexts/authContext';


export default function App() {

  return (
    <AuthContextProvider>
      <AuthNavigator />
    </AuthContextProvider>
  );
}

