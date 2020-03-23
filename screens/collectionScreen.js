import React  from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import { notify, initnotify, getToken } from 'expo-push-notification-helper';
import { globalStyles } from '../styles/global';
import * as userDataUnparsed from '../data/userData.json';
import CollectionCard from '../shared/CollectionCard';
import NetInfo, { NetInfoCellularGeneration, NetInfoStateType } from '@react-native-community/netinfo';

class Home extends React.Component {
    state = {
        collections: userDataUnparsed.user.collections,
        userNetworks: ['Carrefour xxx Free WiFi xxx'],
        refreshing: false
    }

    refreshHandler = () => {
        // this.setState({...this.state, refreshing: true});
        // setTimeout(() => {
        //     this.setState({...this.state, refreshing: false});
        // }, 2000);
    }

    unsubscribe = NetInfo.addEventListener(state => {
        if (state.type === 'wifi' && this.state.userNetworks.includes(state.details.ssid)) {
            this.getAtHome().then(atHome => {
                console.log(`Connected to ${state.details.ssid} | Previous atHome state: ${atHome}`);
                if (atHome !== 'true') {
                    this.setAtHome('true').then(() => {
                        console.log('The user entered the house');
                    }); 
                }
            });
        } else if (state.type !== 'none' && state.type !== 'unknown') {
            this.getAtHome().then(atHome => {
                console.log(`Current network state: ${state.type} | Previous atHome state: ${atHome}`);
                if (atHome === 'true') {
                    this.setAtHome('false').then(() => {
                        this.findOpenAndNotify();
                        console.log('The user have left the house | Sending notification');
                    });
                }
            });
        } else {
            console.log('Not connected to any network | Waiting for connection');
        }
    });

    setAtHome = async (atHome) => {
        try {
            return await AsyncStorage.setItem('@atHome', atHome);
        } catch (e) {
            // saving error
        }
    }

    getAtHome = async () => {
        try {
            return await AsyncStorage.getItem('@atHome');
        } catch(e) {
            // error reading value
        }
    }
      

    findOpenAndNotify = () => {
        let openList = this.state.collections.map(collection => {
            return ({
                collection: collection.collectionName,
                devices: collection.devices.filter(device => {
                    return !device.isClosed;
                })
            });
        });
        openList.forEach(collection => {
            collection.devices.forEach(device => {
                this.notification(collection.collection, `${device.deviceName} is open!`);
            });
        });
        //setRefreshing(false);
    }

    notification = (title, body) => {
        initnotify().then(async (data) => {
            if (data) {
                getToken().then((token) => {
                    notify(token, title, body);
                });
            } else {
                alert('Please, grant this app notification permission in settings.')
            }
        });
    }

    // -------- temporary functions --------

    pressHandler = () => {
        //this.notification('hello', 'world');
        
        NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            if (state.type === 'wifi'){
                console.log('Previous home network SSID: ', this.state.userNetworks[0]);
                console.log('You are now connected to ', state.details.ssid);
                this.state.userNetworks[0] = state.details.ssid;
                const currentSetNetwork = this.state.userNetworks[0];
                console.log('Your Home Network is now set to ', currentSetNetwork);
                this.setAtHome('true').then(() => {
                    console.log('User is in the house');
                }); 
                
                alert(`Welcome Home! Your Home Network is now set to ${currentSetNetwork}`);

                
            } else {
                alert(`You cannot set a Home Network when not connected to WiFi`);
                this.setAtHome('false').then(() => {
                    console.log('User is not at home');
                }); 
            }
            
          });
        
    }
    
    render() {
        return (
            <View style={{backgroundColor: '#a1e6e3', flex:1}}>
                <View style={globalStyles.subheader}>
                    <Text style={globalStyles.textNotHighlighted}>Hello <Text style={globalStyles.textHighlight}>{userDataUnparsed.user.username}</Text>, here are your collections:</Text>
                    <Button 
                        title='Set current WiFi as Home Network'
                        onPress={this.pressHandler}
                    />            
                </View>
                <View style={globalStyles.container}>
                    <FlatList 
                        keyExtractor={(item) => item.colID.toString()}
                        data={this.state.collections}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('DeviceScreen', {item})}>
                                <CollectionCard>
                                    <Text style={globalStyles.titleText}>{ item.collectionName }</Text>
                                    <Text>Devices: {item.devices.length} | Last change: {item.lastStateChange}</Text>
                                </CollectionCard>
                            </TouchableOpacity>
                        )}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshHandler}
                    />
                </View>
            </View>
        );
    }
}

export default Home;