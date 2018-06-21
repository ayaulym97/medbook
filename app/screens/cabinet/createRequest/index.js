import React from 'react';
import {StackNavigator} from 'react-navigation';

import {createRequest} from "./createRequest";
import resultRequest from "./resultRequest/resultRequest";
import profileOfDoctors from './resultRequest/profileOfDoctor'

const CreateRequest = StackNavigator({
        createRequest: {
            screen: createRequest,
            header: 'none'
        },
        resultRequest: {
            screen: resultRequest,
            header: 'none'
        },
        profileOfDoctors: {
            screen: profileOfDoctors,
            navigationOptions: {
                headerMode: 'none'
            }
        }

    },
    {
        headerMode: 'none'
    }
);


export default CreateRequest;
