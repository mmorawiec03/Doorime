import React from 'react';
import AuthNavigator from './routes/authNavigator';
import AuthContextProvider from './contexts/authContext';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { api } from './api/apiHost';
import { setAuthToken } from './storage/token';
import { setAuthData, getAuthData } from './storage/authData';
const BACKGROUND_SESSION_KEEPALIVE = 'background_session_keepalive';

TaskManager.defineTask(BACKGROUND_SESSION_KEEPALIVE, () => {    //to ta funkcja wywoływana będzie co około 15 minut
  try {
    console.log(`Background task ${BACKGROUND_SESSION_KEEPALIVE} is running.`);
    
    getAuthData().then(data => {
     
      api.get('/login', { headers: { 'Authorization': data.basicAuth }}).then(res => {
        setAuthToken(res.data.token);
        console.log(`[BACKGROUND VALIDATION SUCCESS] ${res.data.token}`);
      }).catch(err => {
        console.log(`[BACKGROUND VALIDATION ERROR] ${err}`);
      });
    });

    
  } catch (error) {
    console.log('Background tasks failed.');
    return BackgroundFetch.Result.Failed;
  }
});

async function listBackgroundTasks(){
  console.log('-------REGISTERED BACKGROUND TASKS-------');
  console.log(await TaskManager.getRegisteredTasksAsync());
  console.log('-----------------------------------------');
}

async function backgroundTasks() {
  await BackgroundFetch.getStatusAsync();
  console.log(BackgroundFetch.Status.Available ? ('Background Tasks Available') : ('Background Tasks Unavailable'));
  if(BackgroundFetch.Status.Available){
    BackgroundFetch.registerTaskAsync(BACKGROUND_SESSION_KEEPALIVE, {startOnBoot: true, stopOnTerminate: false, minimumInterval: 300});
    listBackgroundTasks();
  }
}

export default function App() {
  backgroundTasks();
  return (
    <AuthContextProvider>
      <AuthNavigator />
    </AuthContextProvider>
  );
}

