import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button } from "react-native";
import { Text } from "react-native-paper"
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
import { useIsFocused } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient'; // Only if no expo



const axios = require('axios')

export function DoneMissionsView({ route, navigation }) {

    const [user, setUser] = useState(route.params);
    const [missions, setMissions] = useState([])

    const isFocused = useIsFocused();

    //Get all done missions
    useEffect(() => {
        if (user.isAdmin) {
            axios.get('http://192.168.1.62:3000/alldonemissions', {
                headers: { 'Content-Type': 'application/json' },
                params: { userID: user.id }
            })
                .then(resp => {
                    console.log(resp.data)
                    setMissions(resp.data.missions)
                })
                .catch(err => console.log(err))
        }
    }, [route, isFocused])

    //Set header buttons
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Missions",
            headerRight: () => <ProfileIcon user={user} />
        });
    }, [navigation]);

    return (
        // <Background>
        <ScrollView>
            {user.isAdmin &&
                <Text style={{ textAlign: "center" }}>Your account has admin rights. Here are all done missions.</Text>
            }


            {missions.map((mission, index) =>
                <ListItem.Swipeable
                    onPress={() => navigation.navigate('DoneMission', { user: user, mission: mission })}
                    bottomDivider
                    key={index}
                // rightContent={
                //     <Button
                //     title="Delete"
                //     onPress={() => deleteLink(link)}
                //     />
                //     }
                >
                    <ListItem.Content>
                        <ListItem.Title>
                            {mission.name}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {mission.company_name}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle>
                            {new Date(mission.date).toLocaleString()}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            )}
        </ScrollView>
        // </Background>
    );
}
