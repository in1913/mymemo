import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';
import { useNotes } from '../context/NoteProvider';
import NoteInputModal from './NoteInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';

const formatDate = (ms) => {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${year}-${month}-${day}(${hrs}시 ${min} ${sec})`;
};

const NoteDetail = props => {
    const [note, setNote] = useState(props.route.params.note);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { setNotes } = useNotes();
    const headerHeight = useHeaderHeight();

    const deleteNote = async () => {
        const result = await AsyncStorage.getItem('notes');
        let notes = [];
        if(result !== null) notes = JSON.parse(result);
        const newNotes = notes.filter(n => n.id !== note.id);
        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        props.navigation.goBack();
    };

    const displayDeleteAlert = () => {
        Alert.alert(
            '정말로 삭제 하시겠습니까?',
            '삭제하면 복구할 수 없습니다.',
            [
                {
                    text: 'Delete',
                    onPress: deleteNote,
                },
                {
                    text: '취소',
                    opPress: () => console.log('취소함')
                }
            ],
            {
                cancelable: true
            }
        );
    };

    const handleUpdate = async (title, desc, time) => {
        const result = await AsyncStorage.getItem('notes');
        let notes=[];
        if(result !== null) notes = JSON.parse(result);

        const newNotes = notes.filter( n => {
            if( n.id === note.id){
               n.title = title;
               n.desc = desc;
               n.time = time;
               n.isUpdate = true;
               setNote(n);
            }
            return n;
        });
        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    }

    const handleOnClose = () => setShowModal(false);

    const openEditModal = () => {
        setIsEdit(true);
        setShowModal(true);
    }
    return (
        <View>
           <ScrollView
               contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}
           >
              <Text style={styles.time}>
                {
                    note.isUpdate
                    ? `Update At ${formatDate(note.time)} `
                    : `Created At ${formatDate(note.time)}`
                }
                    
              </Text> 
              <Text style={styles.title}>{ note.title} </Text>
              <Text style={styles.desc}>{ note.desc} </Text>
           </ScrollView>    
           <View style={styles.btnContainer}>
              <RoundIconBtn
                 antIconName='delete'
                 onPress={displayDeleteAlert}
                 style={{ backgroundColor: colors.ERROR, marginBottom: 15}}
               />
               <RoundIconBtn  
                 antIconName='edit'
                 onPress={openEditModal}
               /> 
           </View>
           <NoteInputModal
               isEdit={isEdit}
               note={note}
               onClose={handleOnClose}
               onSubmit={handleUpdate}
               visible={showModal}
            />   
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    time: {
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.6
    },
    title: {
        fontSize: 30,
        color: colors.PRIMARY,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 20,
        opacity:0.8
    },
    btnContainer: {
        position:'absolute',
        right:15,
        bottom: 50
    }
})

export default NoteDetail;