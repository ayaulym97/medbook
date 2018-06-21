import {Medbook} from "../../config/theme";
import {TabNavigator} from 'react-navigation';
import userProfile from "./profile/userProfile";
import CreateRequest from "./createRequest/index";
import searchDoctorNavigator from "./searchDoctor/index";

const Home = TabNavigator({
    Profile:{
        screen: userProfile
    },
    CreateRequest:{
        screen: CreateRequest
    },
    SearchDoctor: {
        screen: searchDoctorNavigator
    }
}, {
    initialRouteName: 'CreateRequest',
    headerMode: 'none',
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showLabel: false,
        showIcon: 'true', // Shows an icon for both iOS and Android
        style: {
            backgroundColor: '#fff', // Makes Android tab bar white instead of standard blue
            height: 45,
            paddingVertical:0,
            margin: 0
        },
        indicatorStyle: {
            height: 3,
            bottom: 0,
            backgroundColor: '#0B3356',
        },
    }

});
export default Home;