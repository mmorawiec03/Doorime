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
import ShareCollection from '../forms/shareCollection';
import * as Haptics from 'expo-haptics';

export default function Devices({ navigation }) {
    const [collection, setCollection] = useState(navigation.getParam('item'));
    const [addDevOpen, setAddDevOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const iconColor = (isClosed) => isClosed ? ('#009000') : ('#b40000');
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
        
        <Modal visible={addDevOpen} animationType='slide'>
            <View style={globalStyles.container}>
                <View style={modalFormStyles.closeButtonContainer}>
                    <Entypo name='cross' size={36} color='#00b6b6' onPress={() => setAddDevOpen(false)} />
                </View>
                <AddDevice colID={collection.colID} getUserData={getUserData} />
            </View>
        </Modal>

        <Modal visible={shareOpen} animationType='slide'>
            <View style={globalStyles.container}>
                <View style={modalFormStyles.closeButtonContainer}>
                    <Entypo name='cross' size={36} color='#00b6b6' onPress={() => setShareOpen(false)} />
                </View>
                <ShareCollection colID={collection.colID} getUserData={getUserData} />
            </View>
        </Modal>
        
        <FlatList
          ListHeaderComponent={
            <>
                <ImageBackground source={require('../assets/devices-background.jpg')} opacity={0.5} style={globalStyles.header}>
                  <Text style={globalStyles.titleText}>{ collection.collectionName && collection.collectionName.toUpperCase() }</Text>
                  <Text style={globalStyles.paragraph}>{ collection.devices.length } devices</Text>
                </ImageBackground>
                <LinearGradient
                  colors={['transparent', 'rgba(0, 182, 182, 0.5)']}
                  start={[0.7, 0]}
                  end={[4, 0]}
                >
                  <TouchableOpacity onPress={() => setAddDevOpen(true)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                      <Card>
                          <Text style={globalStyles.titleText}>ADD DEVICE</Text>                                            
                          <AntDesign name='pluscircle' size={24} color='#00b6b6' />
                      </Card>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShareOpen(true)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                      <Card>
                          <Text style={globalStyles.titleText}>SHARE COLLECTION</Text>                                            
                          <Entypo name='share' size={28} color='#00b6b6' />
                      </Card>
                  </TouchableOpacity>
                </LinearGradient>
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
                start={[0.7, 0]}
                end={[4, 0]}
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