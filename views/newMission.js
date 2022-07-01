import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Button , SafeAreaView} from "react-native";
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

export function NewMissionView({ route, navigation }) {

    const [user, setUser] = useState(route.params);

    const [newMissionName, setNewMissionName] = useState("");
    const [newMissionDescription, setNewMissionDescription] = useState("");
    const [newMissionCompanyName, setNewMissionCompanyName] = useState("");
    const [newMissionCompanyLocation, setNewMissionCompanyLocation] = useState("");
    const [newMissionCompanyContact, setNewMissionCompanyContact] = useState("");
    const [newMissionDate, setNewMissionDate] = useState(new Date(Date.now()));
    const [newMissionSupervisorsIds, setNewMissionSupervisorsIds] = useState([]);
    const [newMissionContributorsIds, setNewMissionContributorsIds] = useState([]);
    const [newMissionSupervisors, setNewMissionSupervisors] = useState([]);
    const [newMissionContributors, setNewMissionContributors] = useState([]);

    const [allUsers, setAllUsers] = useState([])


    useEffect(()=>{
        //Get every users if the user is admin
        axios.get('http://192.168.1.62:3000/allusers',{
            headers:{'Content-Type': 'application/json'},
            params:{email: user.email}
        })
        .then(resp=>{
            for(let usr of resp.data.users){
                usr.name = usr.lastname + ' ' + usr.firstname
            }
            setAllUsers([
                {
                    name: "Users",
                    id:0,
                    children:resp.data.users
                }
            ])
        })
        .catch(err=>console.log(err))
    },[])

    useEffect(()=>{
        let tempL = []
        for(let usr of newMissionSupervisorsIds){
            console.log(usr)
            let found = allUsers[0].children.find(e=> e.id === usr)
            if(found!==undefined){
                tempL.push(found)
            }
        }
        setNewMissionSupervisors(tempL)
    },[newMissionSupervisorsIds])

    useEffect(()=>{
        let tempL = []
        for(let usr of newMissionContributors){
            console.log(usr)
            let found = allUsers[0].children.find(e=> e.id === usr)
            if(found!==undefined){
                tempL.push(found)
            }
        }
        setNewMissionSupervisors(tempL)
    },[newMissionContributorsIds])

    //Check if all fields are filled before sending the request
    const handleCreateMission = () =>{
        if(newMissionName){
            if(newMissionDescription){
                if(newMissionCompanyName){
                    if(newMissionCompanyLocation){
                        if(newMissionCompanyContact){
                            if(newMissionDate){
                                axios.post(`http://192.168.1.62:3000/newmission`, {
                                    email: user.email,
                                    name: newMissionName,
                                    description: newMissionDescription,
                                    company_name: newMissionCompanyName,
                                    company_location: newMissionCompanyLocation,
                                    company_contact: newMissionCompanyContact,
                                    date: newMissionDate,
                                    supervisors: newMissionSupervisorsIds,
                                    contributors: newMissionContributorsIds
                                },{
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  })
                                    .then(async res => {
                                      console.log("New mission response: ", res.data)
                                      if (res.status === 200) {
                                        alert('New mission created successfully!')
                                      } else {
                                        alert('An error occured.')
                                        console.log(res)
                                      }
                                    })
                                    .catch(err => {
                                      if (err.message.includes('500')) {
                                        alert('Couldnt create mission.')
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
                            else{alert('Please enter mission date')}
                        }
                        else{alert('Please enter company contact')}
                    }
                    else{alert('Please enter company location')}
                }
                else{alert('Please enter company name.')}
            }
            else{alert('Please enter mission description.')}
        }
        else{alert('Please enter mission name.')}
    }



    return(
        <ScrollView>
            <Title>Create new mission</Title>
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
            <RNDateTimePicker mode="datetime" display="default" onChange={(event, date)=>setNewMissionDate(new Date(date))} value={new Date(newMissionDate)}/>
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
                onSelectedItemsChange={(list)=>{setNewMissionSupervisorsIds(list)}}
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
                onSelectedItemsChange={(list)=>{setNewMissionContributorsIds(list)}}
                selectedItems={newMissionContributorsIds}
                searchPlaceholderText="Search user..."
            />

            <Text></Text>
            <Button title="Create" onPress={()=>{handleCreateMission()}}/>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
        </ScrollView>
    )
}