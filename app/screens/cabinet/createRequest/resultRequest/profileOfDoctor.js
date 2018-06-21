import {Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import React from 'react';

import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import Modal from 'react-native-modal';
import _filter from 'lodash/filter';
import {NavigationActions} from 'react-navigation';

import DoctorService from "../../../../data/services/DoctorService";
import HTTPClient from "../../../../data/HTTPClient";
import {Medbook} from '../../../../config/theme';
import {scale} from '../../../../config/scale';
import {Panel} from '../../../../config/Panel';
import {staticValues} from '../../../../data/staticValue';
let datesBlackList = [{
    start: moment().subtract(30,'days'),
    end: moment().subtract(1, 'days')  // total 4 days enabled
}];
export default class profileOfDoctor extends React.Component{
    calendar=null;
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            loader: false,

            workTimeList: [],
            doctorCard: [],
            dayList: [],
            busyWorkTimeList: [],
            pastTime:false,

            noService: false,
            choosenBtn: 0,

            services:[],

            doctorId: props.navigation.state.params.doctorId,
            requestId: props.navigation.state.params.requestId,
        };
        this.doctorProfile();
    }


    static navigationOptions = ({ navigation}) => ({
        header: null,
        tabBarIcon: ({ focused }) => (
            <Image source={
                focused ?
                    require('../../../../assets/icons/home_active.png'):
                    require('../../../../assets/icons/home_inactive.png')
            }
                   style={{height:scale(21), width:scale(22)}}
            />
        )});
    _showModal = () => this.setState({ isModalVisible: true });
    _hideModal = () => this.setState({ isModalVisible: false });

    logoutNavigation(){
        this._hideModal();
        setTimeout(() => {
            let resetActionLogOut = NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({routeName: 'Home'})
                ]
            });

            this.props.navigation.dispatch(resetActionLogOut)
        }, 50);
    }
    doctorProfile(){
        // console.log(this.state.doctorId,"DOCTORID")
        DoctorService.getDoctorProfile(this.state.doctorId).then((response) => {

            let list = [];
            list.push(response);
            this.setState({
                doctorCard: list
            });
            // console.log(this.state.doctorCard);
            // console.log(list);

            setTimeout(() => {
                this.setState({
                    loader: true,
                });
            }, 1000);

        }, (error) => {
            // console.log(error.response, "ERROR");
        });
    }
    getWorktimeID(time){
        if (this.state.busyWorkTimeList.includes(time.id)){
            Alert.alert("Данное время уже забронировано!");
            return false;
        }
        let list = [];
        list.push({
            id: time.id,
            doctorId: this.state.doctorId,
            date: moment.utc().format('YYYY-MM-DD HH:mm'),
            requestId: this.state.requestId
        });

        this.setState({
            choosenBtn: time.id,
            workTimeList: list
        });
    }
    removeBusyWorktimes() {
        let example = [];
        this.state.dayList.forEach((item) => {
            item.busytime.forEach((item2) => {
                if (moment(item2.request.datetime).format("YYYY-MM-DD") === moment(this.state.selectedDay).format("YYYY-MM-DD")) {
                    example.push(item.id);
                }
            });
        });

        this.setState({
            busyWorkTimeList: example
        });
    }
    request(){
        if (this.state.dayList.length === 0){
            Alert.alert("Доктор в это время не работает!");
            return false;
        }
        if (this.state.workTimeList.length === 0 && this.state.dayList.length !== 0){
            Alert.alert("Выберите время!");
            return false;
        }
        let list = this.state.workTimeList;
        let data={};
        data["doctor"] = list[0].doctorId;
        data["worktime"]= list[0].id;
        data["datetime"]= list[0].date;
        data["request"]= list[0].requestId;

        DoctorService.postDoctorWorkTime(data).then((response)=>{
            // console.log(response,"WORKTIME RESPONSE");

        },(error)=>{
            // console.log(error.response, "WORKTIME ERROR");
        });
            this._showModal();
    }

    showWorktime(date){
        if ((date).diff(moment(), "days") < 0) {
            this.setState({
                pastTime: true
            })
        }else {
            let dayOfWeek = moment(date).day();
            let worktimes = _filter(this.state.doctorCard[0].worktime, (worktime) => worktime.day === dayOfWeek);

            this.setState({
                dayList: worktimes,
                workTimeList: [],
                choosenBtn: 0,
                pastTime:false
            });
            setTimeout(() => {
                this.removeBusyWorktimes();
            }, 150);
        }
    }

    render(){
        return (
            this.state.loader ?(
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() =>this.props.navigation.goBack()}>
                                <Image style={styles.back}
                                       source={require('../../../../assets/icons/back.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.firstTxt}>ПРОФИЛЬ ДОКТОРА</Text>
                        </View>


                        {this.state.doctorCard.map((i, key) =>
                            <View style={styles.doctorCard} key={key}>
                                <Image style={styles.doctorAva} source={{uri: HTTPClient.MEDIA_URL + i.avatar}}/>
                                <View style={styles.info} key={key}>
                                    <Text style={styles.doctorName} numberOfLines={3}>
                                        {i.full_name}
                                    </Text>
                                    <ScrollView style={{flex:1}}>
                                        <View style={styles.specializationView}>
                                            <Text style={styles.specialization}>
                                                {
                                                    i.speciality.map((speciality, key) =>
                                                        key > 0 ?
                                                            <Text key={key}>
                                                                , {speciality.name}
                                                            </Text>:
                                                            <Text key={key}>
                                                                {speciality.name}
                                                            </Text>
                                                    )
                                                }
                                            </Text>
                                        </View>

                                    </ScrollView>

                                    <View style={styles.specView}>
                                        <Text style={styles.experience}>Cтаж:</Text>
                                        <Text style={styles.specialization}>{i.experience} лет</Text>
                                    </View>

                                </View>
                            </View>
                        )
                        }
                        <View style={styles.createRequest}>
                            <Text style={styles.createRequestTxt}>
                                CОЗДАЙТЕ ЗАЯВКУ ПРЯМО СЕЙЧАС
                            </Text>
                        </View>

                        <View style={styles.mainBlock}>
                            <CalendarStrip
                                ref={(calendar) => {this.calendar = calendar}}
                                maxDayComponentSize={50}
                                style={styles.calendarStyle}
                                calendarHeaderStyle={{color:Medbook.colors.screen.third}}
                                locale={staticValues.locale}
                                onDateSelected={(date)=>this.showWorktime(date)}
                                dateNumberStyle={{color:Medbook.colors.screen.third}}
                                dateNameStyle={{color:Medbook.colors.screen.third}}
                                highlightDateNumberStyle={{color:Medbook.colors.backgroundNinth,fontWeight:'bold'}}
                                highlightDateNameStyle={{color:Medbook.colors.backgroundNinth,fontWeight:'bold'}}
                                iconLeft={require('../../../../assets/icons/left.png')}
                                iconRight={require('../../../../assets/icons/right.png')}
                                iconContainer={{flex: 0.1}}
                                datesBlacklist={datesBlackList}
                            />
                            {
                                this.state.dayList.length === 0 ?
                                    <View style={[styles.noDoctors, styles.timeScroll]}>
                                        {this.state.pastTime ?
                                            <Text style={styles.noDoctorsText}>Вы не можете записаться на прошедшее время!</Text>:
                                            <Text style={styles.noDoctorsText}>Доктор в этот день не работает</Text>}
                                    </View>:
                                    (
                                        this.state.pastTime ?
                                            <View style={[styles.noDoctors, styles.timeScroll]}>
                                                <Text style={styles.noDoctorsText}>Вы не можете записаться на прошедшее время!</Text>
                                            </View>
                                            :
                                            <ScrollView horizontal= {true}
                                                        showsVerticalScrollIndicator={false}
                                                        style={styles.timeScroll}>{
                                                this.state.dayList.map((time,key)=>
                                                    <TouchableOpacity
                                                        key={key}
                                                        onPress={()=>this.getWorktimeID(time)}
                                                        style={
                                                            this.state.busyWorkTimeList.includes(time.id) ?
                                                                [styles.timeBtn, styles.busyBtn]:
                                                                (
                                                                    this.state.choosenBtn === time.id ? [styles.timeBtn, styles.timeBtnPressed]: styles.timeBtn
                                                                )}
                                                    >
                                                        <Text style={this.state.busyWorkTimeList.includes(time.id) ?
                                                            [styles.timeTxt, {color:'black'}]:[styles.timeTxt, {color:'white'}]}>
                                                            {time.hour_start} - {time.hour_end}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </ScrollView>


                                    )
                            }
                            <TouchableOpacity style={styles.btn}  onPress={()=>this.request()}>
                                <Text style={styles.btnTxt}>
                                    Записаться на прием
                                </Text>
                                <Modal
                                    isVisible={this.state.isModalVisible}
                                    animationIn={'slideInLeft'}
                                    animationOut={'slideOutRight'}>
                                    <View style={styles.modal}>
                                        <View style={styles.modalTxtView}>
                                            <Text style={styles.modalTxt}>
                                                Вы успешно оставили заявку. В ближайшее время с вами свяжется диспетчер!
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={styles.modalBtn}  onPress={() =>this.logoutNavigation()}>
                                            <Text style={styles.modalBtnTxt}>
                                                ЗАКРЫТЬ
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>

                            </TouchableOpacity>

                        </View>
                        <ScrollView style={styles.doctorInfo}>
                            <Panel title ="МЕСТО РАБОТЫ" image={require('../../../../assets/icons/hospital-buildings.png')}>
                                {this.state.doctorCard.map((item,i) =>
                                    <View style={{flexDirection:'column'}} key={i}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={styles.boldTxt}>Клиника:</Text>
                                            <Text style={styles.subTxt}>{item.place.name}</Text>
                                        </View>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={styles.boldTxt}>Адрес:</Text>
                                            <Text style={styles.subTxt}>{item.place.address}</Text>
                                        </View>

                                    </View>
                                )}
                            </Panel>
                            <Panel title="ИНФОРМАЦИЯ" image={require('../../../../assets/icons/info.png')}>
                                {this.state.doctorCard.map((item,i) =>
                                    <View style={{flexDirection:'column'}} key={i}>
                                        {
                                            item.education.length === 0 ?
                                                (
                                                    <View style={styles.noDoctors}>
                                                        <Text style={styles.noDoctorsText}>Информация отсутствует</Text>
                                                    </View>
                                                ):
                                                (
                                                    item.education.map((edu,i)=>
                                                        <View style={{flexDirection:'column'}} key={i}>
                                                            <Text style={styles.boldTxt}>Образование:</Text>
                                                            <Text style={styles.subTxt} numberOfLines={10}>{edu.description}</Text>
                                                        </View>
                                                    )
                                                )
                                        }
                                    </View>
                                )}
                            </Panel>
                            <Panel title="УСЛУГИ" image={require('../../../../assets/icons/services.png')}>
                                {this.state.doctorCard.map((item,i) =>
                                    <View style={{flexDirection:'column'}} key={i}>
                                        {
                                            item.service.length === 0 ?
                                                (
                                                    <View style={styles.noDoctors}>
                                                        <Text style={styles.noDoctorsText}>У этого врача услуги отсутствуют</Text>
                                                    </View>
                                                ):
                                                (
                                                    item.service.map((service,i)=>
                                                        <View key={i}>
                                                            {item.service.map((service)=>
                                                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                                                    <Text style={styles.boldTxt} numberOfLines={2}>{service.name}</Text>
                                                                    <Text style={styles.priceTxt}>{service.price}</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    )
                                                )
                                        }

                                            </View>
                                )
                                }
                            </Panel>
                        </ScrollView>
                    </View>)
                :
                (
                    <View style={styles.containerLoader}>
                        <ActivityIndicator size="large" color="#0B3356"/>

                    </View>
                )
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerLoader: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header:{
        height: scale(35),
        flexDirection: 'row',
        marginTop: (Platform.OS === 'ios') ? scale(40) : 20,

    },
    back:{
        marginLeft: scale(18),
    },
    firstTxt:{
        fontSize: Medbook.fonts.sizes.p3,
        fontWeight: 'bold',
        marginHorizontal: scale(65),
        textAlign: 'center',
        justifyContent: 'center',
        color: Medbook.colors.text.first,
    },

    doctorCard:{
        flexDirection:'row',
        marginHorizontal:scale(30),
    },
    doctorAva:{
        height:scale(120),
        width: scale(120),
        borderRadius: scale(60),
    },
    info:{
        flexDirection: 'column',
        paddingTop: scale(5),
        paddingLeft: scale(15),
    },
    doctorName: {
        fontSize: Medbook.fonts.sizes.p0,
        fontWeight: '400',
        color: Medbook.colors.text.first,
        maxWidth:'90%'
    },
    specialization: {
        fontSize: Medbook.fonts.sizes.p5,
        color: Medbook.colors.text.secondary,
        marginTop: scale(10),
    },
    specializationView: {
        flexDirection: 'column',
        width: '80%',
        height:'50%',
    },
    experience:{
        marginRight: scale(5),
        marginTop: scale(10),
        fontSize: Medbook.fonts.sizes.p5,
        fontWeight: '400',
        color: Medbook.colors.text.first,
    },
    createRequest: {
        height: scale(28),
        backgroundColor: Medbook.colors.backgroundNinth,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(5),

    },
    createRequestTxt: {
        color: 'white',
        fontSize: Medbook.fonts.sizes.p4,
        fontWeight: 'bold'
    },
    mainBlock:{
        flexDirection:'column',
    },
    timeBtn:{
        height: scale(30),
        width: scale(100),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Medbook.colors.backgroundSixth,
        marginHorizontal: scale(5),

        borderColor: Medbook.colors.backgroundSixth,
        borderWidth: 1,
        borderRadius:scale(5),
    },
    busyBtn: {
        backgroundColor:Medbook.colors.backgroundEighth,
        borderColor:Medbook.colors.backgroundEighth,
    },
    timeBtnPressed:{
        backgroundColor: Medbook.colors.screen.third,
        borderColor: Medbook.colors.screen.third,
    },
    timeTxt:{
        fontSize: Medbook.fonts.sizes.p4,
        color: 'white',
    },
    timeScroll:{
        paddingLeft: scale(10),
        paddingTop: scale(10),
    },
    btn:{
        height: scale(52),
        marginTop: scale(10),
        marginHorizontal: scale(35),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(30),
        backgroundColor: Medbook.colors.backgroundTenth,
    },
    btnTxt:{
        color: 'white',
        fontSize: Medbook.fonts.sizes.p2,
        fontWeight:  '400',
    },
    boldTxt:{
        fontSize: Medbook.fonts.sizes.p5,
        color: Medbook.colors.text.first,
        fontWeight:'bold',
        marginTop: scale(10),
        marginRight: scale(5),
        maxWidth: '90%',
    },
    subTxt:{
        fontSize: Medbook.fonts.sizes.p5,
        color: 'rgb(120, 120, 120)',
        marginTop: scale(10),
        maxWidth:'100%',
    },
    priceTxt:{
        fontSize:Medbook.fonts.sizes.p5,
        color:Medbook.colors.textFifth,
        textAlign:'right'
    },
    doctorInfo:{
        flexDirection:'column',
        paddingHorizontal:25,
        marginTop:10,
    },
    modal:{
        flexDirection: 'column',
        width: '95%',
        height:'33%',
        backgroundColor: 'white',
        borderRadius: scale(5),
    },
    modalTxt:{
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.h4,
        fontWeight: '300',
        width: '90%',
        textAlign:'center',
    },

    modalBtn:{
        height: '20%',
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 9,
        borderColor:Medbook.colors.backgroundTenth,
        backgroundColor:Medbook.colors.backgroundTenth
    },
    modalBtnTxt:{
        color: 'white',
        fontSize: Medbook.fonts.sizes.p1,
        fontWeight: '500',
    },
    modalTxtView: {
        height: '80%',
        width: '100%',
        justifyContent:'center',
        alignItems:'center',

        borderTopLeftRadius:scale(1),
        borderTopRightRadius:scale(1),
    },
    calendarStyle:{
        height:scale(80),
        paddingTop:scale(10),
        paddingBottom:scale(5),
        borderBottomColor:Medbook.colors.border.second,
        borderBottomWidth:1,
        marginHorizontal:scale(20)
    },

    noDoctors: {
        height: scale(30),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDoctorsText: {
        fontSize: Medbook.fonts.sizes.p4,
        color: 'rgb(120, 120, 120)',
        textAlign: 'center'
    },
    loadingGif:{
        alignSelf: 'center',
        justifyContent: 'center',
        width: scale(100),
        height: scale(100)
    },specView:{
        flexDirection: 'row',
        flex:1
    }
});





