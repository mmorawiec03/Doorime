import React  from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { notify, initnotify, getToken } from 'expo-push-notification-helper';
import { globalStyles } from '../styles/global';
import Card from '../shared/Card';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { api } from '../api/apiHost';

class Home extends React.Component {
    state = {
        user: {},
        collections: [],
        userNetworks: [],
        refreshing: false,
        loading: true
    }

    componentDidMount() {
        this.getUserData();
    }

    refreshHandler = () => {
        this.setState({
            refreshing: true,
            ...this.state
        });
        this.getUserData();
    }

    getUserData = () => {
        api.get('/user').then(res => {    // the route will be '/user/:id'
            this.setState({
                user: {
                    username: res.data.user.username,
                    userId: res.data.user.userID
                },
                collections: res.data.user.collections,
                userNetworks: res.data.user.networks,
                refreshing: false,
                loading: false
            });
        }).catch(err => {
            console.log(`[ERROR] ${err}`);
            this.setState({
                refreshing: false,
                loading: false,
                ...this.state
            });
        });
    }

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

    unsubscribe = NetInfo.addEventListener(state => {
        if (state.type === 'wifi' && this.state.userNetworks.includes(state.details.ssid)) {
            this.getAtHome().then(atHome => {
                console.log(`[INFO] Connected to ${state.details.ssid} | Previous atHome state: ${atHome}`);
                if (atHome !== 'true') {
                    this.setAtHome('true').then(() => {
                        console.log('[INFO] The user entered the house');
                    }); 
                }
            });
        } else if (state.type !== 'none' && state.type !== 'unknown') {
            this.getAtHome().then(atHome => {
                console.log(`[INFO] Current network state: ${state.type} | Previous atHome state: ${atHome}`);
                if (atHome === 'true') {
                    this.setAtHome('false').then(() => {
                        this.findOpenAndNotify();
                        console.log('[INFO] The user have left the house | Sending notification');
                    });
                }
            });
        } else {
            console.log('[INFO] Not connected to any network | Waiting for connection');
        }
    });
      

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
    
    render() {
        return (
            <View style={globalStyles.container}>
               {this.state.loading ? (
                    <View style={globalStyles.contextCenter}>
                        <ActivityIndicator size="large" color='lightgrey' />
                    </View>
                ) : (
                    <FlatList 
                        ListHeaderComponent={
                            <>
                                <View style={globalStyles.header}>
                                    <Image source={require('../assets/smart-home.jpg')} style={globalStyles.headerImage} opacity={0.5} />  
                                </View>
                                <TouchableOpacity onPress={() => console.log('add collection')}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>ADD COLLECTION</Text>                                            
                                        <AntDesign name='pluscircle' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                            </>
                        }
                        keyExtractor={(item) => item.colID.toString()}
                        data={this.state.collections}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('DeviceScreen', {item})}>
                                <Card>                                            
                                    <Text style={globalStyles.titleText}>{ item.collectionName.toUpperCase() }</Text>                                            
                                    <AntDesign name='caretright' size={24} color='#00b6b6' />
                                </Card>
                            </TouchableOpacity>
                        )}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshHandler}
                        ListFooterComponent={
                            <>
                                <TouchableOpacity onPress={() => console.log('logout')}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>LOGOUT</Text>                                            
                                        <MaterialCommunityIcons name='logout' size={32} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                            </>
                        }
                    />
                )} 
            </View>
        );
    }
}

export default Home;