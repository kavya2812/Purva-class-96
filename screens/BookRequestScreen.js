import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize';

export default class CreateTaskScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      taskName: '',
      description: '',
      category: '',
      completeTillDate: '',
      task_status: '',
      requestId: '',
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addAssignment = (taskName, description, category, completeTillDate) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection('assigned_tasks').add({
      user_id: userId,
      task_name: taskName,
      description: description,
      category: category,
      complete_till_date: completeTillDate,
      task_status: 'incomplete',
      request_id: randomRequestId,
    });

    this.setState({
      taskName: '',
      description: '',
      category: '',
      completeTillDate: '',
    });

    return alert('Task Added Successfully');
  };
  componentDidMount() {
    console.log(this.state.userId);
  }

  render() {
    return (
      // <View style={{ flex: 1 }}>
      //   {this.state.userId === "teacher@whj.com" ? (
      <View>
        <MyHeader title="Create Task" />
        {this.state.userId === 'teacher@whj.com' ? (
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder={'Name of Task'}
              onChangeText={(text) => {
                this.setState({
                  taskName: text,
                });
              }}
              value={this.state.taskName}
            />
            <TextInput
              style={[styles.formTextInput, { height: RFValue(100) }]}
              multiline
              numberOfLines={8}
              placeholder={'Description'}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                });
              }}
              value={this.state.description}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Category'}
              onChangeText={(text) => {
                this.setState({
                  category: text,
                });
              }}
              value={this.state.category}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Complete till date'}
              onChangeText={(text) => {
                this.setState({
                  completeTillDate: text,
                });
              }}
              value={this.state.completeTillDate}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addAssignment(
                  this.state.taskName,
                  this.state.description,
                  this.state.category,
                  this.state.completeTillDate
                );
              }}>
              <Text>Assign</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        ) : (
          <View
          style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'center',
                alignSelf: 'center'
              }}>
            <Text
            style={{fontSize: 20}}
              >
              {' '}
              You don't have access 🚫
            </Text>
          </View>
        )}
      </View>

      //) : (
      //   <View>
      // <Text> You do not have access </Text>
      //</View>
      // )
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: 10,
  },
  button: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#FFF0DF',
    marginTop: RFValue(20),
  },
});
