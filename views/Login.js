import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Modal, Pressable } from "react-native";
import { Text, Title, Subheading } from "react-native-paper"
import styles from "../stylesheet";
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
const axios = require('axios')

export function LoginView({ navigation }) {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [userConnected, setUserConnected] = useState({});

  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [forgottenPasswordEmail, setForgottenPasswordEmail] = useState('')


  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);
  
  const onLoggedIn = (token, user) => {
    axios.get(`http://192.168.1.62:3000/private`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async res => {
        try {
          if (res.status === 200) {
            setMessage(res.message);
            console.log(res.data.message)
            navigation.navigate('Missions', user)
          }
        } catch (err) {
          console.log(err);
        };
      })
      .catch(err => {
        console.log(err);
      });
  }

  const onSubmitHandler = () => {
    const payload = {
      email,
      name,
      password,
    };
    axios.post(`http://192.168.1.62:3000/login`, payload,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(async res => {
        console.log("submit resp: ", res.data)
        try {
          if (res.status !== 200) {
            setIsError(true);
            setMessage(res.data.message);
            if (res.status === 404) {
              alert('Identifiants non reconnus.')
            }
          } else {
            setUserConnected(res.data.user)
            onLoggedIn(res.data.token, res.data.user);
            setIsError(false);
            setMessage(res.data.message);
          }
        } catch (err) {
          console.log(err);
        };
      })
      .catch(err => {
        if (err.message.includes('404')) {
          alert('Adresse e-mail non reconnu.')
        }
        else if (err.message.includes('401')) {
          alert('Mot de passe erroné.')
        }
        else {
          alert('Echec de communication avec le serveur.')
        }
        console.log(err);
      });
  };

  const handleForgottenPassword = () => {
    axios.post(`http://192.168.1.62:3000/forgotpassword`, { email: forgottenPasswordEmail },{
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(async res => {
        console.log("submit resp: ", res.data)
        if (res.status === 200) {
          alert('Password reset done. Check your mailbox!')
        } else {
          alert('An error occured.')
          console.log(res)
        }
      })
      .catch(err => {
        if (err.message.includes('500')) {
          alert('Couldnt reset password')
          console.log(err.message)
        }
        else if (err.message.includes('401')) {
          alert('Mot de passe erroné.')
        }
        else {
          alert('Echec de communication avec le serveur.')
        }
        console.log(err);
      });
  }

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail(text)}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => setForgotPasswordModalVisible(!forgotPasswordModalVisible)}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onSubmitHandler}>
        Login
      </Button>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('NewUser')}>
          <Text style={styles.link}>Complete your account</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop:30}}>
        <Button onPress={() => navigation.navigate('OfflineDatas')}>
          Offline Datas
        </Button>
      </View>

      {/* Forgotten password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotPasswordModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <Title>Forgotten Password</Title>
            <Text>After confirm, you will receive an e-mail with you new password.</Text>
            <TextInput
              label="Email"
              returnKeyType="next"
              value={forgottenPasswordEmail}
              onChangeText={(text) => setForgottenPasswordEmail(text)}
              error={!!forgottenPasswordEmail.error}
              errorText={forgottenPasswordEmail.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <View style={styles.ButtonHorizontalAlign}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setForgotPasswordModalVisible(!forgotPasswordModalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonValidate]}
                onPress={() => handleForgottenPassword()}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Background>
  );
}
