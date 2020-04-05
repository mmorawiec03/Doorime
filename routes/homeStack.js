import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer} from 'react-navigation';
import Collections from '../screens/collectionScreen';
import Devices from '../screens/deviceScreen';

const screens = {
    CollectionScreen: {
        screen: Collections,
        navigationOptions: {
            title: 'MY COLLECTIONS',
            //headerStyle: { backgroundColor: '#eee' }
          }
    },
    DeviceScreen: {
        screen: Devices,
        navigationOptions: {
            title: 'DEVICES',
            //headerStyle: { backgroundColor: '#eee' }
          }
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
      headerTintColor: 'lightgrey',
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#262d37', height: 80 },
    }
  });

export default createAppContainer(HomeStack);