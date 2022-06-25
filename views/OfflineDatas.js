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
import QRCode from 'react-native-qrcode-svg';
import { useIsFocused } from "@react-navigation/native";



const axios = require('axios')

export function OfflineDatasView({ route, navigation }) {

    const [qrToDisplay, setQrToDisplay] = useState();
    const [qrToScan, setQrToScan] = useState()
    const [storedDoneMissionRequest, setStoredDoneMissionRequest] = useState()

    const isFocused = useIsFocused();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button color="#ff0000" title="Delete datas" onPress={()=>{
                Alert.alert(
                    "Delete datas",
                    "You are about to delete saved QR / Scan / Requests",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Delete Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => handleDeleteDatas() }
                    ]
                  );
            }}/>
        });
    }, [navigation]);

    useEffect(async()=>{
        let resultD = await SecureStore.getItemAsync('QRDisplaySaved');
        if(resultD){
            console.log('QRDisplay value: ', resultD)
            setQrToDisplay(resultD)
        }

        let resultS = await SecureStore.getItemAsync('QRScanSaved');
        if(resultS){
            let resultObj = JSON.parse(resultS)
            console.log('QRScan value: ', resultObj, typeof(resultObj))
            setQrToScan(resultObj)
        }

        let resultR = await SecureStore.getItemAsync('DoneMissionRequest');
        if(resultR){
            let resultObj = JSON.parse(resultR)
            console.log('Mission done request value: ', resultObj, typeof(resultObj))
            setStoredDoneMissionRequest(resultObj)
        }
    },[route, isFocused])

    const handleDeleteDatas = async () =>{
        let done
        done = await SecureStore.deleteItemAsync('QRDisplaySaved')
        done = await SecureStore.deleteItemAsync('QRScanSaved')
        done = await SecureStore.deleteItemAsync('DoneMissionRequest')
        setQrToDisplay(null)
        setQrToScan(null)
        setStoredDoneMissionRequest(null)
    }

    const handlePostMissionDone = ()=>{
        if(storedDoneMissionRequest.contributorID && storedDoneMissionRequest.supervisorID && storedDoneMissionRequest.missionID){
            axios.post(`http://192.168.1.62:3000/missiondone`, {
                contributorID: storedDoneMissionRequest.contributorID,
                supervisorID: storedDoneMissionRequest.supervisorID,
                missionID: storedDoneMissionRequest.missionID,
                comment: storedDoneMissionRequest.comment
            },{
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async res => { 
                if(res.status===200){
                    setStoredDoneMissionRequest(null)
                    if(qrToScan.mission.id==storedDoneMissionRequest.missionID){
                        setQrToScan(null)
                    }
                    SecureStore.deleteItemAsync('DoneMissionRequest')
                    alert('Mission Validated.')
                    console.log("REPONSE POST MISSION DONE: ", res.data)
                }
            })
            .catch(err => {
              if (err.message.includes('401')){
                alert('Mission couldnt be validated.')
              }
              else{
                alert('Still couldnt communicate with the server. Try again later when you are online. The request will be kept here until you validate another one.')
              }
              console.log(err);
            });
        }
    }

    return (
        <View>
            <Subheading style={{textAlign:"center"}}>Here are all your offline datas.</Subheading>
            <Text></Text>
            {qrToDisplay&&
            <View style={{justifyContent:"center", alignItems:"center"}}>
                <Text>QR Code saved:</Text>
                <QRCode value={qrToDisplay} size={200}/>
            </View>
            }
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            {qrToScan&&
            <View style={{justifyContent:"center", alignItems:"center"}}>
                <Text>QR Scan saved:</Text>
                <Text></Text>
                <Text>Mission name: {qrToScan.mission.name}</Text>
                <Text>Company: {qrToScan.mission.company_name}</Text>
                <Text>Location: {qrToScan.mission.company_location}</Text>
                <Text></Text>
                <Button title="Validate" onPress={()=>{navigation.navigate('QRScanner', {mission:qrToScan.mission, supervisorID:qrToScan.supervisorID})}}/>
            </View>            
            }
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            {storedDoneMissionRequest&&
            <View style={{justifyContent:"center", alignItems:"center"}}> 
                <Text>Mission done request saved</Text>
                <Text></Text>
                <Text>For mission:    {storedDoneMissionRequest.name}</Text>
                <Button title="Send it again" onPress={()=>{handlePostMissionDone()}}/>
            </View>    
            }
        </View>
    );
}
