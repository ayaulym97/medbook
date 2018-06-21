import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, AsyncStorage, TouchableHighlight, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {StackNavigator, NavigationActions} from 'react-navigation';
import {Medbook} from '../../../config/theme';
import {TextInputMask} from "react-native-masked-text";
import {scale} from '../../../config/scale';
import AuthService from "../../../data/services/AuthService";


export class profile extends Component {
    constructor(props){

        super(props);
        this.state = {
            isLoading: true,
            name: '',
            surname: '',
            phone: "",
            editable: false,
            focused: false
        };
        this.logout = this.logout.bind(this);
        this.toggleEditable = this.toggleEditable.bind(this);
        this.getMe();
    };

    static navigationOptions = ({ navigation}) => ({
        header: null,
        tabBarIcon: ({ focused }) => (
             <Image source={
                 focused ?
                 require('../../../assets/icons/user_active.png'):
                     require('../../../assets/icons/profile.png')
             }
                    style={{height:scale(21), width:scale(17)}}
             />
        ),
    });

    async getMe() {
        let header = {};
        header["Authorization"] = "Token " + await AsyncStorage.getItem('@user');

        AuthService.getMe(header).then((response) => {
            this.setState({
                phone: response.username,
                name: response.full_name.split(' ')[0],
                surname: response.full_name.split(' ')[1],
                isLoading: false,
            })
        }, (error) => {
        });
    }

    logout() {
        AsyncStorage.removeItem('@user');
        let resetActionLogOut = NavigationActions.reset({
            index: 0,
            key:null,
            actions: [
                NavigationActions.navigate({routeName: 'Authorization'})
            ]
        });

        this.props.navigation.dispatch(resetActionLogOut)
    }


    toggleEditable() {
        this.setState({
            editable: !this.state.editable,

        })
    }
    toggleEditablePhone(){
        this.setState({
            editablePhone: !this.state.editablePhone
        })
    }


    render() {
        return (
            this.state.isLoading ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0B3356"/>
                    <Text style={[styles.noDoctorsText, {marginTop: scale(30)}]}>Страница загружается...</Text>
                </View>:
                <KeyboardAvoidingView behavior={ 'position'} style={styles.keyboardStyle}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../../assets/icons/3va.png')}/>
                            <Text style={styles.firstTxt}>МОИ ДАННЫЕ</Text>
                        </View>

                        <View style={{justifyContent:'space-around', height:scale(270)}}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.text}>ИМЯ</Text>
                                <TextInput style={[styles.input, styles.inputFirstType]}
                                           onChangeText={(name) => this.setState({name})}
                                           value={this.state.surname}
                                           editable={false}
                                           underlineColorAndroid='transparent'/>
                            </View>

                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.text}>ФАМИЛИЯ</Text>
                                <TextInput style={[styles.input, styles.inputFirstType]}
                                           onChangeText={(surname) => this.setState({surname})}
                                           value={this.state.name}
                                           editable={false}
                                           underlineColorAndroid='transparent'
                                />
                            </View>
                            <View style={{flexDirection: 'column'}}>
                                <View style={styles.viewStyleS}>
                                    <Text style={styles.text}>НОМЕР ТЕЛЕФОНА</Text>
                                </View>
                                <View style={styles.viewStyleS}>
                                    <TextInput style={[styles.input, styles.inputSecondType]}
                                               value='+7'
                                               editable={false}
                                               underlineColorAndroid='transparent'
                                    />
                                <TextInputMask style={[styles.input, styles.inputThirdType]}
                                               type={'custom'}
                                               onChangeText={(phone) => this.setState({phone})}
                                               value={this.state.phone}
                                               options={{mask: '(999)-999-99-99'}}
                                               editable={false}
                                />
                                </View>
                            </View>
                        </View>
                        <TouchableHighlight style={styles.button}>
                            <Text style={styles.textButton} onPress={()=> this.logout()}>ВЫЙТИ</Text>
                        </TouchableHighlight>
                    </View>
                </KeyboardAvoidingView>
        );
    }
}


let styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems:'center',
        flex: 1,
    },
    header:{
        alignItems:'center',
        justifyContent: 'space-between',
    },
    logo:{
        marginTop:'15%',
        height: scale(30.5),
        width: scale(45.1)
    },
    input:{
        height: scale(50),
        borderColor: Medbook.colors.border.txtInput,
        borderWidth: 1,
        shadowColor: Medbook.colors.shadow.base,
        borderRadius: 2,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowOpacity: 1.0,
        color: 'black'
    },
    inputFirstType: {
        width: scale(300),
        paddingHorizontal: '3%'
    },
    inputSecondType: {
        width: scale(55),
        textAlign: 'center'
    },
    firstTxt:{
        marginTop: '5%',
        color: 'rgb(63,75,98)',
        fontSize:Medbook.fonts.sizes.h4,
        fontWeight: 'bold',
        textAlign:'center'

    },
    inputThirdType:{
        width: scale(220),
        paddingHorizontal: '3%'

    },
    button: {
        width: scale(110),
        height: scale(35),
        borderRadius: scale(100),
        backgroundColor: Medbook.colors.screen.fourth,
        marginVertical: '5%'
    },
    textButton:{
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginVertical:'8%',
        width: '60%',
        marginHorizontal: '20%'
    },
    text: {
        fontWeight: 'bold',
        marginBottom: '1.5%',
        color: 'rgb(63,75,98)',
        fontSize: scale(13)
    },
    textInputInitial:{
        color: 'rgb(63,75,98)',
    },
    row:{
        flexDirection: 'row'
    },
    keyboardStyle : {
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white'

    },
    viewStyle:{
        width: scale(300),
        flexDirection:'row',
        justifyContent: 'center'
    },
    textMedicalRecord:{
        width:'95%',
        height:'100%',
        color:'#A9ACB3',
        fontSize: scale(15),
        textAlignVertical:'center',
        paddingVertical: '3%'

    }
,
        containerSecond:{
        backgroundColor: 'white',
        alignItems:'center',
        height: '100%',
    },
    backIcon:{
        left:3,
        top:3,
        width:'10%'
},
    headerText: {
        width:'87%',
        fontWeight:'500',
        fontSize: scale(18),
        paddingHorizontal:'10%',
        color: 'rgb(63,75,98)',
    },
    cardStyle:{
        width: '100%',
        height: '40%',
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        paddingHorizontal: '3%',
        borderRadius: 3,
        borderColor: '#cecdd2',
        borderWidth: 1,
        marginVertical: '2%',
        justifyContent: 'space-around'
},
    viewStyleS:{
        width: scale(300),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loadingContainer:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDoctorsText: {
        fontSize: Medbook.fonts.sizes.p3,
        color: 'rgb(120, 120, 120)',
        textAlign: 'center'
    }
})

const userProfile = StackNavigator({
    profile:{
        screen: profile
    },
    // medicalRecord:{
    //     screen: medicalRecord
    // },
},
    {
        headerMode: 'none'
    }

);

export default userProfile;
