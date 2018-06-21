import React from 'react';
import {ActivityIndicator,StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ListView, ImageBackground, FlatList,Platform, ScrollView} from 'react-native';
import {Medbook} from '../../../config/theme';
import {scale} from '../../../config/scale';
import Fuse from "fuse.js/";
import {RequestService} from "../../../data/services/RequestService";
import HTTPClient from "../../../data/HTTPClient";
const isIOS = Platform.OS === 'ios';

export class SearchDoctor extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        tabBarIcon: ({focused}) => (
            <Image
                style={{height: scale(21), width: scale(21)}}
                source={
                focused ?
                    require('../../../assets/icons/doctors_inactive.png') :
                    require('../../../assets/icons/search_doctor.png')
            }
            />
        ),
    });

    constructor(props) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            text: '',
            isLoaded: false,
            loading: false,

            dataSource: ds.cloneWithRows([]),
            listSpeciality: [],
            listDoctors: [],
            page:1,
            updatedListSpeciality: {},
            doctorId: '',
        };
        this.getlistSpec();
    }

    async getlistSpec() {
        let listSpec = this.state.dataSource;
        await RequestService.getListSpec().then((response) => {
                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                this.setState({
                    dataSource: ds.cloneWithRows(response),
                    listSpeciality: response
                });
                listSpec = response;
                response.map((item) => {
                    let list = this.state.updatedListSpeciality;
                    list[item.id] = {
                        page: this.state.page,
                        listDoctors: this.state.listDoctors
                    };
                    this.setState({
                        updatedListSpeciality: list
                    });
                    this.getDoctors(item.id);
                });

                setTimeout(() => {
                    this.setState({
                        dataSource: ds.cloneWithRows(listSpec),
                        isLoaded: true,
                    })
                }, 10000);
            },
            (error) => {
                // console.log(error.response);
            });
    }

    getDoctors(id) {
        // console.log('lalal')
        let listNew = this.state.updatedListSpeciality;

        let data = {};
        data['page'] = listNew[id].page;
        data['speciality'] = id;

        RequestService.getDoctorsBySpec(data).then((response_doctors) => {
              if (listNew[id].page === 1) {
                    this.setState({
                        listDoctors: response_doctors
                    });

                    listNew[id].page = this.state.page;
                    listNew[id].listDoctors = this.state.listDoctors;

                    this.setState({
                        updatedListSpeciality: listNew,
                    });
                } else {
                    setTimeout(() => {
                        this.setState({
                            listDoctors: [...listNew[id].listDoctors, ...response_doctors],
                            loading: false
                        });

                        listNew[id].page = this.state.page;
                        listNew[id].listDoctors = this.state.listDoctors;

                        this.setState({
                            updatedListSpeciality: listNew,
                        });
                        // console.log(this.state.listDoctors)

                    }, 1000)
                }
        })

    }

    handleEnd(id) {
        let listNew = this.state.updatedListSpeciality;
        this.setState(
            ({page: listNew[id].page + 1}),
            () => this.getDoctors(id));
    };

    filterSearch(searchInput) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        let data =this.state.dataSource._dataBlob.s1;
        let options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["name"]
        };
        let fuse = new Fuse(data, options);

        setTimeout(() => {
            if (searchInput.length < 1 || fuse.search(searchInput).length<1) {
                    this.setState({
                        dataSource:  ds.cloneWithRows(this.state.listSpeciality),
                    });
            } else {
                    this.setState({
                        dataSource: ds.cloneWithRows(fuse.search(searchInput)),
                    });
            }
        }, 0);

    }

    chooseDoctor(id) {
        this.state.doctorId = id;
        this.props.navigation.navigate("doctorProfile", {
            doctorId: this.state.doctorId
        })
    }

    getDoctorLists(spec) {
        let list = this.state.updatedListSpeciality;
        if (list[spec.id].length === 0) {
            return (
                <Text>нет докторов</Text>
            )
        } else {
            return (
                <FlatList
                    horizontal={true}
                    data={list[spec.id].listDoctors}
                    keyExtractor={(x, i) => i}
                    onEndReachedThreshold={isIOS ? 0 : 2  }
                    onEndReached={() => this.handleEnd(spec.id)}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={() =>
                        list[spec.id].listDoctors.length < 5 || list[spec.id].listDoctors.length===0 ?
                            null :
                            (this.state.loading ? null
                                :
                                <View style={[styles.loadingContainer, {marginHorizontal:scale(30), marginVertical:scale(50)}]}>
                                    <ActivityIndicator size="large" color="#0B3356"/>
                                </View>)
                    }
                    renderItem={(item) =>
                                <TouchableOpacity style={styles.doctorBlockHorizontal}  onPress={() => this.chooseDoctor(item.item.id)}>
                                    <View style={styles.infoBlockHorizontal}>
                                        <Image style={styles.doctorAva} source={{uri: HTTPClient.MEDIA_URL + item.item.avatar}}/>
                                    </View>
                                    <Text style={styles.doctorName}>{item.item.full_name}</Text>
                                    {item.item.speciality.length > 6 ?
                                        <ScrollView style={{flex: 1}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: scale(5)}}>
                                            <Text style={styles.specialization}>
                                                {item.item.speciality.map((speciality, i) =>
                                                    i > 0 ?
                                                        <Text key={i}>, {speciality.name}</Text> :
                                                        <Text key={i}>{speciality.name}</Text>
                                                )}
                                            </Text>
                                        </View></ScrollView> :
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginHorizontal: scale(5),
                                            height: scale(20)
                                        }}>
                                            <Text style={styles.specialization}>
                                                {item.item.speciality.map((speciality, i) =>
                                                    i > 0 ?
                                                        <Text key={i}>, {speciality.name}</Text> :
                                                        <Text key={i}>{speciality.name}</Text>
                                                )}
                                            </Text>
                                        </View>
                                    }
                                    <View style={styles.infoBlock}>
                                        <Image style={styles.doctorIcon} source={require('../../../assets/icons/hospital-buildings.png')}/>
                                        <Text style={[styles.hospitalTxt,]}>{item.item.place.name}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.btnView}
                                                      onPress={() => this.chooseDoctor(item.item.id)}
                                    >
                                        <Text style={styles.btn}>ПОДРОБНЕЕ</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                    }
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.background} source={require('../../../assets/icons/bg_image.png')}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>ЧУВСТВУЕТЕ СЕБЯ <Text
                            style={styles.badText}>ПЛОХО</Text> ?</Text>
                        <Text style={styles.subText}>Найдите себе врача</Text>
                        <View style={styles.textInputView}>
                            <TextInput underlineColorAndroid='transparent'
                                style={styles.txtInput}
                                maxLength={20}
                                placeholder='Введите специальность врача'
                                placeholderTextColor={Medbook.colors.input.placeholderSecond}
                                onChangeText={(text) => this.filterSearch(text)}
                            />
                            <TouchableOpacity style={styles.search}>
                                <Image source={require('../../../assets/icons/search.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.mainBlock}>
                        <View style={styles.subBlock}>
                            <Text style={styles.listOfDoctorsTxt}>Список докторов</Text>
                        </View>
                        <View>
                            {(!this.state.isLoaded) ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#0B3356"/>
                                </View>
                            ) : (
                                <ListView
                                    style={{marginBottom:scale(35)}}
                                    enableEmptySections={true}
                                    dataSource={this.state.dataSource}
                                    removeClippedSubviews={false}
                                    renderRow={(rowData) =>
                                                <View>
                                                    <Text style={styles.nameOfSpecialist}> {rowData.name}
                                                        <Text>({rowData.count})</Text></Text>
                                                    <View>{this.getDoctorLists(rowData)}</View>
                                                </View>
                                    }
                                />
                            )}
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: null,
        height: null,
    },
    header: {
        flexDirection: "column",
        marginTop: scale(60),
        marginHorizontal: scale(10)
    },
    headerText: {
        backgroundColor: 'transparent',
        fontSize: Medbook.fonts.sizes.h3,
        fontWeight: 'bold',
        color: 'white'

    },
    badText: {
        backgroundColor: 'transparent',
        fontSize: Medbook.fonts.sizes.h3,
        fontWeight: 'bold',
        color: Medbook.colors.screen.choose

    }, subText: {
        backgroundColor: 'transparent',
        fontSize: Medbook.fonts.sizes.p1,

        color: 'white',
        marginTop: 7

    },
    textInputView: {
        flexDirection: 'row',
        marginTop: scale(20),
        borderRadius: 3,
        borderColor: 'transparent'
    },
    txtInput: {
        flex: 1,
        height: scale(47),
        paddingLeft: scale(10),
        fontSize: Medbook.fonts.sizes.p1,
        backgroundColor: 'white',
        borderWidth: 0
    },
    search: {
        height: scale(47),
        width: scale(47),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Medbook.colors.backgroundThird,
    },
    mainBlock: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: scale(26),
    },
    subBlock: {
        flexDirection: 'row',
        paddingVertical: scale(6),
        paddingHorizontal: scale(12),
        justifyContent: 'space-between'
    },
    listOfDoctorsTxt: {
        fontSize: Medbook.fonts.sizes.p2,
        fontWeight: 'bold',
        color: Medbook.colors.text.seven,
    },
    nameOfSpecialist: {
        fontSize: Medbook.fonts.sizes.p5,
        fontWeight: 'bold',
        color: Medbook.colors.text.fifth,
        paddingLeft: scale(10),
        marginBottom: scale(5),
        marginTop: scale(5)
    },
    doctorBlockHorizontal: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: scale(220),
        height: scale(210),
        marginHorizontal: scale(5),
        marginBottom:scale(10),
        borderColor: Medbook.colors.border.base,
        borderWidth: 1,
        borderRadius: scale(7),
        shadowColor: Medbook.colors.shadow.base,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    infoBlock: {
        flexDirection: 'row',
        marginTop: scale(10),
        marginHorizontal: scale(10),
        paddingHorizontal: scale(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoBlockHorizontal: {
        flexDirection: 'row',
        marginTop: scale(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    doctorIcon: {
        marginHorizontal: scale(5),
        width: scale(20),
        height: scale(16),
    },
    doctorName: {
        marginHorizontal: scale(20),
        textAlign: 'center',
        fontSize: Medbook.fonts.sizes.p4,
        color: Medbook.colors.text.first,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: Medbook.fonts.sizes.p6,
        color: Medbook.colors.text.fifth,
        marginTop: 5,
        textAlign: 'center',
        justifyContent: 'center',

    },
    hospitalTxt: {
        fontSize: Medbook.fonts.sizes.p5,
        color: Medbook.colors.text.first,
        textAlign: 'center',
        justifyContent: 'center'
    },
    btn: {
        color: 'white',
        fontSize: Medbook.fonts.sizes.p5,

    },
    btnView: {
        height: scale(28),
        backgroundColor: Medbook.colors.backgroundTenth,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: scale(7),
        borderBottomLeftRadius: scale(7),

    }, doctorAva: {
        height: scale(70),
        width: scale(70),
        borderRadius: scale(35),

    },
    f: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingGif: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: scale(100),
        height: scale(100)
    },
    loadingContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    },
});

