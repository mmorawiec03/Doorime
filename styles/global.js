import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262d37', //d7fffd
  },
  contextCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 20,
    color: 'lightgrey',
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  highlighted: {
    fontSize: 20,
    color: 'lightgrey',
    textShadowColor: '#00b6b6',
    textShadowRadius: 10,
  },
  paragraph: {
    fontSize: 16,
    color: 'lightgrey',
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  darkBackdround: {
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderRadius: 5
  },
  welcomeText: {
    fontSize: 20,
    color: 'lightgrey',
    textShadowColor: 'black',
    textShadowRadius: 10,
    padding: 5
  },
});