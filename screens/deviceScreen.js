import React, { useState} from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { globalStyles } from '../styles/global';
import DeviceCard from  '../shared/DeviceCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Devices({ navigation }) {
    const [collection, setCollection] = useState(navigation.getParam('item'));
    
    const closedStatus = (isClosed) => isClosed ? ('Closed') : ('Open!');
    const closedStyle = (isClosed) => isClosed ? (globalStyles.closed) : (globalStyles.open);
    const doorIconController = (isClosed) => isClosed ? ('door-closed') : ('door-open');
    
    // temporary
    const changeState = navigation.getParam('changeState');
    const pressHandler = (colId, devId) => {
      changeState(colId, devId);
      navigation.goBack();
    }

    return (
      <View style={{backgroundColor: '#282a36', flex:1}}>
        <View style={globalStyles.subheader}>
          <Text style={globalStyles.textNotHighlighted}>Collection: <Text style={ globalStyles.textHighlight}>{ collection.collectionName }</Text></Text>
          <Text style={globalStyles.textNotHighlighted}>Number of devices: <Text style={ globalStyles.textHighlight}>{ collection.devices.length }</Text></Text>
          <Text style={globalStyles.textNotHighlighted}>Last change of state: <Text style={ globalStyles.textHighlight}>{ collection.lastStateChange }</Text></Text>
        </View>
        <View style={globalStyles.container}>
          <FlatList
            keyExtractor={(item) => item.devID.toString()}
            data={collection.devices} 
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
                    <Button
                      title='change state'
                      onPress={() => pressHandler(collection.colID, item.devID)}
                    />
                  </View>
                  <MaterialCommunityIcons name={doorIconController(item.isClosed)} size={40} color='#333' style={globalStyles.doorIcon}/>
                </View>
              </View>
            )}
        />
        </View>
      </View>
    );
}