import {scale} from './scale'

const Colors = {
    //for text
    secondTextColor: '#0B3356',

    fourthTextColor: '#5A5A5A',
    fifthTextColor:'#F26C50',

    //for background
    firstBackgroundColor:  '#8ADFCC',
    thirdBackgroundColor: '#F26C50',

    sixthBackgroundColor: '#7D838C',
    seventhBackgroundColor:'#E27359',
    eighthBackgroundColor:'#FFF67C',
    ninthBackgroundColor:'#A1E3EE',
    tenthBackground:'#316F8C',
    //unused colors
    secondaryForeground: '#91959E',
    thirdBackground: '#5B5E91',
    fourthBackground: '#808080',

    sixBackground: '#D0CECE',
    border: '#aaaaaa',
    bordersecond: '#cecdd2',
    chooseColor: '#EEC822',
    firstMedbookColor: '#4C576A',

    placeholderTextSecond: '#B5B5BC',
    shadow: '#CDCDCD',
    textFourth: '#4682B4',
    textFifth: '#7C838D',
    textSix: '#CCCAD0',
    textSeven: '#A9ACB3',

};

const Fonts = {
    light: 'Comfortaa-Light',
    regular: 'Comfortaa-Regular',
    bold: 'Comfortaa-Bold',
    logo: 'Righteous-Regular',
};

const FontBaseValue = scale(18);

export const Medbook = {
    name: 'light',
    colors:{
        textSecond: Colors.secondTextColor,
        textFourth: Colors.fourthTextColor,
        textFifth:Colors.fifthTextColor,

        backgroundFirst: Colors.firstBackgroundColor,
        backgroundThird: Colors.thirdBackgroundColor,
        backgroundSixth:Colors.sixthBackgroundColor,
        backgroundSeventh:Colors.seventhBackgroundColor,
        backgroundEighth:Colors.eighthBackgroundColor,
        backgroundNinth:Colors.ninthBackgroundColor,
        backgroundTenth:Colors.tenthBackground,

        text: {
            first: Colors.firstMedbookColor,
            secondary: Colors.secondaryForeground,
            fifth: Colors.textFifth,
            six: Colors.textSix,
            seven: Colors.textSeven,
        },
        input: {
            placeholderSecond: Colors.placeholderTextSecond,
        },
        screen: {
            choose: Colors.chooseColor,
            third: Colors.thirdBackground,
            fourth: Colors.fourthBackground,
            six: Colors.sixBackground,
        },
        border: {
            base: Colors.border,
            second: Colors.bordersecond,
            txtInput:Colors.shadow
        },
        shadow:{
            base: Colors.shadow,
        }
    },
    fonts: {
        sizes: {
            h0: scale(32),
            h1: scale(26),
            h2: scale(24),
            h3: scale(20),
            h4: scale(18),
            h5: scale(16),
            h6: scale(15),
            p0: scale(17),
            p1: scale(16),
            p2: scale(15),
            p3: scale(14),
            p4: scale(13),
            p5: scale(12),
            p6: scale(10),
            p7: scale(11),
            p8: scale(9),
            base: FontBaseValue,
            small: FontBaseValue * .8,
            medium: FontBaseValue,
            large: FontBaseValue * 1.2,
            xlarge: FontBaseValue / 0.75,
            xxlarge: FontBaseValue * 1.6,
        },
        lineHeights: {
            medium: 18,
            big: 24
        },
        family: {
            regular: Fonts.regular,
            light: Fonts.light,
            bold: Fonts.bold,
            logo: Fonts.logo
        }
    }
};








