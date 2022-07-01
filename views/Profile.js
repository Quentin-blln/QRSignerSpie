import React, { useState, useEffect } from "react";
import { Linking, Text, View, StyleSheet, Modal, Pressable } from "react-native";
import { Title, Subheading, List } from "react-native-paper"
import { useNavigation } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../stylesheet";
import { Logout } from "../components/Logout";
import { ProfileIcon } from "../components/ProfileIcon";
import TextInput from '../components/TextInput'
import Button from "../components/Button";
import Logo from '../components/Logo'
import Background from "../components/Background";

const axios = require('axios')

export function ProfileView({ route, navigation }) {

    const [user, setUser] = useState(route.params);
    const [modalNewUserVisible, setModalNewUserVisible] = useState(false)
    const [modalNewUserValidationVisible, setModalNewUserValidationVisible] = useState(false)
    const [modalUpdatePasswordVisible, setModalUpdatePasswordVisible] = useState(false)
    const [modalUpdatePhoneNumberVisible, setModalUpdatePhoneNumberVisible] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState("")
    const [updatePassOld, setUpdatePassOld] = useState("")
    const [updatePassNew, setUpdatePassNew] = useState("")
    const [updatePassNewValidation, setUpdatePassNewValidation] = useState("")
    const [updatePhoneNumber, setUpdatePhoneNumber] = useState("")



    const handleNewUserEmailPost = () => {
        axios.post(`http://192.168.1.62:3000/addusertocreate`, {
            userID: user.id,
            email: newUserEmail
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(async res => {
                if (res.status === 200) {
                    alert('E-mail added.')
                    console.log("REPONSE POST MISSION DONE: ", res.data)
                }
            })
            .catch(err => {
                if (err.message.includes('401')) {
                    alert('Mission couldnt be validated.')
                }
                else {
                    alert('Echec de communication avec le serveur.')
                }
                console.log(err);
            });
    }

    const handleEmailCheck = () => {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (regexExp.test(newUserEmail)) {
            setModalNewUserValidationVisible(true)
            setModalNewUserVisible(false)
        }
        else {
            alert('This is not a valid e-mail.')
        }
    }

    const handleChangePassword = () => {
        if (updatePassNew && updatePassNewValidation && updatePassNew === updatePassNewValidation) {
            axios.post(`http://192.168.1.62:3000/updatepassword`, {
                email: user.email,
                oldpassword: updatePassOld,
                newpassword: updatePassNew
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(async res => {
                    if (res.status === 200) {
                        alert('Password updated Successfully.')
                        console.log("REPONSE POST MISSION DONE: ", res.data)
                    }
                })
                .catch(err => {
                    if (err.message.includes('401')) {
                        alert('Mission couldnt be validated.')
                    }
                    else {
                        alert('Echec de communication avec le serveur.')
                    }
                    console.log(err);
                });
        }
    }

    //Function that update user phone number
    const handleChangePhoneNumber = () => {
        axios.post(`http://192.168.1.62:3000/updatephonenumber`, {
            email: user.email,
            newPhoneNumber: updatePhoneNumber
        },
        {   headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => {
            if (res.status === 200) {
                let tempUser = user
                tempUser.phone = updatePhoneNumber
                setUser(tempUser)
                alert('Phone number updated successfully.')
                setModalUpdatePhoneNumberVisible(false)
                console.log("Response phone update request: ", res.data)
            }
        }
        ).catch(err => {
            if (err.message.includes('401')) {
                alert('Couldnt update phone number')
            }
            else {
                alert('Echec de communication avec le serveur.')
            }
            console.log(err);
        })
    }


    return (
        <Background style={[styles.container]}>
            <View style={{marginTop:-100}}>
                <Logo />
            </View>
            {user ?
                <View style={[styles.marginTop, styles.border, {width:300, marginTop:10, paddingVertical:10}]}>
                    <View style={styles.ButtonHorizontalAlign}>
                        <Subheading style={{fontWeight:'bold'}}>User:</Subheading>
                        <Subheading >{user.firstname} {user.lastname}</Subheading>
                    </View>
                    <View style={styles.ButtonHorizontalAlign}>
                        <Subheading style={{fontWeight:'bold'}}>E-mail:</Subheading>
                        <Subheading >{user.email}</Subheading>
                    </View>
                    <View style={styles.ButtonHorizontalAlign}>
                        <Subheading style={{marginLeft:-20, fontWeight:'bold'}}>Role:</Subheading>
                        <Subheading >{user.isAdmin ? 'Admin' : 'Supervisor / Contributor'}</Subheading>
                    </View>
                    <View style={styles.ButtonHorizontalAlign}>
                        <Subheading style={{marginLeft:-20, fontWeight:'bold'}}>Phone:</Subheading>
                        <Subheading >{user.phone}</Subheading>
                    </View>
                </View>
                :
                <Text>Vous devez être connecté.</Text>
            }
            <Button onPress={() => { setModalUpdatePasswordVisible(true) }}>Change password</Button>
            <Button onPress={() => { setModalUpdatePhoneNumberVisible(true) }}>Change phone number</Button>

            {user.isAdmin && !user.isDeactivated &&
                <View>
                    <Button onPress={() => { setModalNewUserVisible(!modalNewUserVisible) }}>   Create new user</Button>
                    <Button onPress={() => { navigation.navigate('SignaturesHistory',{user:user}) }}>Signatures history</Button>
                    <Button onPress={() => { navigation.navigate('AllUsers',{user:user}) }}>      See all users</Button>

                </View>

            }

            {/* User creation modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalNewUserVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Title>Create new user</Title>
                        <Text style={styles.title}>To create new user, define the e-mail here, then the user will have to complete his account via the login page.</Text>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={newUserEmail}
                            onChangeText={(text) => setNewUserEmail(text)}
                            error={!!newUserEmail.error}
                            errorText={newUserEmail.error}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                        />
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalNewUserVisible(!modalNewUserVisible)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => { handleEmailCheck() }}
                            >
                                <Text style={styles.textStyle}>Validate</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* User creation validation modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalNewUserValidationVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Title>Create new user</Title>
                        <Subheading>You are about to create an account for the e-mail:</Subheading>
                        <Text></Text>
                        <Text>{newUserEmail}</Text>
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => { setModalNewUserValidationVisible(false); setModalNewUserVisible(true) }}
                            >
                                <Text style={styles.textStyle}>Back</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => { handleNewUserEmailPost(); setModalNewUserValidationVisible(false) }}
                            >
                                <Text style={styles.textStyle}>Validate</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Password update */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalUpdatePasswordVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Title>Change password</Title>
                        <Subheading>You are about to change your account password:</Subheading>
                        <Text>Please enter your previous and new password.</Text>
                        <Text></Text>
                        <TextInput
                            label="Old Password"
                            returnKeyType="done"
                            value={updatePassOld}
                            onChangeText={(text) => setUpdatePassOld(text)}
                            error={!!updatePassOld.error}
                            errorText={updatePassOld.error}
                            secureTextEntry
                        />
                        <TextInput
                            label="New Password"
                            returnKeyType="done"
                            value={updatePassNew}
                            onChangeText={(text) => setUpdatePassNew(text)}
                            error={!!updatePassNew.error}
                            errorText={updatePassNew.error}
                            secureTextEntry
                        />
                        <TextInput
                            label="New Password Validation"
                            returnKeyType="done"
                            value={updatePassNewValidation}
                            onChangeText={(text) => setUpdatePassNewValidation(text)}
                            error={!!updatePassNewValidation.error}
                            errorText={updatePassNewValidation.error}
                            secureTextEntry
                        />
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => { setModalUpdatePasswordVisible(false) }}
                            >
                                <Text style={styles.textStyle}>Back</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => { handleChangePassword(); setModalUpdatePasswordVisible(false) }}
                            >
                                <Text style={styles.textStyle}>Validate</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Phone number update */}
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalUpdatePhoneNumberVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Title>Change phone number</Title>
                        <Subheading style={styles.title}>You are about to change your account phone number:</Subheading>
                        <Text>Please enter new phone number.</Text>
                        <Text></Text>
                        <TextInput
                            label="Phone number"
                            returnKeyType="done"
                            value={updatePhoneNumber}
                            onChangeText={(text) => setUpdatePhoneNumber(text)}
                            error={!!updatePhoneNumber.error}
                            errorText={updatePhoneNumber.error}
                        />
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => { setModalUpdatePasswordVisible(false) }}
                            >
                                <Text style={styles.textStyle}>Back</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => handleChangePhoneNumber()}
                            >
                                <Text style={styles.textStyle}>Validate</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </Background>
    );
}
