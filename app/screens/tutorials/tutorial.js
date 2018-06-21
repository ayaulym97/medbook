import React from 'react'
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import Swiper from 'react-native-swiper'

import {Medbook} from "../../config/theme";
import {scale} from '../../config/scale';

export class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            changed: false
        };
    }
    swiper=null;

    swipe(){
        this.swiper.scrollBy(1);
        if (this.state.index === 2){
            this.setState({
                changed:true
            });
            this.props.navigation.navigate("Authorization");
        }
        else {
            this.setState({
                    index: this.state.index + 1
                });
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Swiper
                    loop={false}
                    showsButtons={false}
                    ref={(swiper) => {this.swiper = swiper}}
                    dot={<View style={[styles.dotStyle, styles.passive]} />}
                    activeDot={<View style={[styles.dotStyle, styles.active]}/>}
                    onIndexChanged={(index) => {
                        this.setState({
                            index: index
                        })
                    }}
                >
                    <View style={styles.slide}>
                        <Image style={styles.image} source={require("../../assets/image/first.png")}/>
                        <View style={styles.text}>
                            <Text style={styles.title}>CОЗДАНИЕ ЗАЯВКИ</Text>
                            <Text style={styles.subtitle}>3 типа заявок. Консультация у врача. Обследование и анализы. Медицинские процедуры</Text>
                        </View>
                    </View>
                    <View style={styles.slide} >
                        <Image style={styles.image} source={require("../../assets/image/second.png")}/>
                        <View style={styles.text}>
                            <Text style={styles.title}>ЛУЧШИЕ ВРАЧИ</Text>
                            <Text style={styles.subtitle}>Находите лучших врачей клиник. Разные специальности. Более 1000 процедур</Text>
                        </View>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.image} source={require("../../assets/image/third.png")}/>
                        <View style={styles.text}>
                            <Text style={styles.title}>1 ЗАЯВКА = 5 МИНУТ</Text>
                            <Text style={styles.subtitle}>Заявки создаются за одну минуту. Oбрабатываются в течение пяти минут</Text>
                        </View>
                    </View>
                </Swiper>
                <View style={styles.btnView}>
                    <TouchableOpacity
                        onPress={() => this.swipe() }
                        style={styles.controlBtn}>
                        {this.state.index === 2 ?
                            <Text style={styles.controlBtnTxt}>НАЧАТЬ</Text>:
                            <Text style={styles.controlBtnTxt}>ДАЛЕЕ</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    passive: {
        backgroundColor: 'rgb(220, 220, 220)',
    },
    active: {
        backgroundColor: Medbook.colors.backgroundThird
    },
    slide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: '10%',
        paddingBottom: '20%',
    },
    image: {
        width: scale(90 * 2.5),
        height: scale(80 * 2.5)
    },
    text: {
        height: '30%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingHorizontal: '10%',
    },
    title: {
        fontSize: Medbook.fonts.sizes.h4,
        fontWeight: '700',
        color: Medbook.colors.textFourth,
        textAlign: 'center',
    },
    subtitle: {
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.h5,
        fontWeight: '200',
        textAlign: 'center',
    },
    dotStyle: {
        width: scale(9),
        height: scale(9),
        borderRadius: scale(9),
        marginLeft: scale(8),
        marginRight: scale(8),
        marginTop: scale(5),
    },
    controlBtn: {
        height: scale(40),
        width: scale(100),
        marginVertical: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(30),
        backgroundColor: Medbook.colors.backgroundSeventh,
    },
    controlBtnTxt: {
        color: 'white',
        fontSize: Medbook.fonts.sizes.p3,
        fontWeight: 'bold'
    },
    btnView: {
        height: scale(90),
        alignItems: 'center',
    }
});


