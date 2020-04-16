import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Modal, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { modalFormStyles } from '../styles/modalForm';
import Card from  '../shared/Card';
import { AntDesign, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import AddDevice from '../forms/addDevice';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuthToken } from '../storage/token';
import { api } from '../api/apiHost';
import PopupCard from '../shared/popupCard';


export default function Devices({ navigation }) {
    const [collection, setCollection] = useState(navigation.getParam('item'));
    const [modalOpen, setModalOpen] = useState(false);

    const iconColor = (isClosed) => isClosed ? ('green') : ('red');
    const iconName = (isClosed) => isClosed ? ('lock') : ('lock-open');

    const getUserData = navigation.getParam('getUserData');

    const deleteDeviceAlert = (id, name) => {
      Alert.alert(
          'Delete device',
          `Are you sure you want to delete ${name}?`,
          [
              {text: 'Delete', onPress: () => deleteDevice(id)},
              {text: 'Cancel', style: 'cancel'}
          ],
          {cancelable: true}
      )
    }

    const deleteDevice = (id) => {
      console.log('[INFO] DELETE request | Path: /delete_device');
        getAuthToken().then(token => {
            api.delete('/delete_device', {
              data: {"device": id},
              headers: { 'x-access-token': token }
            }).then(res => {
              Alert.alert(
                  'Delete device',
                  res.data.message
              );
              getUserData();
            }).catch(err => {
              console.log(`[ERROR] ${err}`);
              Alert.alert(
                  'Error',
                  'Cannot delete device'
              );
            });
        });
    }


    return (
      <View style={globalStyles.container}>
        
        <Modal visible={modalOpen} animationType='slide'>
            <View style={globalStyles.container}>
                <View style={modalFormStyles.closeButtonContainer}>
                    <Entypo name='cross' size={36} color='#00b6b6' onPress={() => setModalOpen(false)} />
                </View>
                <AddDevice colID={collection.colID} getUserData={getUserData} />
            </View>
        </Modal>
        
        <FlatList
          ListHeaderComponent={
            <>
                <ImageBackground source={require('../assets/devices-background.jpg')} style={globalStyles.header}>
                  <Text style={globalStyles.titleText}>{ collection.collectionName && collection.collectionName.toUpperCase() }</Text>
                  <Text style={globalStyles.paragraph}>{ collection.devices.length } devices</Text>
                </ImageBackground>
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <Card>
                        <Text style={globalStyles.titleText}>ADD DEVICE</Text>                                            
                        <AntDesign name='pluscircle' size={24} color='#00b6b6' />
                    </Card>
                </TouchableOpacity>
            </>
          }
          keyExtractor={(item) => item.devID.toString()}
          data={collection.devices} 
          renderItem={( {item} ) => (
            <PopupCard
              idKey={"device"}
              id={item.devID}
              path={'/rename_device'}
              getUserData={getUserData}
              onDelete={() => deleteDeviceAlert(item.devID, item.deviceName)}
            >
              <LinearGradient
                colors={['transparent', iconColor(item.isClosed)]}
                start={[0.6, 0]} end={[4, 0]}
                >
                <Card>
                  <View>
                      <Text style={globalStyles.titleText}>{ item.deviceName }</Text>
                      <Text style={globalStyles.paragraph}>{ item.lastStateChange }</Text>
                  </View>
                  <View>
                    <SimpleLineIcons name={iconName(item.isClosed)} size={40} color={iconColor(item.isClosed)} style={globalStyles.doorIcon}/>
                  </View>
                </Card>
              </LinearGradient>
            </PopupCard>
          )}
        />
      </View>
    );
}