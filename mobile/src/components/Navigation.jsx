import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Login from '../screens/login/Login';
import Pedidos from '../screens/pedidos/Pedidos';
import PedidoDetalhes from '../screens/pedidos/Detalhes';

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
    PedidoDetalhes: {
      screen: PedidoDetalhes,
      options: {
        title: 'Detalhes do Pedido',
        headerBackVisible: true, //Permite voltar para a tela de pedidos
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;