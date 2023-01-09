import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPracticeState, openDrawer } from '../actions';

// import {
//   Alert,
//   View,
//   Image,
//   TouchableHighlight,
//   Navigator
// } from 'react-native'

// import SideMenu from 'react-native-side-menu'

import BackArrow from '../assets/BackArrow.png'
import MenuButton from '../assets/MenuButton.png'

import Text from '../components/StyledText'

// import MainFlowMenu from '../screens/MainFlow/MainFlowMenu'
// import MainFlowHome from '../screens/MainFlow/MainFlowHome'
// import MainFlowPractice from '../screens/MainFlow/MainFlowPractice'
// import MainFlowPeriod from '../screens/MainFlow/MainFlowPeriod'

import firebase from '../services/firebase'; // IS this kosher? Very temporary.

class MainFlow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sideMenuOpen: false
    }

    this._renderScene = this._renderScene.bind(this)
    this._saveAndExit = this._saveAndExit.bind(this)
  }

  _renderChild(route, navigator) {

    const globalNavigatorProps = {
      mainFlowNavigator: navigator,
      firebase: firebase,
      teamId: this.props.teamId,
      teamData: this.props.teamData,
      startPractice: this.props.startPractice,
      ...route.componentProps,
    }

     switch (route.identifier) {
      case "Home":
        return (
          <></>
          // <MainFlowHome {...globalNavigatorProps} />
        )

      case "Practice":
        return (
          <></>
          // <MainFlowPractice
          //   practiceId={route.practiceId}
          //   ref={instance => { this.child = instance; }}
          //   {...globalNavigatorProps}
          //   />
        )

      case "Period":
        return (
          <></>
          // <MainFlowPeriod
          //   practiceData={route.practiceData}
          //   practiceId={route.practiceId}
          //   ref={instance => { this.child = instance; }}
          //   {...globalNavigatorProps}
          //   />
        )

      default:
        return (
          <span>{`YO YOU MESSED SOMETHING UP ${route}`}</span>
      )
    }
  }

  _renderScene(route, navigator) {
    const child = this._renderChild(route, navigator)
    return child
  }

  _saveAndExit() {
    this.child.savePractice().then(() => {
      this.refs.mainFlowNavigator.pop()
    })
  }

  render() {
    return (
      <Navigator
        ref="mainFlowNavigator"
        initialRoute={{ identifier: 'Home' }}
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.FloatFromRight, gestures: {} })}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
                  {
                    if (route.identifier === 'Practice') {
                      return (
                        <TouchableHighlight onPress={() => {
                          if (this.child) {
                            this.child.leftButtonDidPress()
                          }
                          }}
                        underlayColor={null}>
                          <Image style={{
                            height: 24,
                            width: 24,
                            marginLeft: 16
                          }} source={BackArrow} />
                        </TouchableHighlight>
                      );
                    }

                    if (route.identifier === 'Period') {
                      return (
                        <TouchableHighlight onPress={() => {
                          if (this.child) {
                            this.child.leftButtonDidPress()
                          }
                          }}
                        underlayColor={null}>
                          <Image style={{
                            height: 24,
                            width: 24,
                            marginLeft: 16
                          }} source={BackArrow} />
                        </TouchableHighlight>
                      );
                    }

                    if (route.identifier === 'Home') {
                      return (
                        <TouchableHighlight onPress={() => {
                          this.props.onMenuButtonTouch();
                        }}
                        underlayColor={null}>
                          <Image style={{
                            height: 32,
                            width: 32,
                            marginTop: 4,
                            marginLeft: 16
                          }} source={MenuButton} />
                        </TouchableHighlight>
                      );
                    }
                    return null;
                  },
           RightButton: (route, navigator, index, navState) =>
             {
                return null;
              },
           Title: (route, navigator, index, navState) =>
             {
              if (route.identifier === 'Period') {
                return (
                  <Text style={{marginTop: 8}}>{`Edit Period`}</Text>
                )
              }
            },
          }}
        />}
        />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    teamId: state.team.selectedTeam._key,
    teamData: state.team.selectedTeam,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    startPractice: (practiceName, practiceId, practiceSections, travelTimeDuration) => { dispatch(createPracticeState(practiceName, practiceId, practiceSections, travelTimeDuration)) },
    onMenuButtonTouch: () => { dispatch(openDrawer()) },
  };
}

const MainFlowRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainFlow);

export default MainFlowRedux;
