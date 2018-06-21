
import React, { Component } from 'react';
import AuthService from "./app/data/services/AuthService";
import {StackNavigator} from 'react-navigation';
import {Tutorial} from "./app/screens/tutorials/tutorial";
import {Authorization} from "./app/screens/auth/auth";
import Home from './app/screens/cabinet/index'

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];

    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

export default class App extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            route: "Tutorials"
        };
        this.getToken();
    }
    async getToken(){
        AuthService.getAccessToken().then((response)=>{
             this.setState({
                    route: "Home",
                    isLoading: false
                });
        }, (e)=>{
            this.setState({
                isLoading: false
            })
        })

    }

    render() {
         const ThreeVA = StackNavigator({
            Tutorials:{
                screen: Tutorial
            },
            Authorization:{
                screen: Authorization
            },
            Home: {
                screen: Home
            }
        }, {
            headerMode: 'none',
             initialRouteName: this.state.route,
         });
    return(
        <ThreeVA
            onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getCurrentRouteName(currentState);
                const prevScreen = getCurrentRouteName(prevState);
        }}
        />
    )
  }
}
