import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button, Modal, Pressable, StyleSheet } from "react-native";
import { Text, Title, Subheading, List, Checkbox } from "react-native-paper"
import Background from '../components/Background'
import Logo from '../components/Logo'
import styles from "../stylesheet";
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { ScrollView } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";
import { Logout } from "../components/Logout";
import { ProfileIcon } from '../components/ProfileIcon'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { BarCodeScanner } from 'expo-barcode-scanner';
const CryptoJS = require('crypto-js');
import * as SecureStore from 'expo-secure-store';




const axios = require('axios')

export function QRCodeScannerView({ route, navigation }) {
    const [mission, setMission] = useState(route.params.mission);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [modalValidationVisible, setModalValidationVisible] = useState(false);
    const [modalCommentVisible, setModalCommentVisible] = useState(false);

    const [contributor, setContributor] = useState({})
    const [supervisorID, setSupervisorID] = useState(route.params.supervisorID)
    const [comment, setComment] = useState('')
    const [isMissionTotallyDone, setIsMissionTotallyDone] = useState(false);

    const handleSaveScan = async () => {
        let savedObjStr = `{"mission": {"id":${mission.id}, "name":"${mission.name}", "company_name":"${mission.company_name}", "company_location":"${mission.company_location}"}, "supervisorID":${supervisorID}}`
        let done = await SecureStore.setItemAsync('QRScanSaved', savedObjStr);
        alert('QR Code Saved!')
    }

    //Set header buttons
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button title="Save" onPress={() => { handleSaveScan() }} />
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        let decrypted = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
        let decryptedObj = JSON.parse(decrypted)
        if (mission.id == decryptedObj.mission) {
            setModalValidationVisible(!modalValidationVisible)
            setContributor({ userID: decryptedObj.user, name: decryptedObj.name })
            console.log('SAME MISSION ID')
        }
    };
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const handlePostMissionDone = () => {
        if (contributor.userID && supervisorID && mission.id) {
            let Contributor = contributor.userID
            axios.post(`http://192.168.1.62:3000/missiondone`, {
                contributorID: Contributor,
                supervisorID: supervisorID,
                missionID: mission.id,
                comment: comment,
                totallyDone: isMissionTotallyDone,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(async res => {
                    if (res.status === 200) {
                        alert('Signature Validated.')
                        console.log("REPONSE POST MISSION DONE: ", res.data)
                        setModalCommentVisible(false)
                        setModalValidationVisible(false)
                        navigation.navigate('Missions')
                    }
                })
                .catch(err => {
                    if (err.message.includes('401')) {
                        alert('Signature couldnt be validated.')
                    }
                    else {
                        const storeDoneMissionrequest = async (datas) => { let done = await SecureStore.setItemAsync('DoneMissionRequest', datas) }
                        let postDatas = `{"contributorID":${contributor.userID}, "supervisorID":${supervisorID}, "missionID":${mission.id}, "comment":"${comment}", "name":"${mission.name}"}`
                        storeDoneMissionrequest(postDatas)
                        setModalCommentVisible(false)
                        setModalValidationVisible(false)
                        alert('Couldnt communicate with the server. The request is stored in you offline datas. You can try send it later.')
                    }
                    console.log(err);
                });
        }
    }


    return (
        <View style={stylesQR.container}>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                onTouchMove={() => { props.updateScanning(false) }}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalValidationVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>QR Code validated.</Text>
                        <Text></Text>
                        <Text>You are about to validate the mission:</Text>
                        <Text></Text>
                        <Text>{mission.name}</Text>
                        <Text>Company: {mission.company_name}</Text>
                        <Text>Location: {mission.company_location}</Text>
                        <Text></Text>
                        <Text>With contributor: {contributor.name}</Text>
                        <Text></Text>
                        <Checkbox.Item
                            style={{borderColor:"#008000", borderWidth:1}}
                            uncheckedColor="#000"
                            status={isMissionTotallyDone ? 'checked' : 'unchecked'}
                            onPress={() => { setIsMissionTotallyDone(!isMissionTotallyDone) }}
                            label="Mission totally done ?"
                        />
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalValidationVisible(!modalValidationVisible)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => { setModalValidationVisible(!modalValidationVisible); setModalCommentVisible(!modalCommentVisible) }}
                            >
                                <Text style={styles.textStyle}>Validate</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCommentVisible}
            >
                <ScrollView>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Add a comment ?</Text>
                            <TextInput
                                label="Comment"
                                returnKeyType="next"
                                value={comment.value}
                                onChangeText={(text) => setComment(text)}
                                error={!!comment.error}
                                errorText={comment.error}
                            />
                            <View style={styles.ButtonHorizontalAlign}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => { setModalValidationVisible(!modalValidationVisible); setModalCommentVisible(!modalCommentVisible) }}
                                >
                                    <Text style={styles.textStyle}>Back</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonValidate]}
                                    onPress={() => handlePostMissionDone()}
                                >
                                    <Text style={styles.textStyle}>Validate</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

        </View>
    );
}

const stylesQR = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    }
});

