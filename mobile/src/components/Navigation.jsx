import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Login from '../screens/login/Login';
import Pedidos from '../screens/pedidos/Pedidos';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screenOptions: {
    headerBackVisible: false,
  },
  screens: {
    Login: {
      screen: Login,
    },
    Pedidos: {
      screen: Pedidos,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;