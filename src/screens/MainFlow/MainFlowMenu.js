import React, { Component } from 'react';

// import {
//   View,
//   Image,
//   TouchableHighlight,
//   StyleSheet
// } from 'react-native'

import Text from '../../components/StyledText'
import Spacer from '../../components/Spacer'

import Profile from '../../assets/Profile.png'

const styles = StyleSheet.create({
  headerText: {
    color: '#000'
  },
  header: {
    marginTop: 30,
    height: 60,
    flexDirection: 'row'
  },
  mainContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 30,
  },
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  row: {
   flexDirection: 'row',
   margin: 8
  },
  menuItemText: {
    color: '#b2b2b2',
  }
});

const menuOptions = [
  {
    title: 'Home',
    icon: Profile
  },
  {
    title: 'Profile',
    icon: Profile
  },
  {
    title: 'Manage Staff',
    icon: Profile
  },

  {
    title: 'Scripts',
    icon: Profile
  },
  {
    title: 'Help',
    icon: Profile
  },
]

class MainFlowMenu extends Component {

  constructor(props) {
    super(props);

    //var user = this.props.firebase.auth().currentUser;

    // this.state = {
    //   user: user
    // }  
  }

  render () {
    return (
      <div style={styles.container}>
        <div style={styles.mainContainer}>
          {menuOptions.map((option) => {
            return (
              <div key={option.title} style={styles.row}>
                <Text secondary={true} style={styles.menuItemText}>{option.title}</Text>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

module.exports = MainFlowMenu
