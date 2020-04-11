import React, { useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { globalStyles } from '../styles/global';
import { modalFormStyles } from '../styles/modalForm';
import Card from  '../shared/Card';
import { AntDesign, SimpleLineIcons, Entypo } from '@expo/vector-icons';


export default function Devices({ navigation }) {
    const [collection, setCollection] = useState(navigation.getParam('item'));
    const [modalOpen, setModalOpen] = useState(false);

    const iconColor = (isClosed) => isClosed ? ('green') : ('red');
    const iconName = (isClosed) => isClosed ? ('lock') : ('lock-open');

    return (
      <View style={globalStyles.container}>
        
        <Modal visible={modalOpen} animationType='slide'>
            <View style={globalStyles.container}>
                <View style={modalFormStyles.closeButtonContainer}>
                    <Entypo name='cross' size={36} color='#00b6b6' onPress={() => setModalOpen(false)} />
                </View>
                <View style={modalFormStyles.formContainer}>
                    <Text style={globalStyles.paragraph}>add device form</Text>
                </View>
            </View>
        </Modal>
        
        <FlatList
          ListHeaderComponent={
            <>
                <ImageBackground source={require('../assets/devices-background.jpg')} style={globalStyles.header}>
                  <Text style={globalStyles.titleText}>{ collection.collectionName.toUpperCase() }</Text>
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
            <Card>
              <View>
                  <Text style={globalStyles.titleText}>{ item.deviceName }</Text>
                  <Text style={globalStyles.paragraph}>{ item.lastStateChange }</Text>
              </View>
              <View>
                <SimpleLineIcons name={iconName(item.isClosed)} size={40} color={iconColor(item.isClosed)} style={globalStyles.doorIcon}/>
              </View>
            </Card>
          )}
        />
      </View>
    );
}