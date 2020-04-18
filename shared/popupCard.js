import React,{ useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Card from './Card';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { modalFormStyles } from '../styles/modalForm';
import Rename from '../forms/rename';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';


export default function PopupCard({ children, onDelete, onPress, idKey, id, path, getUserData }) {

    const [showPopup, setShowPopup] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    
    return (
        <View>

                <Modal visible={openModal} animationType='slide'>
                    <View style={globalStyles.container}>
                        <View style={modalFormStyles.closeButtonContainer}>
                            <Entypo name='cross' size={36} color='#00b6b6' onPress={() => setOpenModal(false)} />
                        </View>
                        <Rename idKey={idKey} id={id} path={path} getUserData={getUserData} />
                    </View>
                </Modal>

            <TouchableOpacity 
                onPress={onPress}
                onLongPress={() => {setShowPopup(!showPopup); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}}
            >
                {children}
            </TouchableOpacity>
            {showPopup &&
                <View>
                    <LinearGradient
                                colors={['transparent', '#00B6B6']}
                                start={[0.6, 0]} end={[4, 0]}
                                >
                    <TouchableOpacity onPress={() => setOpenModal(true)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Card>
                            <Text style={globalStyles.paragraph}>RENAME</Text>                                            
                            <AntDesign name='edit' size={24} color='#00b6b6' />
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Card>
                            <Text style={globalStyles.paragraph}>DELETE</Text>                                            
                            <AntDesign name='delete' size={24} color='#00b6b6' />
                        </Card>
                    </TouchableOpacity>
                    </LinearGradient>
                </View>
            }
        </View>
    )
}
