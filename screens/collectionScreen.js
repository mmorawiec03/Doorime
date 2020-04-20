import React  from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Alert, ImageBackground } from 'react-native';
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
import AddNetwork from '../forms/addNetwork';
import PopupCard from '../shared/popupCard';
import { setAuthData } from '../storage/authData';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

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
            setAuthData({"username": '', "isAuth": false});
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
                        console.log('[INFO] The user has entered the house');
                    }); 
                }
            });
        } else if (state.type !== 'none' && state.type !== 'unknown') {
            getAtHome().then(atHome => {
                console.log(`[INFO] Current network state: ${state.type} | Previous atHome state: ${atHome}`);
                if (atHome === 'true') {
                    console.log('[INFO] The user has left the house | Sending notification');
                    setAtHome('false').then(() => {
                        setTimeout(() => {
                            this.getUserData(this.findOpenAndNotify());
                        }, 8000);
                    });
                }
            });
        } else {
            console.log('[INFO] Not connected to any network | Waiting for connection');
        }
    });
      

    findOpenAndNotify = () => {
        this.state.collections.map(collection => {
            return ({
                collection: collection.collectionName,
                devices: collection.devices.filter(device => {
                    return !device.isClosed;
                })
            });
        }).forEach(collection => {
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

    deleteCollectionAlert = (id, name) => {
        Alert.alert(
            'Delete collection',
            `Are you sure you want to delete ${name} collection?`,
            [
                {text: 'Delete', onPress: () => this.deleteCollection(id)},
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

    deleteUserAlert = () => {
        Alert.alert(
            'Delete account',
            `Are you sure you want to delete your account?`,
            [
                {text: 'Delete', onPress: this.deleteUser},
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

    deleteCollection = (id) => {
        console.log('[INFO] DELETE request | Path: /delete_collection');
        getAuthToken().then(token => {
            api.delete('/delete_collection', {
                data: {"collection": id},
                headers: { 'x-access-token': token }
            }).then(res => {
                Alert.alert(
                    'Delete collection',
                    res.data.message
                );
                this.getUserData();
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
            api.delete('/delete_wifi', {
                    data: {"ssid": ssid},
                    headers: { 'x-access-token': token }
            }).then(res => {
                Alert.alert(
                    'Delete wifi',
                    res.data.message
                );
                this.getUserData();
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                Alert.alert(
                    'Error',
                    'Cannot delete wifi'
                );
            });
        });
    }

    deleteUser = () => {
        console.log('[INFO] DELETE request | Path: /delete_user');
        getAuthToken().then(token => {
            api.delete('/delete_user', {
                    headers: { 'x-access-token': token }
            }).then(res => {
                Alert.alert(
                    'Delete account',
                    res.data.message
                );
                if (res.data.message.includes('The user has been deleted'))
                    this.logout();
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                Alert.alert(
                    'Error',
                    'Cannot delete account'
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
                        <AddCollection getUserData={this.getUserData} />
                    </View>
                </Modal>

                <Modal visible={this.state.netOpen} animationType='slide'>
                    <View style={globalStyles.container}>
                        <View style={modalFormStyles.closeButtonContainer}>
                            <Entypo name='cross' size={36} color='#00b6b6' onPress={() => this.setNetOpen(false)} />
                        </View>
                        <FlatList
                            ListHeaderComponent={
                                <AddNetwork getUserData={this.getUserData} />
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
                                    <ImageBackground source={require('../assets/collections-background.jpg')} style={globalStyles.headerImage} opacity={0.5}>
                                        <Text style={globalStyles.titleText}>WELCOME {this.state.username.toUpperCase()}</Text>
                                    </ImageBackground>  
                                </View>
                                <LinearGradient
                                    colors={['transparent', '#00b6b6']}
                                    start={[0.6, 0]} end={[5, 0]}
                                >
                                <TouchableOpacity onPress={() => this.setAddColOpen(true)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>ADD COLLECTION</Text>                                            
                                        <AntDesign name='pluscircle' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setNetOpen(true)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>MY NETWORKS</Text>                                            
                                        <AntDesign name='wifi' size={24} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                                </LinearGradient>
                            </>
                        }
                        keyExtractor={(item) => item.colID.toString()}
                        data={this.state.collections}
                        renderItem={({ item }) => (
                            <PopupCard
                                idKey={'collection'}
                                id={item.colID}
                                path={'/rename_collection'}
                                getUserData={this.getUserData}
                                onPress={() => {this.props.navigation.navigate('DeviceScreen', {item, getUserData: this.getUserData}); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}}
                                onDelete={() => this.deleteCollectionAlert(item.colID, item.collectionName)}
                            >
                                <Card>                                            
                                    <Text style={globalStyles.titleText}>{ item.collectionName && item.collectionName }</Text>                                            
                                    <AntDesign name='caretright' size={24} color='#00b6b6' />
                                </Card>
                            </PopupCard>
                        )}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshHandler}
                        ListFooterComponent={
                            <>
                            <LinearGradient
                                colors={['transparent', '#FF0000']}
                                start={[0.6, 0]} end={[5, 0]}
                            >
                                <TouchableOpacity onPress={this.deleteUserAlert} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>DELETE ACCOUNT</Text>                                            
                                        <AntDesign name='deleteuser' size={30} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.logoutAlert} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <Card>
                                        <Text style={globalStyles.titleText}>LOGOUT</Text>                                            
                                        <MaterialCommunityIcons name='logout' size={32} color='#00b6b6' />
                                    </Card>
                                </TouchableOpacity>
                            </LinearGradient>
                            </>
                        }
                    />
                )} 
            </View>
        );
    }
}

export default Home;