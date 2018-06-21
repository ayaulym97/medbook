import React from 'react';
import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';

import Modal from "react-native-modal";

import {scale} from "../../../../config/scale";
import {Medbook} from '../../../../config/theme';

import PlaceService from "../../../../data/services/PlaceService";
import DoctorService from "../../../../data/services/DoctorService";
import HTTPClient from "../../../../data/HTTPClient";

export default class resultRequest extends React.Component {
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
        )
    });

    constructor(props){
        super(props);
        this.state = {
            listOfDoctors: [],
            searchDoctors: [],
            districtSearch: [],
            categorySearch: [],

            listOfCategory: [
                {
                    id: 0,
                    name: 'Все'
                },
                {
                    id: 1,
                    name: 'Вторая'
                },
                {
                    id: 2,
                    name: 'Первая'
                },
                {
                    id: 3,
                    name: 'Высшая'
                },
                {
                    id: 4,
                    name: 'КМН'
                },
                {
                    id: 5,
                    name: 'ДМН'
                },
                {
                    id: 6,
                    name: 'Проффессор'
                },
                {
                    id: 7,
                    name: 'Доцент'
                }],
            listOfDistrict: [],

            chooseCategory: {
                id: 0,
                name: 'Все'
            },
            chooseDistrict: {
                id: 0,
                name: 'Все'
            },

            noDoctors: false,
            loadingSpinner : true,
            visibleModal: false,
            modalContent: '',
        };
        this.getListOfDistricts();
        this.getResultById();
    }
    _hideModal = () => this.setState({ visibleModal: false });

    getListOfDistricts() {
        PlaceService.getCities().then((response) => {
            response.map((city) => {
                if (city.id === this.props.navigation.state.params.city.id) {
                    this.setState({
                        listOfDistrict: city.district
                    })
                }
            })
        });
    }
    getResultById(){
        this.setState({
            loadingSpinner: true
        });
        if (this.props.navigation.state.params.id.hasOwnProperty("id")) {
            DoctorService.getResults(this.props.navigation.state.params.id.id).then((response) => {
                this.setState({
                    listOfDoctors: response.doctor,
                    searchDoctors: response.doctor,
                    noDoctors: false
                });

                setTimeout(()=>{
                    this.setState({
                        loadingSpinner: false,
                    })
                }, 3000);
            }, (error) => {
            });
        }
        else {
            setTimeout(()=>{
                this.setState({
                    loadingSpinner: false,
                    noDoctors: true
                })
            }, 3000);
        }
    }

    setModal(content){
        this.setState({
            modalContent: content,
            visibleModal: !this.state.visibleModal
        })
    }

    takeDistrict(district) {
        this.setState({
            visibleModal: false,
            chooseDistrict: {
                id: district.id,
                name: district.name,
            },
        });
        setTimeout(() => {this.searchDistrict()}, 100);
    }
    takeCategory(category){
        this.setState({
            visibleModal: false,
            chooseCategory: {
                id: category.id,
                name: category.name,
            },
        });
        setTimeout(() => {this.searchCategory()}, 100);
    }

    modalContentDistrict = () => (
        <View style={styles.modalContentTypes}>
            <Text style={styles.modalContentTypesText}>Выберите район</Text>
            <TouchableOpacity onPress={()=>this.takeDistrict({id: 0, name: 'Все'})} underlayColor={'rgba(0,0,0,9)'} style={styles.typeModal}>
                <Text style={styles.typeModalText}>Все</Text>
            </TouchableOpacity>
            { this.state.listOfDistrict.map((district)=>
                <TouchableOpacity onPress={()=>this.takeDistrict(district)} underlayColor={'rgba(0,0,0,9)'} style={styles.typeModal}>
                    <Text style={styles.typeModalText}>{district.name}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
    modalContentQualification = () => (
        <View style={styles.modalContentTypes}>
            <Text style={styles.modalContentTypesText}>Выберите квалификацию</Text>
            { this.state.listOfCategory.map((category)=>
                <TouchableOpacity onPress={()=>this.takeCategory(category)} underlayColor={'rgba(0,0,0,9)'} style={styles.typeModal}>
                    <Text style={styles.typeModalText}>{category.name}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    searchDistrict(){
        if (this.state.chooseDistrict.id === 0 && this.state.chooseCategory.id === 0) {
            this.setState({
                searchDoctors: this.state.listOfDoctors,
                districtSearch: [],
                categorySearch: []
            });
            return true;
        }

        let district = [];
        this.state.listOfDoctors.map((doctor) => {
            if(doctor.doctor.place.district === this.state.chooseDistrict.id) {
                district.push(doctor);
            }
        });
        this.setState({
            districtSearch: district
        });
        setTimeout(() => {this.mergeSorting()}, 100);
    }
    searchCategory(){
        if (this.state.chooseDistrict.id === 0 && this.state.chooseCategory.id === 0) {
            this.setState({
                searchDoctors: this.state.listOfDoctors,
                districtSearch: [],
                categorySearch: []
            });
            return true;
        }

        let categorylist = [];
        this.state.listOfDoctors.map((doctor) => {
            if (doctor.doctor.hasOwnProperty('category')) {
                doctor.doctor.category.map((category) => {
                    if (category.id === this.state.chooseCategory.id) {
                        categorylist.push(doctor);
                    }
                })
            }
        });
        this.setState({
            categorySearch: categorylist
        });
        setTimeout(() => {this.mergeSorting()}, 100);
    }
    mergeSorting(){
        let result = [];
        if(this.state.chooseDistrict.id === 0) {
            this.setState({
                searchDoctors: this.state.categorySearch
            });
            return true;
        }
        if(this.state.chooseCategory.id === 0) {
            this.setState({
                searchDoctors: this.state.districtSearch
            });
            return true;
        }

        this.state.districtSearch.map((doctor) => {
            this.state.categorySearch.map((doctorTwo) => {
                if(doctor === doctorTwo){
                    result.push(doctor);
                }
            })
        });

        this.setState({
            searchDoctors: result
        });
    }

    chooseDoctor(id){
        this.props.navigation.navigate("profileOfDoctors", {
            doctorId: id,
            requestId:this.props.navigation.state.params.id.id
        })
    }
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() =>{this.props.navigation.goBack()}}>
                        <Image style={styles.back}
                               source={require('../../../../assets/icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.firstTxt}>РЕЗУЛЬТАТЫ ПОИСКА</Text>
                </View>

                <View style={styles.sortHeader}>
                    <View style={styles.sortHeaderButton}>
                        <TouchableOpacity style={styles.sortButton} onPress={() => this.setModal('district')}>
                            <View style={styles.sortButtonView}>
                                <Text style={styles.sortText}>По району</Text>
                                <View style={styles.sortDropdown}>
                                    <Text style={styles.sortDropdownName}>{this.state.chooseDistrict.name}</Text>
                                    <Image style={styles.sortImage} source={require('../../../../assets/icons/caret-down.png')}/>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sortButton} onPress={() => this.setModal('qualification')}>
                            <View style={styles.sortButtonView}>
                                <Text style={styles.sortText}>Квалификация</Text>
                                <View style={styles.sortDropdown}>
                                    <Text style={styles.sortDropdownName}>{this.state.chooseCategory.name}</Text>
                                    <Image style={styles.sortImage} source={require('../../../../assets/icons/caret-down.png')}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchName}>
                        <Text style={styles.searchNameText}>{this.props.navigation.state.params.name.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.container}>
                    {
                        this.state.noDoctors ?
                            <View style={styles.noDoctors}>
                                <Image style={styles.noDoctorsImage} source={require('../../../../assets/icons/search_doctor.png')}/>
                                <Text style={styles.noDoctorsText}>По данному запросу, докторов не найдено.</Text>
                            </View>:
                            (
                                this.state.loadingSpinner ?
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#0B3356"/>
                                    <Text style={[styles.noDoctorsText, {marginTop: scale(30)}]}>Загрузка докторов...</Text>
                                </View> :

                                (
                                    this.state.searchDoctors.length === 0 ?
                                        <View style={styles.noDoctors}>
                                            <Image style={styles.noDoctorsImage} source={require('../../../../assets/icons/search_doctor.png')}/>
                                            <Text style={styles.noDoctorsText}>По данному запросу, докторов не найдено.</Text>
                                        </View>:
                                        <ScrollView style={styles.doctorContainer}>
                                            {
                                                this.state.searchDoctors.map((doctor) =>
                                                    <TouchableOpacity style={styles.doctorCard} onPress={() => this.chooseDoctor(doctor.doctor.id)}>
                                                        <View style={styles.doctorInfo}>
                                                            <View style={styles.doctorMain}>
                                                                <View style={styles.infoProfile}>
                                                                    <Image
                                                                        style={styles.doctorPhoto}
                                                                        source={{uri: HTTPClient.MEDIA_URL + doctor.doctor.avatar}}
                                                                    />
                                                                </View>
                                                            </View>

                                                            <View style={styles.doctorPlace}>
                                                                <View style={styles.doctorInformation}>
                                                                    <Text style={styles.name}>{doctor.doctor.full_name}</Text>
                                                                    <View style={{flexDirection: 'row', width: '80%'}}>
                                                                        <Text style={styles.speciality}>{
                                                                        doctor.doctor.speciality.map((speciality, key) =>
                                                                            key > 0 ?
                                                                                <Text>
                                                                                    , {speciality.name}
                                                                                </Text>:
                                                                                <Text>
                                                                                    {speciality.name}
                                                                                </Text>
                                                                        )
                                                                    }</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.place}>
                                                                <Image style={styles.placeImage}
                                                                       source={require('../../../../assets/icons/hospital-buildings.png')}/>
                                                                <Text style={styles.placeText}>Клиника
                                                                    "{doctor.doctor.place.name}"</Text>
                                                            </View>

                                                        </View>
                                                    </View>

                                                    <TouchableOpacity style={styles.footer}
                                                                      onPress={() => this.chooseDoctor(doctor.doctor.id)}>
                                                        <Text style={styles.footerText}>ПОДРОБНЕЕ</Text>
                                                    </TouchableOpacity>
                                                    </TouchableOpacity>
                                            )
                                        }
                                    </ScrollView>
                                )
                            )
                    }
                </View>

                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    avoidKeyboard={true}
                    onBackdropPress={() => this._hideModal()}
                    onBackButtonPress = {() => this._hideModal()}
                    isVisible={this.state.visibleModal === true && this.state.modalContent === 'qualification'}
                    style={{flex: 2}}>
                    {this.modalContentQualification()}
                </Modal>

                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    avoidKeyboard={true}
                    onBackdropPress={() => this._hideModal()}
                    onBackButtonPress = {() =>this._hideModal()}
                    isVisible={this.state.visibleModal === true && this.state.modalContent === 'district'}
                    style={{flex: 2}}>
                    {this.modalContentDistrict()}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: scale(55),
        width: '100%',
        paddingTop: (Platform.OS=== 'ios') ? scale(22) : 0,
        alignItems: 'center',
        flexDirection:'row',
    },
    back: {
        marginLeft: scale(18),
    },


    sortHeader: {
        flexDirection: 'column',
        backgroundColor: 'rgb(235, 235, 235)',
    },
    sortHeaderButton: {
        height: scale(44),
        width: '100%',
        flexDirection: 'row'
    },
    firstTxt:{
        fontSize: Medbook.fonts.sizes.p1,
        fontWeight: 'bold',
        marginHorizontal: scale(60),
        textAlign: 'center',
        color: Medbook.colors.text.first,
    },
    sortButton:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderLeftWidth: 1,
        marginVertical: scale(5),
        borderColor: 'rgb(200, 200, 200)',
    },
    sortButtonView: {
        height: '100%',
        width: '60%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    sortText: {
        color: 'rgb(90, 90, 90)',
        fontSize: scale(10),
        fontWeight: '100',
    },
    sortDropdown: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sortDropdownName: {
        fontSize: Medbook.fonts.sizes.p5,
        fontWeight: 'bold',
        color: 'rgb(90, 90, 90)'
    },
    sortImage: {
        height: scale(6),
        width: scale(10),
        marginLeft: scale(5)
    },

    searchName: {
        width: '100%',
        backgroundColor: '#79D0DF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchNameText: {
        fontSize: Medbook.fonts.sizes.p7,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginVertical: scale(7)
    },


    doctorContainer:{
        paddingHorizontal: scale(15),
        paddingVertical: scale(15)
    },
    doctorCard:{
        flexDirection: 'column',
        height: scale(190),
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgb(200, 200, 200)',
        marginBottom: scale(16)
    },
    doctorInfo:{
        height: '84%',
        width: '100%'
    },

    doctorMain:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '55%',
    },

    infoProfile:{
        flexDirection: 'row',
        width:' 33%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    doctorPhoto:{
      width: scale(68),
      height: scale(68),
      borderRadius: scale(34)
    },
    doctorPlace:{
        height: '45%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: scale(15)
    },
    doctorInformation: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    name:{
        color: Medbook.colors.text.first,
        fontSize: scale(14),
        fontWeight: '600',
        textAlign: 'center'
    },
    speciality:{
        color: '#9c9c9c',
        fontSize: scale(11),
        marginLeft: scale(3),
},


    place: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    placeText:{
        color: Medbook.colors.text.first,
        fontSize: scale(11),
        marginTop: scale(3),
        marginLeft: scale(5),
    },
    placeImage: {
        height: scale(12),
        width: scale(18)
    },


    footer:{
        height: '16%',
        width: '100%',
        backgroundColor: Medbook.colors.backgroundTenth,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 3,
        borderBottomLeftRadius: 3
    },
    footerText:{
        fontSize: Medbook.fonts.sizes.p3,
        fontWeight: '500',
        color: 'white'
    },
    modalContentTypes:{
        width: '90%',
        backgroundColor: 'rgb(200, 200, 200)',
        alignSelf: 'center',
    },
    modalContentTypesText:{
        color: 'white',
        fontSize: Medbook.fonts.sizes.p4,
        alignSelf: 'center',
        textAlign: 'center',
        paddingVertical: scale(12),
    },
    typeModal:{
        height: scale(28),
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        color: Medbook.colors.textFourth
    },
    typeModalText:{
        textAlign: 'center',
        width: '100%',
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p5,
    },

    loadingContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingGif:{
        width: scale(150),
        height: scale(150)
    },
    noDoctors: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDoctorsText: {
        fontSize: Medbook.fonts.sizes.p3,
        color: 'rgb(120, 120, 120)',
        textAlign: 'center'
    },
    noDoctorsImage: {
        height: scale(36),
        width: scale(36),
        marginBottom: scale(15)
    }
});