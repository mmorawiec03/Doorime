import React, {useState} from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import * as userDataUnparsed from '../data/userData.json';
import CollectionCard from '../shared/CollectionCard';

export default function Home({ navigation }) {
    const [collectionData, setCollectionData] = useState(userDataUnparsed.user.collections);
    
    return (
        <View style={{backgroundColor: '#a1e6e3', flex:1}}>
        <View style={globalStyles.subheader}>
            <Text style={globalStyles.textNotHighlighted}>Hello <Text style={globalStyles.textHighlight}>{userDataUnparsed.user.username}</Text>, here are your collections:</Text>
        </View>
        <View style={globalStyles.container}>
        <FlatList 
            keyExtractor={(item) => item.colID}
            data={collectionData} 
            renderItem={( {item} ) => (
            <TouchableOpacity onPress={() => navigation.navigate('DeviceScreen', item)}>
                <CollectionCard>
                    <Text style={globalStyles.titleText}>{ item.collectionName }</Text>
                    <Text>Devices: { item.numberOfDevices } | Last change: { item.lastStateChange}</Text>
                </CollectionCard>
            </TouchableOpacity>
            )}
        />
        </View>
        </View>
    );
}
//ss