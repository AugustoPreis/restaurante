import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Login from '../screens/login/Login';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: {
      screen: Login,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;