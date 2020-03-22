import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    marginVertical: 6,
    backgroundColor: '#282a36',
  },
  subheader: {
    padding: 20,
    backgroundColor: '#f8f8f2',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: 'black',
    borderTopWidth:2,
    borderBottomWidth:2,
    flexWrap: 'wrap'
  },
  open: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fafba4', //F46F87
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
},
closed: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#eca0b6',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,

},
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
},
textHighlight: {
    //borderWidth:2,
    padding:3,
    //borderColor: '#111',
    //borderRadius: 6,
    //backgroundColor: '#A7C3FF',
    //shadowColor: 'red',
    //shadowOffset: 10,
    fontWeight: 'bold',
    textShadowColor: '#8be9fd',
    textShadowOffset:{ width: 0.2, height: 0.2 },
    textShadowRadius:3
},
textNotHighlighted: {
  marginVertical:6,
  marginHorizontal:3
  //borderWidth:3
}
});