import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Card(props) {
  return (
    <View style={styles.card}>
      { props.children }
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 100,
      padding: 20,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderBottomWidth: 1,
  }
});