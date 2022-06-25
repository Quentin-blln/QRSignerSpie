import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button } from "react-native";
import { useIsFocused } from "@react-navigation/native";
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


const axios = require('axios')

export function MissionsView({ route, navigation }) {

    const [user, setUser] = useState(route.params);
    const [missions, setMissions] = useState([])
    const [supervisorMissions, setSupervisorMissions] = useState([])
    const [contributorMissions, setContributorMissions] = useState([])

    const isFocused = useIsFocused();

    useEffect(()=>{
        if(user.isAdmin){
            //Get every missions if the user is admin
            axios.get('http://192.168.1.62:3000/allmissions',{
                    headers:{'Content-Type': 'application/json'},
                    params:{userID: user.id}
                })
                .then(resp=>{
                    console.log(resp.data)
                    setMissions(resp.data.missions)
                })
                .catch(err=>console.log(err))
        }
        
        //Get missions where the user is supervisor
        axios.get('http://192.168.1.62:3000/supervisormissions',{
                headers:{'Content-Type': 'application/json'},
                params:{userID: user.id}
            })
            .then(resp=>{
                console.log('Supervisor missions: ', resp.data)
                for(let mis of resp.data.missions){
                    mis.id= mis.mission_id
                }
                setSupervisorMissions(resp.data.missions)
            })
            .catch(err=>console.log(err))

        //Get missions where the user is contributor
        axios.get('http://192.168.1.62:3000/contributormissions',{
            headers:{'Content-Type': 'application/json'},
            params:{userID: user.id}
            })
            .then(resp=>{
                console.log('Contributor missions: ', resp.data)
                for(let mis of resp.data.missions){
                    mis.id= mis.mission_id
                }
                setContributorMissions(resp.data.missions)
            })
            .catch(err=>console.log(err))
    },[route, isFocused])


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Done Missions",
            headerLeft: () => user.isAdmin?<Button onPress={()=>navigation.navigate('DoneMissions', user)} title="Done missions" />:null,
            headerRight: () => <ProfileIcon user={user} />
        });
      }, [navigation]);


  return (
    // <Background>
        <ScrollView>
        
            {/* Every missions as contributor */}
            {contributorMissions.length>0&&
            <Text style={{textAlign:"center"}}>Here are all the missions you have as a contributor.</Text>}
            {contributorMissions.map((mission, index) =>
                <ListItem.Swipeable
                onPress={() => navigation.navigate('Mission', {user: user, mission:mission, role:1})}
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
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            )}
            <Text></Text>

            {/* Every missions as supervisor */}
            {supervisorMissions.length>0&&
            <Text style={{textAlign:"center"}}>Here are all the missions you have as a supervisor.</Text>}
            {supervisorMissions.map((mission, index) =>
                <ListItem.Swipeable
                onPress={() => navigation.navigate('Mission', {user: user, mission:mission, role:2})}
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
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            )}
            <Text></Text>

            {/* Every missions for admin users */}
            {user.isAdmin&&
            <View>
                <Text style={{textAlign:"center"}}>Your account has admin rights. Here are all the missions you can check and edit.</Text>
                <Button title="New mission" onPress={()=>{navigation.navigate('NewMission', user)}}/>
            </View>
            }
            {missions.map((mission, index) =>
                <ListItem.Swipeable
                onPress={() => navigation.navigate('Mission', {user: user, mission:mission, role:3})}
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
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            )}
        </ScrollView>
    // </Background>
  );
}
