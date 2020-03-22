import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { notify, initnotify, getToken } from 'expo-push-notification-helper';
import { globalStyles } from '../styles/global';
import * as userDataUnparsed from '../data/userData.json';
import CollectionCard from '../shared/CollectionCard';

export default function Home({ navigation }) {
    const [collections, setCollections] = useState(userDataUnparsed.user.collections);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // get collections from server
    }, [refreshing]);

    const refreshHandler = () => {
        setRefreshing(true);
    }

    const findOpenAndNotify = () => {
        let openList = collections.map(collection => {
            return ({
                collection: collection.collectionName,
                devices: collection.devices.filter(device => {
                    return !device.isClosed;
                })
            });
        });
        openList.forEach(collection => {
            collection.devices.forEach(device => {
                notification(collection.collection, `${device.deviceName} is open!`);
            });
        });
        setRefreshing(false);
    }

    const notification = (title, body) => {
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

    const pressHandler = () => {
        findOpenAndNotify();
    }

    const changeState = (colId, devId) => {
        let tempColData = collections;
        for (let i = 0; i < tempColData.length; i++) {
            if (tempColData[i]['colID'] === colId) {
                for (let j = 0; j < tempColData[i]['devices'].length; j++) {
                    if (tempColData[i]['devices'][j]['devID'] === devId) {
                        tempColData[i]['devices'][j]['isClosed'] = !tempColData[i]['devices'][j]['isClosed'];
                        break;
                    }
                }
            }
        }
        setCollections(tempColData);
    }

    return (
        <View style={{backgroundColor: '#282a36', flex:1}}>
            <View style={globalStyles.subheader}>
                <Text style={globalStyles.textNotHighlighted}>Hello <Text style={globalStyles.textHighlight}>{userDataUnparsed.user.username}</Text>, here are your collections:</Text>
                <Button 
                    title='Trigger notification'
                    onPress={pressHandler}
                />               
            </View>
            <View style={globalStyles.container}>
                <FlatList 
                    keyExtractor={(item) => item.colID.toString()}
                    data={collections}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('DeviceScreen', {item, changeState})}>
                            <CollectionCard>
                                <Text style={globalStyles.titleText}>{ item.collectionName }</Text>
                                <Text>Devices: {item.devices.length} | Last change: {item.lastStateChange}</Text>
                            </CollectionCard>
                        </TouchableOpacity>
                    )}
                    refreshing={refreshing}
                    onRefresh={refreshHandler}
                />
            </View>
        </View>
    );
}
//ss