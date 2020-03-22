import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer} from 'react-navigation';
import Collections from '../screens/collectionScreen';
import Devices from '../screens/deviceScreen';

const screens = {
    CollectionScreen: {
        screen: Collections,
        navigationOptions: {
            title: 'Your Collections',
            //headerStyle: { backgroundColor: '#f8f8f2' }
          }
    },
    DeviceScreen: {
        screen: Devices,
        navigationOptions: {
            title: 'Your Devices',
            //headerStyle: { backgroundColor: '#eee' }
          }
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
      headerTintColor: '#222',
      headerStyle: { backgroundColor: '#8be9fd', height: 60, borderBottomWidth:0, height: 80 },
    }
  });

export default createAppContainer(HomeStack);