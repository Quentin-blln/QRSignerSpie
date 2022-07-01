import React, { useState, useEffect } from "react";
import { Linking, Text, View, StyleSheet, Button, Modal, Pressable } from "react-native";
import { Title, Subheading, List } from "react-native-paper"
import { useNavigation } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../stylesheet";
import { Logout } from "../components/Logout";
import { ProfileIcon } from "../components/ProfileIcon";
import TextInput from '../components/TextInput'

const axios = require('axios')

export function AllUsersView({ route, navigation }) {
    //View that history of every signatures
    const [user, setUser] = useState(route.params.user);
    const [users, setUsers] = useState([])
    const [deactivatedUsers, setDeactivatedUsers] = useState([])
    const [userToDeactivate, setUserToDeactivate] = useState(null)
    const [userToActivate, setUserToActivate] = useState(null)
    const [modalVisibleDeactivate, setModalVisibleDeactivate] = useState(false);
    const [modalVisibleActivate, setModalVisibleActivate] = useState(false);

    //useEffect to get all users if user is admin
    useEffect(() => {
        if (user.isAdmin) {
            axios.get('http://192.168.1.62:3000/allusers', {
                headers: { 'Content-Type': 'application/json' },
                params: { email: user.email }
            }).then(resp => {
                console.log('All users: ', resp.data)
                setUsers(resp.data.users)
            }).catch(err => { console.log(err) })
        }
    }, [])

    //useEffect to filter all deactivated users from users list if user is admin
    useEffect(() => {
        if (user.isAdmin) {
            const deactivatedUsers = users.filter(user => user.isDeactivated)
            setDeactivatedUsers(deactivatedUsers)
        }
    }, [users])

    //Function to deactivate user
    const deactivateUser = (userToDeactivate) => {
        axios.post('http://192.168.1.62:3000/deactivateuser', { email: user.email, userToDeactivateID: userToDeactivate.id }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(resp => {
            console.log('User deactivation response: ', resp.data)
            if (resp.data.message.includes('200')) {
                setModalVisibleDeactivate(false)
                alert('User deactivated')
                let found = users.findIndex(user => user.id === userToDeactivate.id)
                users[found].isDeactivated = true
                setDeactivatedUsers([...deactivatedUsers, users[found]])
            } else { alert('Error deactivating user') }
        }).catch(err => {
            alert('Error deactivating user')
            console.log(err)
        })
    }

    //Function to activate user
    const activateUser = (userToActivate) => {
        axios.post('http://192.168.1.62:3000/activateuser', { email: user.email, userToActivateID: userToActivate.id }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(resp => {
            console.log('User activation response: ', resp.data)
            if (resp.data.message.includes('200')) {
                setModalVisibleActivate(false)
                alert('User activated')
                let found = deactivatedUsers.findIndex(user => user.id === userToActivate.id)
                deactivatedUsers[found].isDeactivated = false
                setDeactivatedUsers(deactivatedUsers.filter(user => user.id !== userToActivate.id))
            } else { alert('Error activating user') }
        }).catch(err => {
            alert('Error activating user')
            console.log(err)
        })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {users.length > 0 && <Title style={styles.title}>Found {users.length} users</Title>}
                {users.length > 0 && <Title style={styles.title}>{users.length-deactivatedUsers.length} active users</Title>}
                {users.map((usr, key) => {
                    return (
                        <View>
                            {!usr.isDeactivated &&
                                <ListItem.Swipeable
                                    rightContent={
                                        user.id!==usr.id &&
                                            <Button 
                                                title="Deactivate"
                                                onPress={() => { setUserToDeactivate(usr); setModalVisibleDeactivate(true) }}
                                                color='red'
                                            />
                                    }
                                    key={key}>
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.bold}>
                                            {usr.lastname} {usr.firstname}
                                        </ListItem.Title>
                                        <ListItem.Subtitle>
                                            {usr.email}
                                        </ListItem.Subtitle>
                                        <ListItem.Subtitle>
                                            {usr.phone}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem.Swipeable>
                            }
                        </View>
                    )
                })}
            </View>
            {/* List deactivated users */}
            <View style={styles.header}>
                {deactivatedUsers.length > 0 && <Title style={styles.title}> 
                {deactivatedUsers.length} deactivated users</Title>}
                {deactivatedUsers.map((user, key) => {
                    return (
                        <ListItem.Swipeable
                            rightContent={
                                <Button
                                    title="Activate"
                                    onPress={() => { setUserToActivate(user); setModalVisibleActivate(true) }}
                                    color='green'
                                />
                            }
                            key={key}>
                            <ListItem.Content>
                                <ListItem.Title style={styles.bold}>
                                    {user.lastname} {user.firstname}
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    {user.email}
                                </ListItem.Subtitle>
                                <ListItem.Subtitle>
                                    {user.phone}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem.Swipeable>
                    )
                })}
            </View>

            {/* User deactivation modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDeactivate}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView]}>
                        <Title>Deactivate user</Title>
                        <Subheading>You are about to deactivate the user:</Subheading>
                        <Text></Text>
                        <Text></Text>
                        <Text>{userToDeactivate && userToDeactivate.lastname + ' ' + userToDeactivate.firstname}</Text>
                        <Text></Text>
                        <Text></Text>
                        <Text>Are you sure ?</Text>
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisibleDeactivate(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => deactivateUser(userToDeactivate)}
                            >
                                <Text style={styles.textStyle}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* User activation modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleActivate}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView]}>
                        <Title>Activate user</Title>
                        <Subheading>You are about to activate the user:</Subheading>
                        <Text></Text>
                        <Text></Text>
                        <Text>{userToActivate && userToActivate.lastname + ' ' + userToActivate.firstname}</Text>
                        <Text></Text>
                        <Text></Text>
                        <Text>Are you sure ?</Text>
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisibleActivate(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => activateUser(userToActivate)}
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