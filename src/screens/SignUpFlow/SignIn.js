import React, { useState } from 'react';
import { useAlert } from 'react-alert';

import config from '../../config';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmailAndPassword = (callback) => {
    if (email === null ||  !/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      displayInvalidCredentialsAlert('Invalid email address.')
      return;
    }

    if (password === null) {
      displayInvalidCredentialsAlert('Password cannot be left blank.')
      return;
    }
    callback()
  }

  const displayInvalidCredentialsAlert = (errorText) => {
    useAlert().error(
      'Whoops',
      errorText,
      [
        {text: 'OK', onClick: () => console.log('OK Clicked')},
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
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]
        )
      })
    });
  }

  return (
    <div style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <img src={Logo} style={{alignSelf: 'center'}}  />
      <div>
        <label 
          htmlFor='EMAIL'
        >EMAIL</label>
        <input
          type='text'
          name='EMAIL'
          placeholder={`Enter email`}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
        />
      </div>
      <div>
        <label 
          htmlFor='PASSWORD'
        >PASSWORD</label>
        <input
          type='password'
          name={`PASSWORD`}
          placeholder={`Enter password`}
          value={password}
          onChange={event => setPassword(event.currentTarget.value)}
        />
      </div>
      <button onClick={signInDidPress}>
        <span>Sign In</span>
      </button>
      <div>
        <span style={{
          color: config.textSecondaryColor,
          fontSize: 12,
        }}>{`DON'T HAVE AN ACCOUNT? `}</span>
        <Link to={'/sign-up'}>
          <span style={{
            fontSize: 12,
          }}>{`SIGN UP`}</span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn