import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Navigator from './routes/homeStack';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';


const getData = () => Font.loadAsync({

});


export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  if(dataLoaded){
    return (
      <Navigator />
    );
  } else {
    return (
      <AppLoading
        startAsync={getData}
        onFinish={() => setDataLoaded(true)}
      />
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
