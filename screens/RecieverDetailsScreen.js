import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import db from '../config.js';

export default class RecieverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      recieverId: this.props.navigation.getParam('details')['user_id'],
      requestId: this.props.navigation.getParam('details')['request_id'],
      bookName: this.props.navigation.getParam('details')['task_name'],
      reason_for_requesting: this.props.navigation.getParam('details')[
        'description'
      ],
      category: this.props.navigation.getParam('details')['category'],
      date: this.props.navigation.getParam('details')['complete_till_date'],
      recieverName: '',
      recieverRequestDocId: '',
    };
  }

  getRecieverDetails() {
    /*db.collection('assigned_tasks')
      .where('user_id', '==', this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverName: doc.data().first_name,
          });
        });
      });*/

    db.collection('assigned_tasks')
      .where('request_id', '==', this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id);
          this.setState({
            recieverRequestDocId: doc.id,
          });
        });
      });
    // console.log(this.state.recieverRequestDocId)
  }

  getUserDetails = (userId) => {
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().user_id,
          });
        });
      });
  };

  updateBookStatus = () => {
    console.log('US' + this.state.recieverRequestDocId);
    db.collection('assigned_tasks')
      .doc(this.state.recieverRequestDocId)
      .update({
        task_name: this.state.bookName,
        //   request_id: this.state.requestId,
        requested_by: this.state.recieverName,
        donor_id: this.state.userId,
        task_status: 'Completed',
      });
  };

  addNotification = () => {
    var message =
      this.state.userName + ' has completed the task assigned to him/her.';
    db.collection('all_notifications').add({
      targeted_user_id: this.state.recieverId,
      //  donor_id: this.state.userId,
      //request_id: this.state.requestId,
      task_name: this.state.bookName,
      //  date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: 'unread',
      message: message,
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userId);
    console.log(this.state.requestId);
    console.log(this.state.bookName);
    console.log(this.state.recieverId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#000"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: 'Donate Books',
              style: {
                color: '#000',
                fontSize: RFValue(20),
                fontWeight: 'bold',
              },
            }}
            backgroundColor="#FFF0DF"
          />
        </View>
        <View style={{ flex: 0.9 }}>
          <View
            style={{
              paddingTop: RFValue(30),
            }}>
            <View
              style={{
                flex: 0.6,
                marginLeft: 10
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: RFValue(35),
                }}>
                Task Name: {this.state.bookName}
              </Text>

              <Text
                style={{
                  fontWeight: '400',
                  fontSize: RFValue(25),
                  marginTop: RFValue(15),
                }}>
                Discription: {this.state.reason_for_requesting}
              </Text>

              <Text
                style={{
                  fontWeight: '400',
                  fontSize: RFValue(25),
                  marginTop: RFValue(15),
                }}>
                Category: {this.state.category}
              </Text>

              <Text
                style={{
                  fontWeight: '400',
                  fontSize: RFValue(25),
                  marginTop: RFValue(15),
                }}>
                Complete Till Date: {this.state.date}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              padding: RFValue(20),
            }}>
            <View
              style={{
                flex: 0.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.recieverId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate('MyDonations');
                  }}>
                  <Text>Mark as complete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '75%',
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(60),
    backgroundColor: '#FFF0DF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
