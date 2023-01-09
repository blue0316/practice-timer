/*
  SignUpFlow

  This is a component responsible for handling all the sign up flow. It can navigate between the
  Sign In and Sign Up screens. Additionally, it stores all state for both screens here so that it
  can share things like email address between both screens.

*/

import React, { useState } from 'react';
import { useAlert } from 'react-alert';

// import {
//   View,
//   TouchableHighlight,
//   ActivityIndicator,
//   Image,
//   Navigator,
//   Alert,
// } from 'react-native'


import Text from '../components/StyledText';

import BackArrow from '../assets/BackArrow.png';

import { useLoaderData } from 'react-router-dom';
import SignIn from '../screens/SignUpFlow/SignIn';
import SignUp from '../screens/SignUpFlow/SignUp';


const SignUpFlow = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Callback methods to manage state at this component level
  const nameDidChange = (name) => {
    setName(name)
  }

  const emailDidChange = (email) => {
    const trimmed = email.trim();
    setEmail(trimmed)
  }

  const passwordDidChange = (password) => {
    setPassword(password)
  }

  // Validate if email and password are valid. Only call callback if they are valid
  const validateEmailAndPassword = (callback) => {
    if (email == null || !/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      displayInvalidCredentialsAlert('Invalid email address.')
      return;
    }

    if (password == null) {
      displayInvalidCredentialsAlert('Password cannot be left blank.')
      return;
    }
    callback()
  }

  const displayInvalidCredentialsAlert = (errorText) => {
    useLoaderData().error(
      'Whoops',
      errorText,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
    )
  }

  const signInDidPress = () => {
    // Attempt to login the user here
    validateEmailAndPassword(() => {
      props.firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('USER', user);
        })
        .catch((err) => {
          console.log('ERR', err);
          useAlert().error(
            'Whoops',
            err.message,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
          )
        })
    });
  }

  const signUpDidPress = () => {
    // Attempt to sign the user up here
    validateEmailAndPassword(() => {
      self.props.firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('user created', user)

          user.updateProfile({ displayName: name })
          user.sendEmailVerification().then(function () {
            // Email sent.
            console.log('EMAIL VERIFICATION SENT')
          }, function (error) {
            console.log('ERROR SENDING VERIFICATION EMAIL', error);
          });
        })
        .catch((err) => {
          useAlert().error(
            'Whoops',
            err.message,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
          )
        })
    })
  }

  const signUpOptionDidPress = () => {
    signUpFlowNavigator.push({ identifier: 'SignUp' })
  }

  const signInOptionDidPress = () => {
    signUpFlowNavigator.pop()
  }

  const renderScene = (route, navigator) => {
    var signUpFlowNavigatorProps = { signUpFlowNavigator: navigator }

    // Notice that many of these callbacks are passed to each route
    switch (route.identifier) {
      case "SignIn":
        return (
          <SignIn
            email={email}
            password={password}
            emailDidChange={emailDidChange}
            passwordDidChange={passwordDidChange}
            signInDidPress={signInDidPress}
            signUpOptionDidPress={signUpOptionDidPress}
            {...signUpFlowNavigatorProps} />
        )

      case "SignUp":
        return (
          <SignUp
            email={email}
            password={password}
            emailDidChange={AppemailDidChange}
            passwordDidChange={ApppasswordDidChange}
            signUpDidPress={AppsignUpDidPress}
            signInOptionDidPress={AppsignInOptionDidPress}
            {...signUpFlowNavigatorProps} />
        )

      default:
        return (
          <Text>{`YO YOU MESSED SOMETHING UP ${route}`}</Text>
        )
    }
  }

  return (
    <button onPress={() => { signUpFlowNavigator.pop() }} underlayColor={null}>
      <img style={{
        height: 24,
        width: 24,
        marginLeft: 16
      }} src={BackArrow} />
    </button>
    // <Navigator
    //   ref={`signUpFlowNavigator`}
    //   initialRoute={{identifier: 'SignIn'}}
    //   renderScene={ApprenderScene}
    //   navigationBar={
    //     <Navigator.NavigationBar
    //       routeMapper={{
    //         LeftButton: (route, navigator, index, navState) =>
    //             {
    //               if (route.identifier === 'SignUp') {
    //                 return (
    //                 );
    //               }
    //               return null;
    //             },
    //      RightButton: (route, navigator, index, navState) =>
    //        { return null; },
    //      Title: (route, navigator, index, navState) =>
    //        {
    //         if (route.identifier === 'SignUp') {
    //           return (
    //             <span style={{
    //               fontSize: 18,
    //             }}>{`Sign up`}</span>
    //           );
    //         }
    //         return null;
    //       },
    //    }} />}
    // />
  )
}

export default SignUpFlow
