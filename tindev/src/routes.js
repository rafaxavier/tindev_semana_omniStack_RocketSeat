import { createAppContainer, createSwitchNavigator} from 'react-navigation';


import Login from './pages/Login';
import Main from './pages/Main';
// createSwitchNavigator
export default createAppContainer(
    createSwitchNavigator({
        Login, //primeira pg ser carregada
        Main,
    })
);