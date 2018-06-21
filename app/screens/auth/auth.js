import React from 'react';
import {Medbook} from '../../config/theme';
import {StyleSheet, AsyncStorage,View, Image, Modal, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {scale} from '../../config/scale';
import { CheckBox } from 'react-native-elements'
import {TextInputMask} from "react-native-masked-text";
import AuthService from "../../data/services/AuthService";
import {NavigationActions} from 'react-navigation';


export class Authorization extends  React.Component{
    constructor(props){
        super(props);
        this.state={
            phone: "",
            modalVisible: false,
            checked: false,
            text: "",
            name: "",
            surname: "",
        };
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    press = () => {
        this.setState ({
            checked: !this.state.checked,
        });
    };

    submit(){
        if (this.state.name === "" || this.state.surname === "" || this.state.phone === "") {
            Alert.alert("Пожалуйста заполните все данные!");
            return false;
        }
        if (this.state.checked === false) {
            Alert.alert("Вы не согласны с условиями и правилами!");
            return false;
        }
        let resetActionLogIn = NavigationActions.reset({
            index: 0,
            key:null,
            actions: [
                NavigationActions.navigate({routeName: 'Home'})
            ]
        });
        let phone = "+7" + this.state.phone.replace(/[-()]/g, "");
        AuthService.login({username: phone, full_name: this.state.surname +' ' + this.state.name}).then((response)=>{
            AsyncStorage.setItem('@user', JSON.stringify(response));
            this.props.navigation.dispatch(resetActionLogIn)
        },(error)=>{
            // console.log(error.response, "ERROR");
        });
    }
    render(){
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps='always'
                keyboardDismissMode='interactive'
                extraScrollHeight={80}
                extraHeight={20}
                 enableOnAndroid={true}
                >

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <View style={styles.container} >
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => {
                                this.setModalVisible(!this.state.modalVisible)}}>
                                <Image style={styles.back}
                                       source={require('../../assets/icons/back.png')}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBlock}>
                            <Text style={styles.secondTxt}>УСЛОВИЯ И ПРАВИЛА</Text>
                            <View style={[styles.txtInput, styles.modalScroll]}>
                                <ScrollView >
                                    <Text style={{textAlign:'center'}}>Пользовательское соглашение сервисов ТОО «Медбук.кз»</Text>
                                    <Text style={styles.modalTxt}>
                                            ТОО «Медбук.кз» (далее — «Medbook») заключает настоящее Пользовательское соглашение
                                        с Пользователем сети Интернет (далее — «Пользователь») — использующим  сервисы
                                        интернет-сайт medbook.kz (далее – Сайт) и прикладное программное приложение MedBook.
                                    </Text>
                                    <Text>1. Общие положения</Text>
                                    <Text style={styles.modalTxt}>
                                        1.1Пользователям предоставляется доступ к широкому спектру сервисов,включая поиск нужной информации, просмотр, инструменты ведения  медицинской документациимедицинских учреждений, получения удаленных консультаций медицинского персонала, иные сервисы,только после безоговорочно принятие всех существующих на момент выражения Пользователем согласияс условиями Соглашения сервисы,а также любое развитие их и/или добавление новых является предметом настоящего Соглашения.
                                        1.2 Настоящее Соглашение является публичной офертой (предложением) адресованное определённому лицу, ограниченному или неограниченному кругу лиц и содержащей предложение «Medbook» о заключении с каждым Пользователем соглашения, содержащей существенные условия об использовании своих сервисов.
                                        1.3 «Medbook» на бесплатной основе дает Пользователю право пользования своими сервисами, за исключением некоторых Дополнительных сервисов. Только после активизации Пользователем Дополнительных сервисов, сервисы считаются представленными.
                                        1.4 Любое использование Сайта Пользователем при отсутствии заключенного между Сторонами соглашения является незаконным, Администрация не несет ответственности за последствия такого использования сервисов «Medbook». Новая редакция Соглашения вступает в силу с момента ее размещения администратором «Medbook»  в сети Интернет без уведомления Пользователя.
                                        1.5 Пользователь пройдя процедуру регистрации на каком-либо сервисе «Medbook» автоматически считается принявшим условия Соглашения в полном объеме без исключения, в случае несогласии с условиями настоящего Соглашения Пользователь обязан немедленно прекратить использование Сайта.
                                        1.6 Акцептом настоящей оферты являются любые действия Пользователя по использованию Сайта.
                                    </Text>
                                    <Text>2. Предмет соглашения</Text>
                                    <Text style={styles.modalTxt}>
                                        2.1 По настоящему Соглашению «Medbook» дает право на использование Сайта на безвозмездной основе за исключением условий оговоренных в пункте 1.3. настоящего Соглашения.  Сайт включает контент, элементы дизайна, текст, графические изображения, иллюстрации, видео, программы для ЭВМ, базы данных, музыка, звуки и другие объекты.
                                        2.2 Пользователь имеет право использовать Сайт в личных целях, не связанных с коммерческой деятельностью, для осуществления поиска поиска специалистов и организации записи на прием к конкретному специалисту либо в конкретную медицинскую организацию.
                                        2.3 В случае если  Пользователь захочет использовать Сайт в коммерческих целях(то есть для размещения информации о платных медицинских услугах, предоставляемых Пользователем, и для обеспечения получения заявок других Пользователей на оказание таких услуг в целях извлечения прибыли)Пользователь обязан сообщить «Medbook» о своих намерениях направив на официальный адрес «Medbook» запрос, после чего между Пользователем и «Medbook» будет заключен договор на стандартном условиями предоставляемые «Medbook».
                                        2.4 Администрация не является медицинской организацией либо представителем медицинской организации, не оказывает какие-либо медицинские услуги
                                    </Text>
                                    <Text>3. Сведения, размещаемые на сайте</Text>

                                    <Text style={styles.modalTxt}>
                                        3.1 Сайт предназначен для поиска врачей требуемой специализации, квалификации, опыта работы, либо медицинских услуг (анализы, диагностика) с возможностью выбора в реальном времени медицинской услуги  по наиболее удобному местоположению, дате и времени.
                                        3.2 Персональная информация о медицинской организации и о врачах,  размещаемая на Сайте, получается «Medbook»  непосредственно от медицинских организаций либо самих врачей в соответствии с пунктом 2 статьи 145 ГК РК.
                                        3.3 Пользователи которые воспользовались услугами врачей соответствующих медицинских организаций размещенных на сайте «Medbook» оставляют за собой право оставить комментарий, при этом «Medbook» гарантирует, что все полученные комментарии исключительно от Пользователей.
                                        3.4 «Medbook» вправе удалить комментарий по требованиям компетентных государственных органов, предъявленных в порядке, установленном законом.  «Medbook»  не несет ответственность за достоверность информации, содержащейся в комментариях Пользователей. «Medbook»  удаляет комментарии по требованию медицинских учреждений, врачей либо Пользователей только в случае предоставления доказательств их явной недостоверности либо противоречия законодательству. «Medbook»  вправе в любое время удалить любые комментарии и любую иную информацию с Сайта по собственной инициативе.
                                        3.5 Рейтинг медицинского персонала размещенный на сервисах «Medbook»  проводится по пятибалльной шкале, который формируется на оснований отзывов Пользователей. Формула расчета рейтинга не разглашается «Medbook».
                                        3.6 Медицинские организации несут ответственность за информация о медицинских услугах, специализации врачей, болезнях, методах диагностики и способах лечения размещенную на сервисах «Medbook» в соответствии с Законом РК.
                                    </Text>
                                    <Text>4. Лицензия</Text>
                                    <Text style={styles.modalTxt}>
                                        4.1 Использование сервисов «Medbook» не дает право Пользователю на копирование программного кода сервиса «Medbook» и иных его компонентов.  «Medbook» принадлежат исключительные права на все сервисы «Medbook», в том числе исключительные права на любые входящие в его состав результаты интеллектуальной деятельности, включая программный код.
                                        4.2 Пользователь не имеет право использовать размещенные на Сайте результаты интеллектуальной деятельности (в том числе, но не ограничиваясь: изображения, тексты, программный код) без письменного согласия Администрации.
                                        4.3 Пользователь не вправе требовать внесения каких-либо изменений в сервисы либо данные Сайта. «Medbook» не несет ответственности за коммерческую пригодность Сайта, не гарантирует соответствие Сайта специальным требованиям Пользователей или возможность настройки разделов Сайта в соответствии с предпочтениями Пользователя, а также не гарантирует, что программное обеспечение Сайта полностью свободно от дефектов и ошибок, и должно функционировать бесперебойно и в обязательном порядке.
                                        4.4 Использование Сайта осуществляется Пользователем исключительно под свою ответственность. Администрация не гарантирует должного функционирования Сайта и не несет ответственности за вред, причиненный Пользователю в результате использования Сайта. «Medbook» не несет ответственности за риск наступления неблагоприятных последствий, которые наступят или могут наступить вследствие несоответствия используемого Пользователями оборудования, иного программного обеспечения или каналов связи установленным требованиям по защите персональных данных от несанкционированного (противоправного) посягательства третьих лиц.
                                        4.5 «Medbook» прилагает все разумные усилия, предотвращающие сбои и неполадки в работе сервисов, однако не гарантирует его бесперебойную работу, не несет ответственности за нее и не обязуется уведомлять Пользователей о перебоях.
                                        4.6 Пользователь не вправе использовать сервисы «Medbook» для рассылки сообщений рекламного характера и иных действий, не связанных непосредственно с использованием «Medbook». Пользователь не вправе использовать программный код сервисов «Medbook», какой-либо контент сервисов «Medbook» (включая, но не ограничиваясь: базы данных, текст, элементы дизайна, графические изображения) без предварительного письменного согласия «Medbook» (в том числе воспроизводить, копировать, перерабатывать, распространять в любом виде).
                                    </Text>
                                    <Text>5. Конфиденциальная информация</Text>
                                    <Text style={styles.modalTxt}>
                                        4.1 Использование сервисов «Medbook» не дает право Пользователю на копирование программного кода сервиса «Medbook» и иных его компонентов.  «Medbook» принадлежат исключительные права на все сервисы «Medbook», в том числе исключительные права на любые входящие в его состав результаты интеллектуальной деятельности, включая программный код.
                                        4.2 Пользователь не имеет право использовать размещенные на Сайте результаты интеллектуальной деятельности (в том числе, но не ограничиваясь: изображения, тексты, программный код) без письменного согласия Администрации.
                                        4.3 Пользователь не вправе требовать внесения каких-либо изменений в сервисы либо данные Сайта. «Medbook» не несет ответственности за коммерческую пригодность Сайта, не гарантирует соответствие Сайта специальным требованиям Пользователей или возможность настройки разделов Сайта в соответствии с предпочтениями Пользователя, а также не гарантирует, что программное обеспечение Сайта полностью свободно от дефектов и ошибок, и должно функционировать бесперебойно и в обязательном порядке.
                                        4.4 Использование Сайта осуществляется Пользователем исключительно под свою ответственность. Администрация не гарантирует должного функционирования Сайта и не несет ответственности за вред, причиненный Пользователю в результате использования Сайта. «Medbook» не несет ответственности за риск наступления неблагоприятных последствий, которые наступят или могут наступить вследствие несоответствия используемого Пользователями оборудования, иного программного обеспечения или каналов связи установленным требованиям по защите персональных данных от несанкционированного (противоправного) посягательства третьих лиц.
                                        4.5 «Medbook» прилагает все разумные усилия, предотвращающие сбои и неполадки в работе сервисов, однако не гарантирует его бесперебойную работу, не несет ответственности за нее и не обязуется уведомлять Пользователей о перебоях.
                                        4.6 Пользователь не вправе использовать сервисы «Medbook» для рассылки сообщений рекламного характера и иных действий, не связанных непосредственно с использованием «Medbook». Пользователь не вправе использовать программный код сервисов «Medbook», какой-либо контент сервисов «Medbook» (включая, но не ограничиваясь: базы данных, текст, элементы дизайна, графические изображения) без предварительного письменного согласия «Medbook» (в том числе воспроизводить, копировать, перерабатывать, распространять в любом виде).
                                    </Text>
                                    <Text>6. Ограничение ответственности</Text>
                                    <Text style={styles.modalTxt}>
                                        6.1 В связи с тем, что Администрация не предоставляет Пользователю Сайта «Medbook»,  никаких платных услуг, на отношения между Администрацией и Пользователей не распространяется законодательство о защите прав потребителей опираясь на Закон Республики Казахстан от 4 мая 2010 года № 274-IV «О защите прав потребителей»
                                        6.2 В случае возникновения претензий к качеству оказываемых медицинских услуг медицинских организаций зарегистрированных на сервисах «Medbook», «Medbook» в праве утверждать свою не причастность.
                                        6.3 Пользователь самостоятельно несет ответственность в случае использование персональных данных, размещенных на Сайте, в медицинских или не медицинских целях.
                                    </Text>
                                    <Text>7. Электронное взаимодействие</Text>
                                    <Text style={styles.modalTxt}>
                                        7.1 «Medbook» предоставляет медицинским организациям возможность использовать специальное прикладное  программное обеспечение «Medbook» отдельное от  Сайта, в котором расположен личный кабинет Диспетчера и Руководителя медицинской организации. После прохождения процедуры регистрации и присвоения уникального идентификатора (логина) и пароля Руководителя, Диспетчер проходит идентификацию и получает доступ к персональным данным Пользователя, подтверждая заявки Пользователей в сервисах «Medbook», а также модерирующий сведения о медицинской организации, персональных данных медицинского персонала, стоимости медицинских услуг.
                                        7.2 Руководитель медицинской организации, осуществляющий контроль за внесением и редактированием информации о медицинской организации, за закреплением полномочий диспетчеров внутри сервисов «Medbook».

                                    </Text>
                                    <Text>8. Заключительные положения</Text>
                                    <Text style={styles.modalTxt}>
                                        8.1 Настоящее Соглашение действует в течение всего периода использования Сайта Пользователем.
                                        8.2 «Medbook» вправе в любое время изменять условия настоящего Соглашения, публикуя новую редакцию на Сайте, которая становится обязательной для Пользователя с момента опубликования. Пользователь обязуется регулярно просматривать опубликованный на Сайте текст Соглашения с целью ознакомления с изменениями.
                                    </Text>
                                </ScrollView>
                            </View>


                        </View>
                    </View>
                </Modal>

                <View style={styles.header}>
                    <Image style={styles.logo} source={require('../../assets/icons/3va.png')}/>
                    <Text style={styles.firstTxt}>АВТОРИЗАЦИЯ</Text>
                </View>

                <View style={styles.mainBlock}>
                    <View style={styles.mainBlockRow}>
                        <Text style={styles.thirdTxt}>НОМЕР ТЕЛЕФОНА</Text>
                        <View style={styles.viewInside}>
                            <View style={[styles.txtInput, styles.num]}>
                                <Text style={styles.txtInputStyle}>+7</Text>
                            </View>
                            <TextInputMask
                                underlineColorAndroid='transparent'
                                type={'custom'}
                                keyboardType={'numeric'}
                                maxLength={15}
                                style={[styles.txtInput, styles.txtInputStyle, styles.phoneTxtInput,{paddingLeft: scale(15)}]}
                                value={this.state.phone}
                                onChangeText={(text) => this.setState({phone: text})}
                                options={{mask: '(999)-999-99-99'}}
                                placeholder="(_ _ _)  _ _ _  _ _  _ _" />
                        </View>
                    </View>

                    <View style={styles.mainBlockRow}>
                        <Text style={styles.thirdTxt}>ИМЯ</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            maxLength={15}
                            style={[styles.txtInput, styles.txtInputStyle, {paddingLeft: scale(15)}]}
                            placeholder='Введите ваше имя'
                            onChangeText={(text) => this.setState({name:text})}
                            value={this.state.name}
                        />
                    </View>

                    <View style={styles.mainBlockRow}>
                        <Text style={styles.thirdTxt}>ФАМИЛИЯ</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            maxLength={15}
                            style={[styles.txtInput, styles.txtInputStyle, {paddingLeft: scale(15)}]}
                            placeholder='Введите вашу фамилию'
                            onChangeText={(text) => this.setState({surname:text})}
                        />
                    </View>
                </View>

                <View style={styles.checkbox}>
                    <CheckBox
                        onPress={this.press}
                        checked={this.state.checked}
                        containerStyle={styles.checkBoxs}
                        checkedColor= {'rgb(0, 201, 182)'}
                    />
                    <TouchableOpacity style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.setModalVisible(true)}}>
                        <Text style={styles.checkboxTxt}>СОГЛАСЕН С</Text><Text style={[styles.checkboxTxt, styles.checkboxTxtUnderline]}> УСЛOВИЯМИ И ПРАВИЛАМИ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: '20%'}}>
                    <TouchableOpacity style={styles.btn} onPress={() =>{ this.submit()}}>
                        <Text style={styles.btnTxt}>ПОДТВЕРДИТЬ</Text>
                    </TouchableOpacity>
                </View>


            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white'
    },
    modalHeader:{
        flexDirection: 'column',
        paddingTop: scale(40),
    },
    header:{
        height: '20%',
        flexDirection:'column',
        marginTop:scale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    back:{
        marginLeft: scale(18),
    },
    logo: {
        height: scale(22.5),
        width: scale(37.1)
    },
    mainBlock:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '10%',
        paddingTop: scale(30),
        backgroundColor: 'white',
    },
    modalBlock:{
        flexDirection: 'column',
        marginTop: scale(30),
        marginHorizontal: scale(40),
    },
    txtInputStyle: {
        fontSize: Medbook.fonts.sizes.p0,
        color: Medbook.colors.text.first,
        fontWeight:'300',
    },
    firstTxt:{
        fontSize: Medbook.fonts.sizes.p0,
        fontWeight: 'bold',
        paddingTop: scale(15),
        color: Medbook.colors.textFourth,
        textAlign: 'center'
    },
    secondTxt:{
        fontSize: Medbook.fonts.sizes.p1,
        paddingTop: scale(15),
        fontWeight: 'bold',
        color: Medbook.colors.textFourth,
        textAlign: 'center',
    },
    mainBlockRow: {
        marginTop: scale(12),

    },
    thirdTxt: {
        fontSize: Medbook.fonts.sizes.p7,
        fontWeight: 'bold',
        color: Medbook.colors.textFourth,
        marginBottom: scale(5)
    },
    viewInside:{
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    unchecked:{
        width: scale(20),
        height: scale(20),
        borderWidth: 1,
        borderColor: 'red',
    },
    btn:{
        height: scale(50),
        marginHorizontal: scale(40),
       // marginTop: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(30),
        backgroundColor: Medbook.colors.backgroundThird,
    },
    btnTxt:{
        color:'white',
        fontSize: Medbook.fonts.sizes.p2,
        fontWeight: '500'
    },
    checkbox:{
        marginVertical: scale(10),
        flexDirection:'row'
    },
    checkboxTxt:{
        fontWeight: '700',
        fontSize: Medbook.fonts.sizes.p6,
        color: Medbook.colors.textFourth,
    },
    checkboxTxtUnderline:{
        color: Medbook.colors.textSecond,
        textDecorationLine:'underline'
    },
    modalScroll:{
        height: '82%',
        marginTop: scale(10),
    },
    modalTxt:{
        fontSize: Medbook.fonts.sizes.p4,
        fontWeight: '100',
        margin: scale(10),
        color: Medbook.colors.textFourth,
    },
    phoneTxtInput: {
        width: '75%',
        fontSize: Medbook.fonts.sizes.p0
    },
    txtInput: {
        height: scale(48),
        borderRadius: 3,
        borderColor: Medbook.colors.border.txtInput,
        borderWidth: 1,
        shadowColor: Medbook.colors.shadow.base,
        shadowOpacity: 0.9,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    num:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
    },
    checkBoxs:{
        marginLeft: scale(35),
        width: scale(45),
        backgroundColor: 'white',
        borderColor: 'white',
    }
});
