import React  from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
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
import AddNetwork from '../forms/addNetwork'


class Home extends React.Component {
    state = {
        username: '',
        collections: [],
        userNetworks: [],
        refreshing: false,
        loading: true,
        addColOpen: false,
        netOpen: false
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

    setAddColOpen = (open) => this.setState({addColOpen: open});
    setNetOpen = (open) => this.setState({netOpen: open});

    logout = () => {
        setAuthToken('').then(() => {
            this.context.dispatch({type: 'LOGOUT' });
        });
    }

    // ------------------- CHECKING NETWORK STATE --------------------

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
                    console.log('[INFO] The user have left the house | Sending notification');
                    setTimeout(() => {
                        this.getUserData(
                            setAtHome('false').then(() => {
                                this.findOpenAndNotify();
                            })
                        );
                    }, 6000);
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

    // ------------------- ALERTS ----------------------

    logoutAlert = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {text: 'Logout', onPress: this.logout},
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true}
        );
    }

    deleteCollectionAlert = (name) => {
        Alert.alert(
            'Delete collection',
            `Are you sure you want to delete ${name} collection?`,
            [
                {text: 'Delete', onPress: () => this.deleteCollection(name)},
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true}
        )
    }

    deleteNetworkAlert = (ssid) => {
        Alert.alert(
            'Delete network',
            `Are you sure you want to delete ${ssid} network?`,
            [
                {text: 'Delete', onPress: () => this.deleteNetwork(ssid)},
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true}
        )
    }

    // ---------------- HTTP REQUESTS --------------------

    getUserData = (callback) => {
        console.log('[INFO] GET request | Path: /get_all_data');
        getAuthToken().then(token => {
            api.get(
                '/get_all_data',
                { headers: { 'x-access-token': token }}
            ).then(res => {
                return JSON.parse(res.data.result);
            }).then(data => {
                this.setState({
                    username: data.user.username,
                    collections: data.user.collections,
                    userNetworks: data.user.networks,
                    refreshing: false,
                    loading: false
                });
                if (typeof callback == "function") 
                    callback();
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                this.setState({
                    refreshing: false,
                    loading: false
                });
            });
        });
    }

    deleteCollection = (name) => {
        console.log('[INFO] DELETE request | Path: /delete_collection');
        getAuthToken().then(token => {
            api.delete(
                '/delete_collection',
                {"collection": name},
                { headers: { 'x-access-token': token }}
            ).then(res => {
                Alert.alert(
                    'Delete collection',
                    res.data.message
                );
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                Alert.alert(
                    'Error',
                    'Cannot delete collection'
                );
            });
        });
    }

    deleteNetwork = (ssid) => {
        console.log('[INFO] DELETE request | Path: /delete_wifi');
        getAuthToken().then(token => {
            api.delete(
                '/delete_wifi',
                {"ssid": ssid},
                { headers: { 'x-access-token': token }}
            ).then(res => {
                Alert.alert(
                    'Delete wifi',
                    res.data.message
                );
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                Alert.alert(
                    'Error',
                    'Cannot delete wifi'
                );
            });
        });
    }

    render() {
        return (
            <View style={globalStyles.container}>
                
                <Modal visible={this.state.addColOpen} animationType='slide'>
                    <View style={globalStyles.container}>
                        <View style={modalFormStyles.closeButtonContainer}>
                            <Entypo name='cross' size={36} color='#00b6b6' onPress={() => this.setAddColOpen(false)} />
                        </View>
                        <AddCollection />
                    </View>
                </Modal>

                <Modal visible={this.state.netOpen} animationType='slide'>
                    <View style={globalStyles.container}>
                        <View style={modalFormStyles.closeButtonContainer}>
                            <Entypo name='cross' size={36} color='#00b6b6' onPress={() => this.setNetOpen(false)} />
                        </View>
                        <FlatList
                            ListHeaderComponent={
                                <AddNetwork />
                            }
                            data={this.state.userNetworks}
                            renderItem={({ item }) => (
                                <TouchableOpacity onLongPress={() => this.deleteNetworkAlert(item)} >
                                    <Card>
                                        <Text style={globalStyles.titleText}>{item}</Text>                                            
                                        <AntDesign name='wifi' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item}
                        />
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
                                <TouchableOpacity onPress={() => this.setAddColOpen(true)} >
                                    <Card>
                                        <Text style={globalStyles.titleText}>ADD COLLECTION</Text>                                            
                                        <AntDesign name='pluscircle' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setNetOpen(true)} >
                                    <Card>
                                        <Text style={globalStyles.titleText}>MY NETWORKS</Text>                                            
                                        <AntDesign name='wifi' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                            </>
                        }
                        keyExtractor={(item) => item.colID.toString()}
                        data={this.state.collections}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => this.props.navigation.navigate('DeviceScreen', {item})} 
                                onLongPress={() => this.deleteCollectionAlert(item.collectionName)}
                            >
                                <Card>                                            
                                    <Text style={globalStyles.titleText}>{ item.collectionName && item.collectionName }</Text>                                            
                                    <AntDesign name='caretright' size={24} color='#00b6b6' />
                                </Card>
                            </TouchableOpacity>
                        )}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshHandler}
                        ListFooterComponent={
                            <>
                                <TouchableOpacity onPress={this.logoutAlert}>
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