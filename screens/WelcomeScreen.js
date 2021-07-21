import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
    };
  }

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('DonateBooks');
        alert('Successful Login!');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#79BBCB' }}>
        <Text
          style={{
            fontSize: RFValue(35),
            paddingLeft: RFValue(10),
            alignSelf: 'center',
            margin: 20,
            color: 'yellow',
            fontFamily: 'bold',
            fontWeight: 'bold',
          }}>
          Task Assignment System
        </Text>
        <Text
          style={{
            fontSize: RFValue(25),
            paddingLeft: RFValue(10),
            alignSelf: 'center',
            color: 'yellow',
            fontFamily: 'bold',
            fontWeight: 'bold',
          }}>
          Login to continue...
        </Text>
        <View>
          <View>
            <TextInput
              style={{
                width: '80%',
                height: RFValue(50),
                borderWidth: 1.5,
                borderColor: '#000',
                fontSize: RFValue(20),
                paddingLeft: RFValue(10),
                alignSelf: 'center',
                margin: 10,
                backgroundColor: '#fff',
              }}
              placeholder="abc@example.com"
              placeholderTextColor="green"
              keyboardType="email-address"
              onChangeText={(text) => {
                this.setState({
                  emailId: text,
                });
              }}
            />
            <TextInput
              style={{
                width: '80%',
                height: RFValue(50),
                borderWidth: 1.5,
                borderColor: '#000',
                fontSize: RFValue(20),
                paddingLeft: RFValue(10),
                alignSelf: 'center',
                margin: 10,
                backgroundColor: '#fff',
              }}
              secureTextEntry={true}
              placeholder="Enter Password"
              placeholderTextColor="green"
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: '50%',
                height: RFValue(60),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: RFValue(5),
                borderWidth: 4,
                backgroundColor: '#7BB33C',
                marginTop: RFValue(20),
                alignSelf: 'center',
              }}
              onPress={() => {
                this.userLogin(this.state.emailId, this.state.password);
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontFamily: 'bold',
                  fontWeight: 'bold',
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Image
            source={require('../assets/task.jpg')}
            style={{
              width: 300,
              height: 180,
              alignSelf: 'center',
              marginTop: 10,
            }}
          />
        </View>
      </View>
    );
  }
}
