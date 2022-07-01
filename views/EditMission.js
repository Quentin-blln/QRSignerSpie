import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button, SafeAreaView, Modal, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Text, Title, Subheading } from "react-native-paper"
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
import Icon from 'react-native-vector-icons/MaterialIcons'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';





const axios = require('axios')

export function EditMissionView({ route, navigation }) {

    const [user, setUser] = useState(route.params.user);
    const [mission, setMission] = useState(route.params.mission);

    const [newMissionName, setNewMissionName] = useState(route.params.mission.name);
    const [newMissionDescription, setNewMissionDescription] = useState(route.params.mission.description);
    const [newMissionCompanyName, setNewMissionCompanyName] = useState(route.params.mission.company_name);
    const [newMissionCompanyLocation, setNewMissionCompanyLocation] = useState(route.params.mission.company_location);
    const [newMissionCompanyContact, setNewMissionCompanyContact] = useState(route.params.mission.company_contact);
    const [newMissionDate, setNewMissionDate] = useState(new Date(route.params.mission.date));
    const [newMissionSupervisorsIds, setNewMissionSupervisorsIds] = useState(route.params.missionSupervisors);
    const [newMissionContributorsIds, setNewMissionContributorsIds] = useState(route.params.missionContributors);
    const [newMissionSupervisors, setNewMissionSupervisors] = useState([]);
    const [newMissionContributors, setNewMissionContributors] = useState([]);
    const [missionOldSupervisors, setMissionOldSupervisors] = useState([]);
    const [missionOldContributors, setMissionOldContributors] = useState([]);

    const [deleteMissionModalVisible, setDeleteMissionModalVisible] = useState(false)


    const [allUsers, setAllUsers] = useState([])

    //Set header buttons
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button color="#ff0000" title="Delete" onPress={() => { setDeleteMissionModalVisible(!deleteMissionModalVisible) }} />
        });
    }, [navigation]);


    useEffect(() => {
        //Get every users if the user is admin
        axios.get('http://192.168.1.62:3000/allusers', {
            headers: { 'Content-Type': 'application/json' },
            params: { email: user.email }
        })
            .then(resp => {
                for (let usr of resp.data.users) {
                    usr.name = usr.lastname + ' ' + usr.firstname
                }
                setAllUsers([
                    {
                        name: "Users",
                        id: 0,
                        children: resp.data.users
                    }
                ])
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        //Get every supervisors for this mission
        axios.get('http://192.168.1.62:3000/missionsupervisors', {
            headers: { 'Content-Type': 'application/json' },
            params: { userID: user.id, missionID: mission.id }
        })
            .then(resp => {
                console.log("Mission supervisors: ", resp.data.users)
                let tmpList = []
                for (let usr of resp.data.users) {
                    tmpList.push(usr.id)
                }
                setMissionOldSupervisors(tmpList)
                setNewMissionSupervisorsIds(tmpList)
            })
            .catch(err => console.log(err))

        //Get every contributors for this mission
        axios.get('http://192.168.1.62:3000/missioncontributors', {
            headers: { 'Content-Type': 'application/json' },
            params: { userID: user.id, missionID: mission.id }
        })
            .then(resp => {
                console.log("Mission contributors: ", resp.data.users)
                let tmpList = []
                for (let usr of resp.data.users) {
                    tmpList.push(usr.id)
                }
                setMissionOldContributors(tmpList)
                setNewMissionContributorsIds(tmpList)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        let tempL = []
        for (let usr of newMissionSupervisorsIds) {
            console.log(usr)
            if (allUsers.length > 0) {
                let found = allUsers[0].children.find(e => e.id === usr)
                if (found !== undefined) {
                    tempL.push(found)
                }
            }
        }
        setNewMissionSupervisors(tempL)
    }, [newMissionSupervisorsIds, allUsers])

    useEffect(() => {
        let tempL = []
        for (let usr of newMissionContributors) {
            if (allUsers.length > 0) {
                let found = allUsers[0].children.find(e => e.id === usr)
                if (found !== undefined) {
                    tempL.push(found)
                }
            }
        }
        setNewMissionSupervisors(tempL)
    }, [newMissionContributorsIds, allUsers])

    const handleEditMission = () => {
        if (newMissionName) {
            if (newMissionDescription) {
                if (newMissionCompanyName) {
                    if (newMissionCompanyLocation) {
                        if (newMissionCompanyContact) {
                            if (newMissionDate) {
                                axios.post(`http://192.168.1.62:3000/editmission`, {
                                    missionID: mission.id,
                                    email: user.email,
                                    name: newMissionName,
                                    description: newMissionDescription,
                                    company_name: newMissionCompanyName,
                                    company_location: newMissionCompanyLocation,
                                    company_contact: newMissionCompanyContact,
                                    date: newMissionDate,
                                    supervisors: newMissionSupervisorsIds,
                                    contributors: newMissionContributorsIds,
                                    oldSupervisors: missionOldSupervisors,
                                    oldContributors: missionOldContributors
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                                )
                                    .then(async res => {
                                        console.log("Mission edit response: ", res.data)
                                        if (res.status === 200) {
                                            alert('Mission edited successfully!')
                                        } else {
                                            alert('An error occured.')
                                            console.log(res)
                                        }
                                    })
                                    .catch(err => {
                                        if (err.message.includes('500')) {
                                            alert('Couldnt edit mission.')
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
                            else { alert('Please enter mission date') }
                        }
                        else { alert('Please enter company contact') }
                    }
                    else { alert('Please enter company location') }
                }
                else { alert('Please enter company name.') }
            }
            else { alert('Please enter mission description.') }
        }
        else { alert('Please enter mission name.') }
    }

    const handleDeleteMission = () => {
        if (user.isAdmin) {
            axios.post(`http://192.168.1.62:3000/deletemission`, { missionID: mission.id, email: user.email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <ScrollView>
            <Title>Edit mission</Title>
            <TextInput
                label="Name"
                returnKeyType="done"
                value={newMissionName}
                onChangeText={(text) => setNewMissionName(text)}
                error={!!newMissionName.error}
                errorText={newMissionName.error}
            />
            <TextInput
                label="Description"
                returnKeyType="done"
                value={newMissionDescription}
                onChangeText={(text) => setNewMissionDescription(text)}
                error={!!newMissionDescription.error}
                errorText={newMissionDescription.error}
            />
            <TextInput
                label="Company Name"
                returnKeyType="done"
                value={newMissionCompanyName}
                onChangeText={(text) => setNewMissionCompanyName(text)}
                error={!!newMissionCompanyName.error}
                errorText={newMissionCompanyName.error}
            />
            <TextInput
                label="Company Location"
                returnKeyType="done"
                value={newMissionCompanyLocation}
                onChangeText={(text) => setNewMissionCompanyLocation(text)}
                error={!!newMissionCompanyLocation.error}
                errorText={newMissionCompanyLocation.error}
            />
            <TextInput
                label="Company contact"
                returnKeyType="done"
                value={newMissionCompanyContact}
                onChangeText={(text) => setNewMissionCompanyContact(text)}
                error={!!newMissionCompanyContact.error}
                errorText={newMissionCompanyContact.error}
            />
            <RNDateTimePicker mode="datetime" display="default" onChange={(event, date) => setNewMissionDate(new Date(date))} value={new Date(newMissionDate)} />
            <Text></Text>
            <Text>Select the supervisors</Text>
            <SectionedMultiSelect
                items={allUsers}
                IconRenderer={Icon}
                uniqueKey="id"
                subKey="children"
                selectText="Choose one or mutiple users..."
                showDropDowns={false}
                readOnlyHeadings={true}
                onSelectedItemsChange={(list) => { setNewMissionSupervisorsIds(list) }}
                selectedItems={newMissionSupervisorsIds}
                searchPlaceholderText="Search user..."
            />

            <Text></Text>
            <Text>Select the contributors</Text>
            <SectionedMultiSelect
                items={allUsers}
                IconRenderer={Icon}
                uniqueKey="id"
                subKey="children"
                selectText="Choose one or mutiple users..."
                showDropDowns={false}
                readOnlyHeadings={true}
                onSelectedItemsChange={(list) => { setNewMissionContributorsIds(list) }}
                selectedItems={newMissionContributorsIds}
                searchPlaceholderText="Search user..."
            />

            <Text></Text>
            <Button title="Confirm" onPress={() => { handleEditMission() }} />
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
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
    )
}