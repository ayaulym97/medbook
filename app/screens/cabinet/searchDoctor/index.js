import React from 'react';
import {StackNavigator} from 'react-navigation';

import doctorProfile from "./doctorProfile";
import {SearchDoctor} from "./searchDoctor";


const searchDoctorNavigator = StackNavigator({
        searchDoctor: {
            screen: SearchDoctor,
            header:'none'
        },
        doctorProfile: {
            screen: doctorProfile,
            navigationOptions: {
                headerMode: 'none'
            }
        },
    },

);

export default searchDoctorNavigator;
