import React from 'react';
import {Medbook} from './theme';
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scale} from './scale';

export class Panel extends React.Component{
    constructor(props){
        super(props);
        this.icons = {
            'up'    : require('../assets/icons/sort-up.png'),
            'down'  : require('../assets/icons/sort-down.png')
        };

        this.state = {
            title       : props.title,
            image:props.image,
            expanded    : false,
            animation   : new Animated.Value()
        };
    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }
        return (
            <Animated.View
                style={[styles.container,{height: this.state.animation}]}>
                <TouchableOpacity onPress={this.toggle.bind(this)}>
                    <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                        <Image style={styles.iconImage} source={this.state.image}/>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <TouchableOpacity
                            onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1">
                            <Image
                                style={styles.buttonImage}
                                source={icon}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View>
                    {this.state.expanded&&(
                        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                            {this.props.children}
                        </View>
                    )}
                </View>



            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor: Medbook.colors.screen.six,
        borderBottomWidth:1
    },
    title:{
        flex:1,
        fontSize:Medbook.fonts.sizes.p5,
        padding:10,
        color:Medbook.colors.text.first,
        fontWeight:'bold'
    },
    buttonImage:{
        width:10,
        height:6
    },
    body:{
        padding:10,
        paddingTop:0
    },
    iconImage:{
        marginLeft:10,
        height:scale(16),
        width:scale(16)
    }
});

