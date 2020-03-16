import React, { useState} from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { globalStyles } from '../styles/global';
import DeviceCard from  '../shared/DeviceCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const closedStatus = ( isClosed ) => {
  if(isClosed == 'True'){
    console.log(isClosed);
    return 'Closed';
  } else {
    console.log(isClosed);
    return 'Open!';
  }
}

const closedStyle = ( isClosed ) => {
  if(isClosed == 'True'){
    return globalStyles.closed;
  } else {
    return globalStyles.open;
  }
}

const doorIconController = ( isClosed ) => {
  if(isClosed == 'True'){
    return 'door-closed';
  } else {
    return 'door-open';
  }
}

export default function Devices({ navigation }) {
    const [deviceData, setDeviceData] = useState(navigation.getParam('devices'));

    return (
      <View style={{backgroundColor: '#a1e6e3', flex:1}}>
        <View style={globalStyles.subheader}>
          <Text style={globalStyles.textNotHighlighted}>Collection: <Text style={ globalStyles.textHighlight}>{ navigation.getParam('collectionName') }</Text></Text>
          <Text style={globalStyles.textNotHighlighted}>Number of devices: <Text style={ globalStyles.textHighlight}>{ navigation.getParam('numberOfDevices') }</Text></Text>
          <Text style={globalStyles.textNotHighlighted}>Last change of state: <Text style={ globalStyles.textHighlight}>{ navigation.getParam('lastStateChange') }</Text></Text>
        </View>
        <View style={globalStyles.container}>
          <FlatList
            keyExtractor={(item) => item.devID}
            data={deviceData} 
            renderItem={( {item} ) => (
              <View style={ closedStyle(item.isClosed) }>
                {/* <DeviceCard>
                  <Text style={ globalStyles.titleText }>{ item.deviceName }</Text>
                  <Text name='isClosedName'>{ closedStatus(item.isClosed) }</Text>
                </DeviceCard> */}
                <View style={globalStyles.wholecard}>
                  <View style={globalStyles.cardContent}>
                    <Text style={ globalStyles.titleText }>{ item.deviceName }</Text>
                    <Text name='isClosedName'>{ closedStatus(item.isClosed) }</Text>
                  </View>
                  < MaterialCommunityIcons name={doorIconController(item.isClosed)} size={40}  color='#333' style={globalStyles.doorIcon}/>
                </View>
              </View>
            )}
        />
        </View>
      </View>
    );
}