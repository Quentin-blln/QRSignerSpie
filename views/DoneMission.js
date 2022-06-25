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
    const [supervisor, setSupervisor] = useState()
    const [contributor, setContributor] = useState()
    const [deleteMissionModalVisible, setDeleteMissionModalVisible] = useState(false)


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button color="#ff0000" title="Delete" onPress={() => { setDeleteMissionModalVisible(!deleteMissionModalVisible) }} />
        });
    }, [navigation]);

    useEffect(() => {
        //Get supervisor that validated this mission
        if (mission.doneSupervisor) {
            axios.get('http://192.168.1.62:3000/user', {
                headers: { 'Content-Type': 'application/json' },
                params: { email: user.email, userID: mission.doneSupervisor }
            })
                .then(resp => {
                    console.log("Mission supervisor: ", resp.data.user)
                    setSupervisor(resp.data.user)
                })
                .catch(err => console.log(err))
        }
        if (mission.doneContributor) {
            //Get contributor that validated this mission
            axios.get('http://192.168.1.62:3000/user', {
                headers: { 'Content-Type': 'application/json' },
                params: { email: user.email, userID: mission.doneContributor }
            })
                .then(resp => {
                    console.log("Mission contributor: ", resp.data.user)
                    setContributor(resp.data.user)
                })
                .catch(err => console.log(err))
        }
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
        <View>
            <Title style={styles.title}>Mission: {mission.name}</Title>
            <Subheading style={styles.title}>Company: {mission.company_name}</Subheading>
            <Text>Adress: {mission.company_location}</Text>
            <Text>Contact: {mission.company_contact}</Text>
            <Text>Date: {new Date(mission.date).toDateString()}</Text>
            <Text>Description: {mission.description}</Text>
            <Text></Text>
            <Text></Text>
            <Text>Supervisor that validated this mission:</Text>
            {supervisor &&
                <List.Item title={supervisor.lastname + ' ' + supervisor.firstname} description={supervisor.email} />
            }
            <Text></Text>
            <Text>Contributor that validated this mission:</Text>
            {contributor &&
                <List.Item title={contributor.lastname + ' ' + contributor.firstname} description={contributor.email} />
            }
            <Text></Text>
            <Text>Comment after validation: </Text>
            <Text></Text>
            <Subheading>{mission.doneComment && mission.doneComment}</Subheading>

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
        </View>
    );
}
