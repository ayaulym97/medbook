import React from "react";
import {Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform} from "react-native";
import {scale} from "../../../config/scale";
import {Medbook} from "../../../config/theme";
import Modal from "react-native-modal";
import Fuse from "fuse.js/";
import _filter from 'lodash/filter';
import PlaceService from "../../../data/services/PlaceService";
import DoctorService from "../../../data/services/DoctorService";
import {resultRequest} from "./resultRequest/resultRequest";

export class createRequest extends React.Component {
    static navigationOptions = ({ navigation}) => ({

        header: null,
        tabBarIcon: ({ focused }) => (
            <Image source={
                focused ?
                    require('../../../assets/icons/home_active.png'):
                    require('../../../assets/icons/home_inactive.png')
            }
                   style={{height:scale(21), width:scale(22)}}
            />
        )
    });

    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            choosePart: true,
            search: '',
            searchNull: false,
            isSearching: false,
            isLoaded: true,
            choosenType: 0,
            choosenCity: {
                id: 0,
                name: '',
            },
            choosenDoctor: {
                id: 0,
                name: '',
            },
            choosenProcedure: {
                id: 0,
                name: '',
            },
            choosenSurvey: {
                id: 0,
                name: ''
            },
            choosenDentist: {
                id: 0,
                name: ''
            },
            choosenDentistProcedure: {
                id: 0,
                name: ''
            },

            atHome: false,
            address: '',
            cities: [],

            specialities: [],
            searchSpecialities: [],
            dentists: [],
            searchDentists: [],

            procedures: [],
            searchProcedures: [],
            procedureDentists: [],
            searchProcedureDentists: [],

            surveys: [],
            searchSurveys: [],

            visibleModal: false,
            modalContent: '',
        };
        this.getSpeciality();
        this.getCities();
        this.getProcedures();
        this.getSurveys();
    }

    getCities(){
        PlaceService.getCities().then((response) =>{
            let cities = [];
            response.map((city) => {
                cities.push({
                    id: city.id,
                    name: city.name,
                    district: city.district,
                });
            });
            this.setState({
                cities: cities,
            });
        });
    }
    getSpeciality(){
        DoctorService.getSpecialities().then((response) => {
            let dentists = _filter(response, (doctor) => doctor.type === 1);
            let doctors = _filter(response, (doctor) => doctor.type === 0);

            this.setState({
                specialities: doctors,
                searchSpecialities: doctors.slice(0, 10),

                dentists: dentists,
                searchDentists: dentists.slice(0, 10),
            });
        })
    }
    getProcedures(){
        DoctorService.getProcedures().then((response) => {
            let dentists = _filter(response, (doctor) => doctor.type === 1);
            let doctors = _filter(response, (doctor) => doctor.type === 0);

            this.setState({
                procedures: doctors,
                searchProcedures: doctors.slice(0, 10),

                procedureDentists: dentists,
                searchProcedureDentists: dentists.slice(0, 10)
            });

            setTimeout(() => {
                this.setState({
                    isLoaded: false
                })
            }, 3000);
        })
    }
    getSurveys(){
        DoctorService.getSurveys().then((response) => {
            this.setState({
                surveys: response,
                searchSurveys: response.slice(0, 10)
            })
        })
    }

    changePart(part){
        this.setState({choosePart: part});
        if (part)
            this.setState({choosenType: 0});
        else
            this.setState({choosenType: 3});

    }

    filterSearch(searchInput, content) {
        let options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["name"]
        };
        let data = this.state.specialities;
        this.state.choosePart ?
            (
                content === 'doctor' ?
                    data = this.state.specialities :
                    (content === 'procedures' ?
                            data = this.state.procedures:
                            data = this.state.surveys
                    )
            ):
            (
                content === 'dentist' ?
                    data = this.state.dentists:
                    data = this.state.procedureDentists
            );
        let fuse = new Fuse(data, options);
        setTimeout(() => {
            if (searchInput.length < 1) {
                if(content === 'doctor'){
                    this.setState({
                        searchSpecialities: this.state.specialities.slice(0, 10)
                    });
                }
                if(content === 'procedures'){
                    this.setState({
                        searchProcedures: this.state.procedures.slice(0, 10)
                    });
                }
                if(content === 'services'){
                    this.setState({
                        searchSurveys: this.state.surveys.slice(0, 10)
                    });
                }
                if(content === 'dentist'){
                    this.setState({
                        searchDentists: this.state.dentists.slice(0, 10)
                    })
                }
                if(content === 'dentistProcedure'){
                    this.setState({
                        searchProcedureDentists: this.state.procedureDentists.slice(0, 10)
                    })
                }
            } else {
                if(content === 'doctor'){
                    this.setState({
                        searchSpecialities: fuse.search(searchInput)
                    });
                }
                if(content === 'procedures'){
                    this.setState({
                        searchProcedures: fuse.search(searchInput)
                    });
                }
                if(content === 'services'){
                    this.setState({
                        searchSurveys: fuse.search(searchInput)
                    });
                }
                if(content === 'dentist'){
                    this.setState({
                        searchDentists: fuse.search(searchInput)
                    })
                }
                if(content === 'dentistProcedure'){
                    this.setState({
                        searchProcedureDentists: fuse.search(searchInput)
                    })
                }
            }
        }, 0);
    }

    setActiveLocation(state){
        this.setState({
            choosenType: state
        })
    }
    setLocation(){
        this.setState({
            atHome: !this.state.atHome
        })
    }
    setModal(content){
        this.setState({
            modalContent: content,
            visibleModal: !this.state.visibleModal
        })
    }
    hideModal(){
        this.setState({
            searchSpecialities: this.state.specialities.slice(0, 10),
            searchDentists: this.state.dentists.slice(0, 10),
            searchProcedures: this.state.procedures.slice(0, 10),
            searchProcedureDentists: this.state.procedureDentists.slice(0, 10),
            searchSurveys: this.state.surveys.slice(0, 10),
            visibleModal: false,
            modalContent: '',
        })
    }

    takeCity(city){
        this.setState({
            choosenCity: {
                id: city.id,
                name: city.name
            }
        })
        this.hideModal();
    }
    takeDoctor(doctor){
        this.setState({
            choosenDoctor: {
                id: doctor.id,
                name: doctor.name
            },
        })
        this.hideModal();
    }
    takeProcedure(procedure){
        this.setState({
            choosenProcedure: {
                id: procedure.id,
                name: procedure.name
            }
        })
        this.hideModal();
    }
    takeSurvey(survey){
        this.setState({
            choosenSurvey: {
                id: survey.id,
                name: survey.name
            }
        })
        this.hideModal();
    }
    takeDentist(doctor){
        this.setState({
            choosenDentist: {
                id: doctor.id,
                name: doctor.name
            },
        })
        this.hideModal();
    }
    takeDentistProcedure(procedure){
        this.setState({
            choosenDentistProcedure: {
                id: procedure.id,
                name: procedure.name
            }
        })
        this.hideModal();
    }

    modalContentCity = () => (
        <View style={styles.modalContentTypes}>
            <View style={{width: '100%', borderRadius: 5, height: scale(50), paddingHorizontal: scale(25), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: 'rgb(220, 220, 220)'}}>
                <Text style={styles.modalContentTypesText}>Выберите город</Text>
                <Image style={{height: scale(7), width: scale(12)}} source={require('../../../assets/icons/caret-down.png')}/>
            </View>
            {
                this.state.cities.map((city, i)=>
                    <TouchableOpacity onPress={()=>this.takeCity(city)} underlayColor={'rgba(0,0,0,9)'} style={styles.typeModal}  key={i}>
                        <Text style={styles.typeModalText}>{city.name}</Text>
                    </TouchableOpacity>
                )}
        </View>
    );
    modalContentSearch = () => (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
            <View style={[styles.modalContentTypes, {height: scale(280), marginBottom: scale(20), borderRadius: 5}]}>
                <View style={{width: '100%', borderRadius: 5, height: scale(50), paddingHorizontal: scale(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: 'rgb(220, 220, 220)'}}>
                    <Image style={styles.modalIcon} source={require('../../../assets/icons/search-green.png')}/>
                    <TextInput
                        style={styles.modalContentInput}
                        maxLength={30}
                        placeholder={
                            this.state.modalContent === 'doctor' ?
                                'Введите специальность врача':
                                (this.state.modalContent === 'procedures' ?
                                        'Введите обследование или процедуру':
                                        'Введите обследование или анализ'
                                )
                        }
                        placeholderTextColor={Medbook.colors.input.placeholderSecond}
                        onChangeText={(text) => this.filterSearch(text, this.state.modalContent)}/>
                </View>
                {
                    this.state.searchNull ?
                        <View style={styles.typeModal}>
                            {
                                this.state.choosenType === 0 ?
                                    <Text style={styles.typeModalText}>Не найдено ни одной специальности</Text>:
                                    (
                                        this.state.choosenType === 1 ?
                                            <Text style={styles.typeModalText}>Не найдено ни одной процедуры</Text>:
                                            <Text style={styles.typeModalText}>Не найдено ни одного анализа</Text>
                                    )
                            }
                        </View>:
                        <ScrollView
                            style={{borderBottomRightRadius: 5, borderBottomLeftRadius: 5}}
                            keyboardShouldPersistTaps='always'>
                            {
                                this.state.choosePart ? (
                                    this.state.choosenType === 0 ?
                                        (
                                            this.state.searchSpecialities.length === 0 ?
                                                <View style={styles.typeModal}>
                                                    <Text style={styles.typeModalText}>Не найдено ни одного доктора</Text>
                                                </View>:
                                                (
                                                    this.state.searchSpecialities.map((doctor, i) =>
                                                        <TouchableOpacity style={styles.typeModal} onPress={() => this.takeDoctor(doctor)}  key={i}>
                                                            <Text style={styles.typeModalText}>{doctor.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                )
                                        )
                                        :
                                        (
                                            this.state.choosenType === 1 ?
                                                (
                                                    this.state.searchProcedures.length === 0 ?
                                                        <View style={styles.typeModal}>
                                                            <Text style={styles.typeModalText}>Не найдено ни одного доктора</Text>
                                                        </View>:
                                                        (
                                                            this.state.searchProcedures.map((procedure, i) =>
                                                                <TouchableOpacity style={styles.typeModal} onPress={() => this.takeProcedure(procedure)}  key={i}>
                                                                    <Text style={styles.typeModalText}>{procedure.name}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        )
                                                ) :
                                                (
                                                    this.state.searchSurveys.length === 0 ?
                                                        <View style={styles.typeModal}>
                                                            <Text style={styles.typeModalText}>Не найдено ни одного доктора</Text>
                                                        </View>:
                                                        (
                                                            this.state.searchSurveys.map((survey, i) =>
                                                                <TouchableOpacity style={styles.typeModal} onPress={() => this.takeSurvey(survey)}  key={i}>
                                                                    <Text style={styles.typeModalText}>{survey.name}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        )
                                                )
                                        )
                                ):(
                                    this.state.choosenType === 3 ?
                                        (
                                            this.state.searchDentists.length === 0 ?
                                                <View style={styles.typeModal}>
                                                    <Text style={styles.typeModalText}>Не найдено ни одного доктора</Text>
                                                </View>:
                                                (
                                                    this.state.searchDentists.map((doctor, i) =>
                                                        <TouchableOpacity style={styles.typeModal} onPress={() => this.takeDentist(doctor)}  key={i}>
                                                            <Text style={styles.typeModalText}>{doctor.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                )
                                        )
                                        :
                                        (
                                            this.state.searchProcedureDentists.length === 0 ?
                                                <View style={styles.typeModal}>
                                                    <Text style={styles.typeModalText}>Не найдено ни одной процедуры</Text>
                                                </View>:
                                                (
                                                    this.state.searchProcedureDentists.map((procedure, i) =>
                                                        <TouchableOpacity style={styles.typeModal} onPress={() => this.takeDentistProcedure(procedure)}  key={i}>
                                                            <Text style={styles.typeModalText}>{procedure.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                )
                                        )
                                )
                            }
                        </ScrollView>
                }
            </View>
        </KeyboardAvoidingView>
    );

    searchDoctor(){
        switch(this.state.choosenType) {
            case 0:
                if (this.state.atHome) {
                    if (this.state.choosenCity.name === '' || this.state.choosenDoctor.name === '' || this.state.address === '') {
                        Alert.alert("Пожалуйста заполните все данные!");
                        return false
                    }
                }
                else {
                    if (this.state.choosenCity.name === '' || this.state.choosenDoctor.name === '') {
                        Alert.alert("Пожалуйста заполните все данные!");
                        return false
                    }
                }
                break;
            case 1:
                if (this.state.choosenCity.name === '' || this.state.choosenProcedure.name === '') {
                    Alert.alert("Пожалуйста заполните все данные!");
                    return false
                }
                break;
            case 2:
                if (this.state.choosenCity.name === '' || this.state.choosenSurvey.name === '') {
                    Alert.alert("Пожалуйста заполните все данные!");
                    return false
                }
                break;
            case 3:
                if (this.state.choosenCity.name === '' || this.state.choosenDentist.name === '') {
                    Alert.alert("Пожалуйста заполните все данные!");
                    return false
                }
                break;
            case 4:
                if (this.state.choosenCity.name === '' || this.state.choosenDentistProcedure.name === '') {
                    Alert.alert("Пожалуйста заполните все данные!");
                    return false
                }
                break;
        }
        this.setState({
            isLoaded: true,
            isSearching: true
        });
        let data = {};

        data["type"] = this.state.choosenType;
        data["status"] = 0;
        data["districts"] = [1, 2, 3, 4, 5, 6, 7, 8];
        data["location_x"] = "-62.91530";
        data["location_y"] = "-12.50813";

        switch(this.state.choosenType) {
            case 0:
                if (this.state.atHome) {
                    data["type"] = 3
                }
                data["specialities"] = [this.state.choosenDoctor.id];
                data["services"] = [];
                break;
            case 1:
                data["specialities"] = [];
                data["services"] = [this.state.choosenProcedure.id];
                break;
            case 2:
                data["specialities"] = [];
                data["services"] = [this.state.choosenSurvey.id];
                break;
            case 3:
                data["specialities"] = [this.state.choosenDentist.id];
                data["services"] = [];
                data["type"] = 4;
                break;
            case 4:
                data["specialities"] = [];
                data["services"] = [this.state.choosenDentistProcedure.id];
                data["type"] = 5;
        }
        DoctorService.createRequest(data).then((response) => {
            // console.log(response, "response create request");
            let name = '';
            switch(this.state.choosenType) {
                case 0:
                    name = this.state.choosenDoctor.name;
                    break;
                case 1:
                    name = this.state.choosenProcedure.name;
                    break;
                case 2:
                    name = this.state.choosenSurvey.name;
                    break;
            };
            this.setState({
                isLoaded: false,
                isSearching: false,
            });
            this.props.navigation.navigate('resultRequest', {
                id: response,
                name: name,
                city: this.state.choosenCity,
            });
        },(error) =>{
            // console.log(error.response, "error response");
        });
    }

    render() {
        return (
            this.state.isLoaded ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0B3356"/>
                    {
                        this.state.isSearching ?
                            <Text style={[styles.noDoctorsText, {marginTop: scale(30)}]}>Ваш запрос обрабатывается...</Text>:
                            <Text style={[styles.noDoctorsText, {marginTop: scale(30)}]}>Страница загружается...</Text>
                    }
                </View>:
                <View style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../../assets/icons/3va_white.png')}/>
                            <Text style={styles.textHeader}>Запись на прием к
                                {
                                    this.state.choosePart ?
                                        <Text style={styles.textHeaderOff}> врачу</Text>:
                                        <Text style={styles.textHeaderOff}> стоматологу</Text>
                                } онлайн</Text>
                        </View>

                        <View style={styles.mainCarcas}>
                            <View style={styles.main}>
                                {
                                    this.state.choosePart ?
                                        <View style={styles.mainHeader}>
                                            <TouchableOpacity onPress={ () => {this.setActiveLocation(0) }} style={this.state.choosenType === 0 ? [styles.chooseItem, styles.isActive] : styles.chooseItem}>
                                                <Text style={this.state.choosenType === 0 ? [styles.chooseItemText, styles.isActiveText] : (styles.chooseItemText)}>Консультация у врача</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={ () => {this.setActiveLocation(1) }} style={this.state.choosenType === 1 ? [styles.chooseItem, styles.isActive] : styles.chooseItem}>
                                                <Text style={this.state.choosenType === 1 ? [styles.chooseItemText, styles.isActiveText] : (styles.chooseItemText)}>Медицинские услуги</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={ () => {this.setActiveLocation(2) }} style={this.state.choosenType === 2 ? [styles.chooseItem, styles.isActive] : styles.chooseItem}>
                                                <Text style={this.state.choosenType === 2 ? [styles.chooseItemText, styles.isActiveText] : styles.chooseItemText}>Обследования и анализы</Text>
                                            </TouchableOpacity>
                                        </View>:

                                        <View style={styles.mainHeader}>
                                            <TouchableOpacity onPress={ () => {this.setActiveLocation(3) }} style={this.state.choosenType === 3 ? [styles.chooseItem, styles.chooseItemTwo, styles.isActive] : [styles.chooseItem, styles.chooseItemTwo]}>
                                                <Text style={this.state.choosenType === 3 ? [styles.chooseItemText, styles.chooseItemTextTwo, styles.isActiveText] : [styles.chooseItemText, styles.chooseItemTextTwo]}>Консультация у врача</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={ () => {this.setActiveLocation(4) }} style={this.state.choosenType === 4 ? [styles.chooseItem, styles.chooseItemTwo, styles.isActive] : [styles.chooseItem, styles.chooseItemTwo]}>
                                                <Text style={this.state.choosenType === 4 ? [styles.chooseItemText, styles.chooseItemTextTwo, styles.isActiveText] : [styles.chooseItemText, styles.chooseItemTextTwo]}>Медицинские услуги</Text>
                                            </TouchableOpacity>
                                        </View>
                                }
                                <View style={styles.mainMain}>
                                    <TouchableOpacity style={styles.inputData} onPress={()=>
                                        this.state.choosePart ?
                                            (
                                                this.state.choosenType === 0 ? this.setModal('doctor') : (
                                                    this.state.choosenType === 1 ? this.setModal('procedures') : this.setModal('services')
                                                )
                                            ):
                                            (
                                                this.state.choosenType === 3 ? this.setModal('dentist') : this.setModal('dentistProcedure')
                                            )
                                    }>
                                        <View style={styles.inputDataButton}>
                                            <Image style={{width:scale(16), height:scale(16)}} source={require('../../../assets/icons/search-green.png')} />
                                            {this.state.choosePart ?
                                                (
                                                    this.state.choosenType === 0 ?
                                                        (this.state.choosenDoctor.id === 0 ?
                                                                <Text style={styles.inputDataText}>Выберите специальность доктора</Text> :
                                                                <Text style={styles.inputDataText}>{this.state.choosenDoctor.name}</Text>
                                                        ) :
                                                        (this.state.choosenType === 1 ?
                                                                (this.state.choosenProcedure.id === 0 ?
                                                                        <Text style={styles.inputDataText}>
                                                                            Выберите название обследования      или процедуры</Text>:
                                                                        <Text style={styles.inputDataText}>{this.state.choosenProcedure.name}</Text>
                                                                )
                                                                :
                                                                (
                                                                    this.state.choosenSurvey.id === 0 ?
                                                                        <Text style={styles.inputDataText}>
                                                                            Выберите вид медицинского анализа или теста</Text>:
                                                                        <Text style={styles.inputDataText}>{this.state.choosenSurvey.name}</Text>
                                                                )
                                                        )
                                                ) :
                                                (
                                                    this.state.choosenType === 3 ?
                                                        (
                                                            this.state.choosenDentist.id === 0 ?
                                                                <Text style={styles.inputDataText}>Введите специальность врача</Text>:
                                                                <Text style={styles.inputDataText}>{this.state.choosenDentist.name}</Text>
                                                        ) :
                                                        (
                                                            this.state.choosenDentistProcedure.id === 0 ?
                                                                <Text style={styles.inputDataText}>Введите название процедуры</Text>:
                                                                <Text style={styles.inputDataText}>{this.state.choosenDentistProcedure.name}</Text>
                                                        )
                                                )
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputData}  onPress={()=> this.setModal('city')}>
                                        <View style={styles.inputDataButton}>
                                            <Image style={{width:scale(16), height:scale(18)}} source={require('../../../assets/icons/placeholder_green.png')} />
                                            {this.state.choosenCity.name === '' ?
                                                <Text style={styles.inputDataText}>Выберите город</Text>:
                                                <Text style={styles.inputDataText}>{this.state.choosenCity.name}</Text>
                                            }
                                        </View>
                                        <Image style={{width:scale(10), height:scale(5.84)}} source={require('../../../assets/icons/caret-down.png')} />
                                    </TouchableOpacity>

                                    { this.state.choosenType === 0 ?
                                        <View style={styles.consultationView}>
                                            <TouchableOpacity style={styles.inputData} onPress={ () => this.setLocation()}>
                                                {this.state.atHome ?
                                                    <View style={styles.inputDataButton}>
                                                        <Image style={{width:scale(16), height:scale(16)}} source={require('../../../assets/icons/home.png')} />
                                                        <Text style={styles.inputDataText}>Дома</Text>
                                                    </View>
                                                    :
                                                    <View style={styles.inputDataButton}>
                                                        <Image style={{width:scale(16), height:scale(14)}} source={require('../../../assets/icons/logo.png')} />
                                                        <Text style={styles.inputDataText}>В клинике</Text>
                                                    </View>
                                                }
                                                <Image style={{width:scale(10), height:scale(12.5)}} source={require('../../../assets/icons/sort-arrows-couple-pointing-up-and-down.png')} />
                                            </TouchableOpacity>
                                            {
                                                this.state.atHome ?
                                                    <View style={[styles.inputData, styles.inputDataStart]}>
                                                        <Image style={{width: scale(16), height: scale(20)}}
                                                               source={require('../../../assets/icons/street.png')}/>
                                                        <TextInput underlineColorAndroid='transparent'
                                                                   style={styles.mainTextInput}
                                                                   placeholder={this.state.address === '' ? 'Введите ваш адрес' : this.state.address}
                                                                   placeholderTextColor={Medbook.colors.textFourth}
                                                                   value = {this.state.address}
                                                                   onChangeText = {(text) => this.setState({address: text})}
                                                        />
                                                    </View> :
                                                    null
                                            }
                                        </View>
                                        :
                                        null
                                    }
                                </View>
                                <View style={styles.mainFooter}>
                                    <TouchableOpacity style={styles.button} onPress={() => this.searchDoctor()}>
                                        <Text style={styles.buttonText}>НАЙТИ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </KeyboardAvoidingView>



                    <View style={styles.bottomNavigator}>
                        <TouchableOpacity style={[styles.bottomNavigatorPart, {borderRightWidth: 1, borderColor: 'rgb(200, 200, 200)'}]} onPress={() => { this.changePart(true)}}>
                            <Text style={this.state.choosePart ? [styles.bottomNavigatorText, styles.bottomNavigatorActiveText] : styles.bottomNavigatorText}>Поликлинники</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bottomNavigatorPart} onPress={() => { this.changePart(false)}}>
                            <Text style={this.state.choosePart ? styles.bottomNavigatorText : [styles.bottomNavigatorText, styles.bottomNavigatorActiveText]}>Стоматология</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationIn={'slideInUp'}
                        animationOut={'slideOutDown'}
                        onBackdropPress={() => this.hideModal()}
                        onBackButtonPress = {() => this.hideModal()}
                        isVisible={this.state.visibleModal === true && this.state.modalContent === 'city'}
                        style={{flex: 2}}>
                        {this.modalContentCity()}
                    </Modal>
                    <Modal
                        animationIn={'slideInUp'}
                        animationOut={'slideOutDown'}
                        onBackdropPress={() => this.hideModal()}
                        onBackButtonPress = {() => this.hideModal()}
                        isVisible={this.state.visibleModal === true && this.state.modalContent !== 'city'}
                        style={{flex: 2}}>
                        {this.modalContentSearch()}
                    </Modal>
                </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#79D0DF',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    tabBarText: {
        textAlign: 'center',
        marginBottom: 18
    },
    activeText: {
        color: Medbook.colors.textSecond,
        fontWeight: '700'
    },
    passiveText: {
        color: Medbook.colors.textFourth,
    },
    icon: {
        width: scale(39),
        height: scale(36),
    },
    logo: {
        height: scale(30.5),
        width: scale(45.1)
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: '15%',
        paddingTop: '12%',
    },
    textHeader: {
        marginVertical: scale(20),
        color: 'white',
        fontSize: Medbook.fonts.sizes.h2,
        fontWeight: '600',
        textAlign: 'center'
    },
    textHeaderOff: {
        color: Medbook.colors.textSecond,
    },
    mainCarcas: {
        height: '54%',
        width: '100%',
        alignItems: 'center',
    },
    main: {
        width: scale(290),
    },
    mainHeader: {
        height: scale(43),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chooseItem: {
        height: scale(43),
        width: '32%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        backgroundColor: 'rgb(220, 220, 220)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(5),
    },
    chooseItemTwo: {
        width: '49%',
    },
    chooseItemText: {
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p7,
        textAlign: 'center',
    },
    chooseItemTextTwo: {
        fontSize: Medbook.fonts.sizes.p4,
    },
    isActiveText: {
        color: Medbook.colors.textSecond,
        fontWeight: '500',
    },
    isActive: {
        backgroundColor: 'rgb(240, 240, 240)',
    },
    mainMain: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(240, 240, 240)',
    },
    inputData: {
        marginTop: scale(7),
        paddingHorizontal: scale(10),
        height: scale(42),
        width: '94%',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    inputDataStart: {
        justifyContent: 'flex-start',
    },
    inputDataText: {
        marginLeft: scale(12),
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p4,
        // paddingRight: scale(10),
    },
    inputDataButton: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    consultationView: {
        height: 'auto',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainTextInput: {
        height: '100%',
        width: '90%',
        marginLeft: scale(12),
        fontSize: Medbook.fonts.sizes.p4
    },

    mainFooter: {
        backgroundColor: 'rgb(240, 240, 240)',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    button: {
        height: scale(35),
        width: '60%',
        backgroundColor: Medbook.colors.backgroundThird,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: scale(14),
    },
    buttonText: {
        fontSize: Medbook.fonts.sizes.p2,
        fontWeight: '700',
        color: 'white',
    },
    modalContentTypes: {
        width: '95%',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    modalContentTypesText:{
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p3,
        fontWeight: '500',
        textAlign: 'left',
    },
    modalContentInput: {
        width: '90%',
        height: '100%',
        fontSize: Medbook.fonts.sizes.p3,
        fontWeight: '500',
    },
    modalIcon: {
        height: scale(18),
        width: scale(18)
    },
    typeModal:{
        height: scale(45),
        width: '100%',
        backgroundColor: 'rgb(245, 245, 245)',
        borderBottomWidth: 1.5,
        borderColor: 'rgb(220, 220, 220)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeModalText:{
        textAlign: 'left',
        paddingLeft: scale(25),
        width: '100%',
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p7,
    },

    bottomNavigator: {
        height: 50,
        width: '100%',
        backgroundColor: 'rgb(230, 230, 230)',
        flexDirection: 'row',
        paddingVertical: scale(5),
    },
    bottomNavigatorPart: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNavigatorText: {
        color: Medbook.colors.textFourth,
        fontSize: Medbook.fonts.sizes.p4,
    },
    bottomNavigatorActiveText: {
        fontWeight: '600',
        color: Medbook.colors.textSecond
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
    },
});