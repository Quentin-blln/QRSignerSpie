import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button, Modal, Pressable } from "react-native";
import { Text, Title, Subheading, List } from "react-native-paper"
import styles from "../stylesheet";
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { ScrollView } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";
import { Logout } from "../components/Logout";
import { ProfileIcon } from '../components/ProfileIcon'
import QRCodeDisplay from '../components/QRCodeDisplay'
import * as SecureStore from 'expo-secure-store';
const CryptoJS = require('crypto-js');


const axios = require('axios')

export function MissionView({ route, navigation }) {

    const [user, setUser] = useState(route.params.user);
    const [mission, setMission] = useState(route.params.mission)
    const [role, setRole] = useState(route.params.role)

    const [modalQRDisplayVisible, setModalQRDisplayVisible] = useState(false);
    const [modalQRScannerVisible, setModalQRScannerVisible] = useState(false);
    const [scanning, setScanning] = useState(false);


    const [missionSupervisors, setMissionSupervisors] = useState([])
    const [missionContributors, setMissionContributors] = useState([])
    const [missionSignatures, setMissionSignatures] = useState([])


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => role === 1 ? <Button onPress={() => setModalQRDisplayVisible(!modalQRDisplayVisible)} title="Validate" />
                : role === 2 ? <Button onPress={() => { navigation.navigate('QRScanner', { mission: mission, supervisorID: user.id }) }} title="Validate" />
                    : role === 3 ? <Button onPress={() => { handleEditMission() }} title="Edit" /> : null
        });
    }, [navigation]);


    let doneComments = []
    if (mission.doneComment) {
        doneComments = mission.doneComment.split('//\\')
    }

    let signatures = []

    useEffect(() => {
        //Get every supervisors for this mission
        axios.get('http://192.168.1.62:3000/missionsupervisors', {
            headers: { 'Content-Type': 'application/json' },
            params: { userID: user.id, missionID: mission.id }
        })
            .then(resp => {
                // console.log("Mission supervisors: ", resp.data.users)
                setMissionSupervisors(resp.data.users)
            })
            .catch(err => console.log(err))

        //Get every contributors for this mission
        axios.get('http://192.168.1.62:3000/missioncontributors', {
            headers: { 'Content-Type': 'application/json' },
            params: { userID: user.id, missionID: mission.id }
        })
            .then(resp => {
                // console.log("Mission contributors: ", resp.data.users)
                setMissionContributors(resp.data.users)
            })
            .catch(err => console.log(err))

        //Get every signatures for this mission
        axios.get('http://192.168.1.62:3000/signatures', {
            headers: { 'Content-Type': 'application/json' },
            params: { userID: user.id, missionID: mission.id }
        }).then(resp => {
            setMissionSignatures(resp.data.signatures)
        }).catch(err => console.log(err))
    }, [])

    const handleEditMission = () => {
        let editDatas = {
            user: user,
            mission: mission,
            missionContributors: [],
            missionSupervisors: []
        }
        console.log('Sups and Contrs: ', missionSupervisors, missionContributors)
        for (let usr of missionSupervisors) {
            editDatas.missionSupervisors.push(usr.id)
        }
        for (let usr of missionContributors) {
            editDatas.missionContributors.push(usr.id)
        }
        navigation.navigate('EditMission', editDatas)
    }

    const handleSaveQR = async () => {
        let signObject = `{"user":${user.id},"mission":${mission.id},"name":"${user.lastname + ' ' + user.firstname}"}`
        let encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signObject))
        let done = await SecureStore.setItemAsync('QRDisplaySaved', encrypted);
        alert('QR Saved!')

    }

    let roleString

    switch (role) {
        case 1:
            roleString = 'Contributor'
            break;
        case 2:
            roleString = 'Supervisor'
            break;
        default:
            roleString = '/'
            break;
    }


    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, styles.border, styles.textMargin, styles.marginTop]}>
                <Text></Text>
                <Title style={[styles.title, styles.bold]}>{mission.name}</Title>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Company:</Subheading>
                    <Subheading style={[styles.textMargin, styles.title]}>{mission.company_name}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Address:</Subheading>
                    <Subheading style={[styles.textMargin, {maxWidth:200}]}>{mission.company_location}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Contact:</Subheading>
                    <Subheading style={[styles.textMargin, styles.title]}>{mission.company_contact}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Date:</Subheading>
                    <Subheading style={[styles.textMargin]}>{new Date(mission.date).toLocaleString()}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Description:</Subheading>
                    <Text style={[styles.textMargin, {maxWidth:160}]}>{mission.description}</Text>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={[styles.bold]}>Your role:</Subheading>
                    <Subheading style={[styles.textMargin]}>{roleString}</Subheading>
                </View>
                
                <Text></Text>
                <View style={[styles.border, styles.textMargin]}>
                    <Subheading style={[styles.textMargin, styles.bold]}>Supervisors:</Subheading>
                    {missionSupervisors.map((usr, index) =>
                        <List.Item key={index} title={usr.lastname + ' ' + usr.firstname} description={usr.email} />
                    )}
                </View>
                <Text></Text>
                <View style={[styles.border, styles.textMargin]}>
                    <Subheading style={[styles.textMargin, styles.bold]}>Contributors:</Subheading>
                    {missionContributors.map((usr, index) =>
                        <List.Item key={index} title={usr.lastname + ' ' + usr.firstname} description={usr.email} />
                    )}
                </View>

                <Text></Text>
                {missionSignatures.length > 0 &&
                    <View style={[styles.textMargin,{ borderWidth: 1, borderColor: "#008000", borderRadius:10, marginBottom:30}]}>
                        <Subheading style={[styles.title, styles.bold]}>Signatures already done:</Subheading>
                        {missionSignatures.map((signature, index) =>
                            <View key={index}>
                                <Text>Signature n°{index+1}:</Text>
                                {signature.supervisor && 
                                <View style={[styles.TextHorizontalAlign, {marginTop:5}]}>
                                    <Text style={styles.textMargin}>Supervisor:</Text>
                                    <Text style={styles.textMargin}>{signature.supervisor.lastname + ' ' + signature.supervisor.firstname}</Text>
                                </View>}
                                {signature.contributor && 
                                <View style={[styles.TextHorizontalAlign, {marginTop:5}]}>
                                    <Text style={styles.textMargin}>Contributor:</Text>
                                    <Text style={styles.textMargin}>{signature.contributor.lastname + ' ' + signature.contributor.firstname}</Text>
                                </View>}
                                <View style={[styles.TextHorizontalAlign, {marginTop:5}]}>
                                    <Text style={styles.textMargin}>Comment:</Text>
                                    <Text style={[styles.textMargin,{maxWidth:150}]}>{signature.signature.comment}</Text>
                                </View>
                                <Text></Text>
                            </View>
                        
                        )}
                    </View>
                }

            </View>

            {/* QRDisplay Modal for contributors*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalQRDisplayVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <QRCodeDisplay user={user} mission={mission} />
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalQRDisplayVisible(!modalQRDisplayVisible)}
                            >
                                <Text style={styles.textStyle}>Back</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => handleSaveQR()}
                            >
                                <Text style={styles.textStyle}>Save QR</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}
