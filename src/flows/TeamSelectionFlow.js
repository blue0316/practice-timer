import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectTeam } from '../actions';

// import {
//   View,
//   TouchableHighlight,
//   ActivityIndicator,
//   Image,
//   Navigator,
//   Alert,
// } from 'react-native'


import Text from '../components/StyledText'

import BackArrow from '../assets/BackArrow.png'
import AddButton from '../assets/AddButton.png'
import CancelButton from '../assets/CancelButton.png'

import config from '../config'

import TeamSelection from '../screens/TeamSelectionFlow/TeamSelection'
import AddTeam from '../screens/TeamSelectionFlow/AddTeam'

class TeamSelectionFlow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addTeamName: null,
    }

    this._renderScene = this._renderScene.bind(this);
    this._addTeamButtonPressed = this._addTeamButtonPressed.bind(this)
    this._addTeamNameDidChange = this._addTeamNameDidChange.bind(this)
    this._addTeam = this._addTeam.bind(this)
  }

  _signUpBackButtonPressed() {
    this.props.firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }


  _cancelAddTeamButtonPressed() {

  }

  componentDidMount() {
    // var teamData = {
    //   name: "New Team",
    //   ownerIsSelf : true ,
    //   ownerName : "laxnski@gmail.com",
    //   practiceState : {},
    //   _key : "-Kh-8CjH0BTfduWSyf9X"
    // }

    // this.props.globalNavigator.push({
    //   identifier: 'MainFlow',
    //   teamId: teamData._key,
    //   teamData: teamData
    // })

  }

  _addTeamNameDidChange(addTeamName) {
    this.setState({addTeamName})
  }

  _addTeamButtonPressed() {
    // Temporarily we'll just use an alert. We could do more later

    this.setState({addTeamName: null}) // Clear last team name
    this.refs.teamSelectionFlowNavigator.push({identifier: 'AddTeam', title: 'Add Team'})
  }

  _addTeam()  {
    var user = this.props.firebase.auth().currentUser;
    var teamName = this.state.addTeamName
    var newTeamData = {
      teamName: teamName,
      members: {},
      owner: user.uid,
      ownerName: user.displayName || user.email
    }

    var newTeamKey = this.props.firebase.database().ref().child('teams').push().key;

    var updates = {};
    updates['/teams/' + newTeamKey]  = newTeamData
    updates['/user-teams/' + user.uid + '/' + newTeamKey]  = newTeamData

    return this.props.firebase.database().ref().update(updates);
  }

  _renderScene(route, navigator) {
    var teamSelectionFlowNavigatorProps = { teamSelectionFlowNavigator: navigator, firebase: this.props.firebase}

    if (route.identifier === 'SelectTeam') {
      return (
        <TeamSelection teamDidSelect={this.props.teamDidSelect} {...teamSelectionFlowNavigatorProps} />
      )
    }

    if (route.identifier === 'AddTeam') {
      return (
        <AddTeam
          addTeamName={this.state.addTeamName}
          addTeamNameDidChange={this._addTeamNameDidChange}
          addTeam={this._addTeam}
          {...teamSelectionFlowNavigatorProps}
          />
      )
    }
  }

  render () {
    return (
      <button onPress={() => {this.refs.teamSelectionFlowNavigator.pop()}} underlayColor={null}>
        <img style={{
          height: 24,
          width: 24,
          marginLeft: 16
        }} src={BackArrow} />
      </button>
      // <Navigator
      //   ref={`teamSelectionFlowNavigator`}
      //   initialRoute={{identifier: 'SelectTeam', title: 'Choose Team'}}
      //   renderScene={this._renderScene}
      //   navigationBar={
      //     <Navigator.NavigationBar
      //       routeMapper={{
      //         LeftButton: (route, navigator, index, navState) =>
      //             {
      //               if (route.identifier === 'AddTeam') {
      //                 return (
      //                 );
      //               }

      //               if (this.props.context === 'SignUp') {
      //                 return (
      //                   <TouchableHighlight onPress={() => {this._signUpBackButtonPressed()}} underlayColor={null}>
      //                     <Image style={{
      //                       height: 24,
      //                       width: 24,
      //                       marginLeft: 16
      //                     }} source={BackArrow} />
      //                   </TouchableHighlight>
      //                 );
      //               }

      //               if (this.props.context === 'ChangeTeam') {
      //                 <TouchableHighlight onPress={() => {this._cancelAddTeamButtonPressed()}} underlayColor={null}>
      //                   <Image style={{
      //                     height: 24,
      //                     width: 24,
      //                     marginLeft: 16
      //                   }} source={CancelButton} />
      //                 </TouchableHighlight>
      //               }

      //               return null;
      //             },
      //      RightButton: (route, navigator, index, navState) =>
      //        {
      //           //var user = this.props.firebase.auth().currentUser;
      //           //if (route.identifier !== 'AddTeam' && user.emailVerified ) {
      //             return (
      //             <TouchableHighlight onPress={() => {this._addTeamButtonPressed()}} underlayColor={null}>
      //                     <Image style={{
      //                       height: 24,
      //                       width: 24,
      //                       marginRight: 16
      //                     }} source={AddButton} />
      //                   </TouchableHighlight>)
      //           //}
      //           return null;
      //         },
      //      Title: (route, navigator, index, navState) =>
      //        {
      //           if (route.title !== undefined) {
      //             return (
      //               <Text style={{
      //                 fontSize: 18,
      //               }}>{route.title}</Text>
      //             );
      //           }
      //       },
      //    }} />}
      // />
    )
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    teamDidSelect: (team) => { dispatch(selectTeam(team)) },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamSelectionFlow);
