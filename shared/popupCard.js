import React,{ useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Card from './Card';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { modalFormStyles } from '../styles/modalForm';
import Rename from '../forms/rename';


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
                onLongPress={() => setShowPopup(!showPopup)}
            >
                {children}
            </TouchableOpacity>
            {showPopup &&
                <View>
                    <TouchableOpacity onPress={() => setOpenModal(true)}>
                        <Card>
                            <Text style={globalStyles.paragraph}>RENAME</Text>                                            
                            <AntDesign name='edit' size={24} color='#00b6b6' />
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Card>
                            <Text style={globalStyles.paragraph}>DELETE</Text>                                            
                            <AntDesign name='delete' size={24} color='#00b6b6' />
                        </Card>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}
