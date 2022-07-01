import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginView } from './views/Login';
import { MissionsView } from './views/Missions';
import { DoneMissionsView } from './views/DoneMissions';
import { ProfileView } from './views/Profile';
import {QRCodeScannerView} from './views/QRScannerView'
import { Mission, MissionView } from './views/Mission'
import {NewUserView} from './views/newUser'
import { NewMissionView } from './views/newMission';
import { EditMissionView } from './views/EditMission';
import { DoneMissionView } from './views/DoneMission';
import { OfflineDatasView } from './views/OfflineDatas';
import { SignaturesHistoryView } from './views/SignaturesHistory';
import { SignatureDetailsView } from './views/SignatureDetails';
import { AllUsersView } from './views/AllUsers';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="Login"
            component={LoginView}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="Missions"
            component={MissionsView}
            options={{ title: "Missions" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileView}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="DoneMissions"
            component={DoneMissionsView}
            options={{ title: "Done Missions" }}
          />
          <Stack.Screen
            name="Mission"
            component={MissionView}
            options={{ title: "Mission" }}
          />
          <Stack.Screen
            name="QRScanner"
            component={QRCodeScannerView}
            options={{ title: "QRScanner" }}
          />
          <Stack.Screen
            name="NewUser"
            component={NewUserView}
            options={{ title: "New User" }}
          />
          <Stack.Screen
            name="NewMission"
            component={NewMissionView}
            options={{ title: "New Mission" }}
          />
          <Stack.Screen
            name="EditMission"
            component={EditMissionView}
            options={{ title: "Edit Mission" }}
          />
          <Stack.Screen
            name="DoneMission"
            component={DoneMissionView}
            options={{ title: "Mission" }}
          />
          <Stack.Screen
            name="OfflineDatas"
            component={OfflineDatasView}
            options={{ title: "Offline Datas" }}
          />
          <Stack.Screen
            name="SignaturesHistory"
            component={SignaturesHistoryView}
            options={{ title: "Signatures History" }}
          />
          <Stack.Screen
            name="SignatureDetails"
            component={SignatureDetailsView}
            options={{ title: "Signature Details" }}
          />
          <Stack.Screen
            name="AllUsers"
            component={AllUsersView}
            options={{ title: "All Users" }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
