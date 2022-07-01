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

export function SignatureDetailsView({ route, navigation }) {
    //View that history of every signatures
    const [user, setUser] = useState(route.params.user);
    const [signature, setSignature] = useState(route.params.signature)

    return(
        <ScrollView style={styles.container}>
            <View style={[styles.header, styles.border, styles.textMargin, styles.marginTop]}>
                <Text></Text>
                <Title style={styles.title}>{signature.mission.name}</Title>
                <Text></Text>
                <Subheading style={[styles.textMargin, styles.title]}>
                    Company: {signature.mission.company_name}
                </Subheading>
                <Subheading style={[styles.textMargin, styles.title]}>
                    Done at: {new Date(signature.signature.createdAt).toLocaleString()}
                </Subheading>
                <Subheading style={[styles.textMargin, styles.title]}>
                    Is the mission finished: {signature.mission.isDone ? 'Yes' : 'No'}
                </Subheading>
                <Text></Text>
                <Text></Text>
                <Subheading style={[styles.textMargin, styles.title]}>Signature supervisor:</Subheading>
                <Text style={[styles.textMargin, styles.title]}>{signature.supervisor.lastname+ ' ' + signature.supervisor.firstname}</Text>
                <Text style={[styles.textMargin, styles.title]}>{signature.supervisor.email}</Text>
                <Text></Text>
                <Text></Text>
                <Subheading style={[styles.textMargin, styles.title]}>Signature contributor</Subheading>
                <Text style={[styles.textMargin, styles.title]}>{signature.contributor.lastname+ ' ' + signature.contributor.firstname}</Text>
                <Text style={[styles.textMargin, styles.title]}>{signature.contributor.email}</Text>
                <Text></Text>
                <Text></Text>
                <Subheading style={[styles.textMargin, styles.title]}>Signature comment:</Subheading>
                <Text style={[styles.textMargin, styles.title]}>{signature.signature.comment}</Text>
            </View>
        </ScrollView>
    )
}