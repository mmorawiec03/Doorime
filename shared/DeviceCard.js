import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/*


  DEVICE CARD IS CURRENTLY NOT USED FOR ANYTHING. IT'S NOT USEFUL IS ANY WAY





*/

export default function DeviceCard(props) {
  return (
    //<View style={styles.card}>
    <View style={styles.wholecard}>
      <View style={styles.cardContent}>
        { props.children }
      </View>
      < MaterialCommunityIcons name='door-closed' size={40}  color='#333' style={styles.doorIcon}/>
    </View>
  );
}

const styles = StyleSheet.create({
wholecard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
},
doorIcon: {
    marginHorizontal: 18,
    marginVertical: 20,
}
});