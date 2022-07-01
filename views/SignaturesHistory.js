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

export function SignaturesHistoryView({ route, navigation }) {
    //View that history of every signatures
    const [user, setUser] = useState(route.params.user);
    const [signatures, setSignatures] = useState([])

    //useEffect to get all signatures if user is admin
    useEffect(() => {
        if (user.isAdmin) {
            console.log('trying to get all signatures')
            axios.get('http://192.168.1.62:3000/allsignatures', {
                headers: { 'Content-Type': 'application/json' },
                params: { userID: user.id }
            }).then(resp => {
                //sort response by datetime to get the most recent signatures
                resp.data.signatures.sort((a, b) => {
                    return new Date(b.signature.createdAt) - new Date(a.signature.createdAt)
                })
                console.log('All signatures: ', resp.data)
                setSignatures(resp.data.signatures)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [])

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {signatures.length > 0 && <Title style={styles.title}>Found {signatures.length} signatures</Title>}
                {signatures.map((signature, key) => {
                    return (
                        <ListItem.Swipeable
                            key={key}
                            title={signature.mission.name}
                            subtitle={'test2'}
                            onPress={() => {
                                navigation.navigate('SignatureDetails', { user: user, signature: signature })
                            }}>
                        <ListItem.Content>
                        <ListItem.Title>
                        {signature.mission.name}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                        {signature.mission.company_name}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle>
                        {new Date(signature.signature.createdAt).toLocaleString()}
                        </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem.Swipeable>
                    )
                })}
            </View>
        </ScrollView>
    )

}