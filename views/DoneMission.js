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


const axios = require('axios')

export function DoneMissionView({ route, navigation }) {

    const [user, setUser] = useState(route.params.user);
    const [mission, setMission] = useState(route.params.mission)
    const [missionSupervisors, setMissionSupervisors] = useState([])
    const [missionContributors, setMissionContributors] = useState([])
    const [missionSignatures, setMissionSignatures] = useState([])
    const [deleteMissionModalVisible, setDeleteMissionModalVisible] = useState(false)


    //Set header buttons
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button color="#ff0000" title="Delete" onPress={() => { setDeleteMissionModalVisible(!deleteMissionModalVisible) }} />
        });
    }, [navigation]);

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
    }, [mission])

    const handleDeleteMission = () => {
        if (user.isAdmin) {
            axios.post(`http://192.168.1.62:3000/deletemission`, {missionID: mission.id, email: user.email},{
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(async res => {
                    console.log("Mission delete response: ", res.data)
                    if (res.status === 200) {
                        alert('Mission deleted successfully!')
                        setDeleteMissionModalVisible(false)
                        navigation.navigate('Missions', user)
                    } else {
                        alert('An error occured.')
                        console.log(res)
                    }
                })
                .catch(err => {
                    if (err.message.includes('500')) {
                        alert('Couldnt delete mission.')
                        console.log(err.message)
                    }
                    else if (err.message.includes('401')) {
                        alert("You don't have the rights to do this.")
                    }
                    else {
                        alert('Couldnt communicate with the server.')
                    }
                    console.log(err);
                });
        }
    }


    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, styles.border, styles.textMargin, styles.marginTop]}>
                <Text></Text>
                <Title style={[styles.title, styles.bold]}>{mission.name}</Title>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={styles.bold}>Company:</Subheading>
                    <Subheading style={styles.textMargin}>{mission.company_name}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={styles.bold}>Address:</Subheading>
                    <Subheading style={[styles.textMargin, {maxWidth:200}]}>{mission.company_location}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={styles.bold}>Contact:</Subheading>
                    <Subheading style={styles.textMargin}>{mission.company_contact}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={styles.bold}>Date:</Subheading>
                    <Subheading style={styles.textMargin}>{new Date(mission.date).toLocaleString()}</Subheading>
                </View>
                <View style={[styles.TextHorizontalAlign, styles.marginTop]}>
                    <Subheading style={styles.bold}>Description:</Subheading>
                    <Text style={[styles.textMargin, {maxWidth:160}]}>{mission.description}</Text>
                </View>

                <Text></Text>
                <View style={[styles.border, styles.textMargin]}>
                    <Subheading style={[styles.title, styles.bold]}>Supervisors:</Subheading>
                    {missionSupervisors.map((usr, index) =>
                    <List.Item key={index} title={usr.lastname + ' ' + usr.firstname} description={usr.email} />
                    )}
                </View>

                <Text></Text>

                <View style={[styles.border, styles.textMargin]}>
                    <Subheading style={[styles.title, styles.bold]}>Contributors:</Subheading>
                    {missionContributors.map((usr, index) =>
                    <List.Item key={index} title={usr.lastname + ' ' + usr.firstname} description={usr.email} />
                    )}
                </View>

                <Text></Text>
                {missionSignatures.length > 0 &&
                    <View style={[styles.textMargin,{ borderWidth: 1, borderColor: "#008000", borderRadius:10, marginBottom:30}]}>
                        <Subheading style={[styles.title, styles.bold]}>Signatures done during this mission:</Subheading>
                        <Text></Text>
                        {missionSignatures.map((signature, index) =>
                            <View key={index} >
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

            {/* Delete Mission Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteMissionModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView]}>
                        <Title>Delete mission</Title>
                        <Subheading>You are about to delete the mission:</Subheading>
                        <Text></Text>
                        <Text></Text>
                        <Text>{mission.name}</Text>
                        <Text></Text>
                        <Text></Text>
                        <Text>Are you sure ?</Text>
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setDeleteMissionModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => handleDeleteMission()}
                            >
                                <Text style={styles.textStyle}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
