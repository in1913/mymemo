import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions  } from 'react-native';
import colors from '../misc/colors';

const Note = ({ item, onPress }) => {
    const [bkColor, setBkColor] = useState('colors.PRIMARY');
    const { title, desc } = item;
    
     useEffect(()=>{ 
        const bcolor = [colors.PRIMARY, colors.SECONDERY, colors.TERTIARY, colors.QUATERNARY, colors.QUINARY];
        setBkColor(bcolor[Math.floor(Math.random()*5)]);
     }, []);
     
     return (
        <TouchableOpacity onPress={ onPress } style={ [styles.container, { backgroundColor: bkColor}]}>
            <Text style={styles.title} numberOfLines={2}>
               { title } 
            </Text>
            <Text numberOfLines={3}>{desc}</Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get('window').width - 40;
const styles = StyleSheet.create({
    container: {
        width: width / 2.2 - 10,
        padding:11,
        borderRadius: 10,
        backgroundColor: colors.PRIMARY
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color:colors.DARK
    }
});

export default Note;