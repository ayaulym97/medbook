import React, { Component } from 'react';
import {Medbook} from '../../../config/theme';
import {StyleSheet,Text,View,Image,TouchableOpacity,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {scale} from "../../../config/scale";
export class Accordion extends Component{
    constructor(props){
        super(props);
        this.icons = {
            'open'    : 'triangle-down',
            'close'  : 'triangle-up'
        };

        this.state = { expanded : false };
    }

    toggle(){
        this.setState({
            expanded : !this.state.expanded
        });
    }
    render(){
        let icon = this.icons['open'];
        if(this.state.expanded){
            icon = this.icons['close'];
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.toggle.bind(this)}
                    underlayColor={Medbook.colors.screen.after}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.Header}>
                            {this.props.Header}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.toggle.bind(this)}
                            underlayColor={Medbook.colors.screen.after}>
                            <Icon
                                style={styles.FAIcon}
                                name={icon}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <ScrollView>

                    {
                        this.state.expanded && (
                            <ScrollView style={styles.body}>
                                {this.props.children}
                            </ScrollView>
                        )
                    }
                </ScrollView>

            </View>
        );
    }
}

let styles = StyleSheet.create({
    container   : {
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    Header : {
        fontSize: Medbook.fonts.sizes.p5,
        fontWeight:'bold',
        color: Medbook.colors.text.fifth,
        paddingLeft:scale(15),
        marginTop:scale(5)
    },
    FAIcon : {
        width: scale(30),
        height: scale(30),
        color: Medbook.colors.text.fifth,


    },
    body: {
        padding: scale(10),

    }
});