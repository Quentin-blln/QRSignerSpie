import * as React from "react";
import { Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';


export function ProfileIcon( {user} ) {
  const navigation = useNavigation();

  return (
      <Icon.Button
      name="user"
      onPress={()=>{
        navigation.navigate('Profile', user)
      }}
      >
          Profile
      </Icon.Button>
  );
}
