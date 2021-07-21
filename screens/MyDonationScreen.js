import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader.js';
import firebase from 'firebase';
import db from '../config.js';
import { RFValue } from 'react-native-responsive-fontsize';

export default class MyDonationScreen extends Component {
  constructor() {
    super();
    this.state = {
      donorId: firebase.auth().currentUser.email,
      donorName: '',
      allDonations: [],
    };
    this.requestRef = null;
  }

  static navigationOptions = { header: null };

  getDonorDetails = (donorId) => {
    db.collection('assigned_tasks')
      .where('user_id', '==', donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };

  getAllDonations = () => {
    this.requestRef = db
      .collection('assigned_tasks')
      .where('user_id', '==', this.state.donorId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation['doc_id'] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.task_status === 'completed') {
      var taskStatus = 'Donor Interested';
      db.collection('all_donations').doc(bookDetails.doc_id).update({
        task_status: 'Donor Interested',
      });
      //this.sendNotification(bookDetails, taskStatus);
    } else {
      var taskStatus = 'completed';
      db.collection('all_donations').doc(bookDetails.doc_id).update({
        task_status: 'completed',
      });
     // this.sendNotification(bookDetails, taskStatus);
    }
  };

  sendNotification = (bookDetails, taskStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;
    db.collection('all_notifications')
      .where('request_id', '==', requestId)
      .where('donor_id', '==', donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (taskStatus === 'completed') {
            message = this.state.donorName + ' sent you book';
          } else {
            message =
              this.state.donorName + ' has completed his/her task.  ';
          }
          db.collection('all_notifications').doc(doc.id).update({
            message: message,
            notification_status: 'unread',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.book_name}
      subtitle={
        'Requested By : ' +
        item.requested_by +
        '\nStatus : ' +
        item.task_status
      }
      leftElement={<Icon name="tasks" type="font-awesome" color="#696969" />}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      /*rightElement={
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                item.task_status === 'completed' ? 'green' : '#ff5722',
            },
          ]}
          onPress={() => {
            this.sendBook(item);
          }}>
          <Text style={{ color: '#ffff' }}>
            {item.task_status === 'completed' ? 'completed' : 'Send Book'}
          </Text>
        </TouchableOpacity>
      }*/
      bottomDivider
    />
  );

  componentDidMount() {
    this.getDonorDetails(this.state.donorId);
    this.getAllDonations();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Tasks" />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: RFValue(20) }}>
                List of all tasks
              </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
