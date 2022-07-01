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

export function NewUserView({ route, navigation }) {

    const [validationModalVisible, setValidationModalVisible] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState('')
    const [emailExist, setEmailExist] = useState(false)
    const [newUserFirstName, setNewUserFirstName] = useState('')
    const [newUserLastName, setNewUserLastName] = useState('')
    const [newUserPhone, setNewUserPhone] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')
    const [newUserPasswordValidation, setNewUserPasswordValidation] = useState('')


      const handleNewUserPost = () =>{
        axios.post(`http://192.168.1.62:3000/signup`, {
            email: newUserEmail,
            password: newUserPassword,
            firstname: newUserFirstName,
            lastname: newUserLastName,
            phone: newUserPhone
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async res => { 
            if(res.status===200){
                alert('User successfully created.')
                console.log("Response user creation: ", res.data)
                setValidationModalVisible(false)
                navigation.navigate('Login')
            }
        })
        .catch(err => {
          if (err.message.includes('400')){
            alert('Wrong informations given.')
          }
          else{
            alert('Echec de communication avec le serveur.')
          }
          console.log(err);
        });
      }

    const handleEmailCheck = () => {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (regexExp.test(newUserEmail)) {
            axios.get(`http://192.168.1.62:3000/checkemailtocreateuser`, {
                headers: { 'Content-Type': 'application/json' },
                params: { email:newUserEmail }
            })
                .then(async res => {
                    if (res.status === 200) {
                        alert('E-mail found !')
                        setEmailExist(true)
                    }
                    else if(res.status===404){
                        alert('E-mail doesnt exist.')
                    }
                })
                .catch(err => {
                    if (err.message.includes('401')) {
                        alert('Email couldnt be found.')
                    }
                    else {
                        alert('Echec de communication avec le serveur.')
                    }
                    console.log(err);
                });
        }
        else {
            alert('This is not a valid e-mail.')
        }
    }

    //Check if all fields are filled and if passwords match before sending the request
    const handleUserInfosCheck = () =>{
        if(newUserFirstName){
            if(newUserLastName){
                if(newUserPhone){
                    if(newUserPassword){
                        if(newUserPassword===newUserPasswordValidation){
                            setValidationModalVisible(true)
                        }
                        else{
                            console.log(newUserPassword, newUserPasswordValidation)
                            alert('Your password validation is not the same as your password.')
                        }
                    }
                    else{
                        alert('Please enter a password.')
                    }
                }
                else{
                    alert('Please enter a phone number.')
                }
            }
            else{
                alert('Please enter your lastname.')
            }
        }
        else{
            alert('Please enter your firstname.')
        }
    }



    return (
        <ScrollView style={styles.container}>
            <View>
                <Title>User creation</Title>
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
                    disabled={emailExist}
                />
                <Button title="Check the e-mail" onPress={()=>{handleEmailCheck()}}/>

                {emailExist&&
                <View>
                    <TextInput
                        label="Firstname"
                        returnKeyType="done"
                        value={newUserFirstName.value}
                        onChangeText={(text) => setNewUserFirstName(text)}
                        error={!!newUserFirstName.error}
                        errorText={newUserFirstName.error}
                    />
                    <TextInput
                        label="Lastname"
                        returnKeyType="done"
                        value={newUserLastName}
                        onChangeText={(text) => setNewUserLastName(text)}
                        error={!!newUserLastName.error}
                        errorText={newUserLastName.error}
                    />
                    <TextInput
                        label="Phone number"
                        returnKeyType="done"
                        value={newUserPhone}
                        onChangeText={(text) => setNewUserPhone(text)}
                        error={!!newUserPhone.error}
                        errorText={newUserPhone.error}
                    />
                    <TextInput
                        label="Password"
                        returnKeyType="done"
                        value={newUserPassword}
                        onChangeText={(text) => setNewUserPassword(text)}
                        error={!!newUserPassword.error}
                        errorText={newUserPassword.error}
                        secureTextEntry
                    />
                    <TextInput
                        label="Password Validation"
                        returnKeyType="done"
                        value={newUserPasswordValidation}
                        onChangeText={(text) => setNewUserPasswordValidation(text)}
                        error={!!newUserPasswordValidation.error}
                        errorText={newUserPasswordValidation.error}
                        secureTextEntry
                    />
                    <Button title="Create user" onPress={()=>{handleUserInfosCheck()}}/>
                </View>
                }
            </View>




            {/* User creation modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={validationModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Title>Create new user</Title>
                        <Text>Please validate your account informations below:</Text>
                        <Text></Text>
                        <Text>E-mail:   {newUserEmail}</Text>
                        <Text>Firstname:   {newUserFirstName}</Text>
                        <Text>Lasntame:   {newUserLastName}</Text>
                        <Text></Text>
                        <View style={styles.ButtonHorizontalAlign}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setValidationModalVisible(!validationModalVisible)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidate]}
                                onPress={() => handleNewUserPost()}
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
