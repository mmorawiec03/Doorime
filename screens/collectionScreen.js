import React  from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { notify, initnotify, getToken } from 'expo-push-notification-helper';
import { globalStyles } from '../styles/global';
import { modalFormStyles } from '../styles/modalForm';
import Card from '../shared/Card';
import { AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { api } from '../api/apiHost';
import { getAtHome, setAtHome } from '../storage/atHome';
import { getAuthToken, setAuthToken } from '../storage/token';
import AddCollection from '../forms/addCollection';
import { AuthContext } from '../contexts/authContext';


class Home extends React.Component {
    state = {
        username: '',
        collections: [],
        userNetworks: [],
        refreshing: false,
        loading: true,
        modalOpen: false
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.getUserData();
    }

    refreshHandler = () => {
        this.setState({
            refreshing: true
        });
        this.getUserData();
    }

    setModalOpen = (open) => this.setState({modalOpen: open});

    getUserData = () => {
        getAuthToken().then(token => {
            api.get('/get_all_data', { headers: { 'x-access-token': token }})
                .then(res => {
                    return JSON.parse(res.data.result);
                }).then(data => {
                    this.setState({
                        username: data.user.username,
                        collections: data.user.collections,
                        userNetworks: data.user.networks,
                        refreshing: false,
                        loading: false
                    });
                }).catch(err => {
                    console.log(`[ERROR] ${err}`);
                    this.setState({
                        refreshing: false,
                        loading: false
                    });
                });
        });
    }

    unsubscribe = NetInfo.addEventListener(state => {
        if (state.type === 'wifi' && this.state.userNetworks.includes(state.details.ssid)) {
            getAtHome().then(atHome => {
                console.log(`[INFO] Connected to ${state.details.ssid} | Previous atHome state: ${atHome}`);
                if (atHome !== 'true') {
                    setAtHome('true').then(() => {
                        console.log('[INFO] The user entered the house');
                    }); 
                }
            });
        } else if (state.type !== 'none' && state.type !== 'unknown') {
            getAtHome().then(atHome => {
                console.log(`[INFO] Current network state: ${state.type} | Previous atHome state: ${atHome}`);
                if (atHome === 'true') {
                    setAtHome('false').then(() => {
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

    logout = () => {
        setAuthToken('').then(() => {
            this.context.dispatch({type: 'LOGOUT' });
        });
    }

    render() {
        return (
            <View style={globalStyles.container}>
                
                <Modal visible={this.state.modalOpen} animationType='slide'>
                    <View style={globalStyles.container}>
                        <View style={modalFormStyles.closeButtonContainer}>
                            <Entypo name='cross' size={36} color='#00b6b6' onPress={() => this.setModalOpen(false)} />
                        </View>
                        <AddCollection />
                    </View>
                </Modal>

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
                                <TouchableOpacity onPress={() => this.setModalOpen(true)} >
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
                                    <Text style={globalStyles.titleText}>{ item.collectionName && item.collectionName.toUpperCase() }</Text>                                            
                                    <AntDesign name='caretright' size={24} color='#00b6b6' />
                                </Card>
                            </TouchableOpacity>
                        )}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshHandler}
                        ListFooterComponent={
                            <>
                                <TouchableOpacity onPress={this.logout}>
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