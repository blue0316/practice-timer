import React, { useState } from 'react';
import { useAlert } from 'react-alert';

import config from '../../config';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

const SignUp = (props) => {
  const [name, setName] = useState("");
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

  const signUpDidPress = () => {
    // Attempt to sign the user up here
    validateEmailAndPassword(() => {
      props.firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('user created', user)

          user.updateProfile({displayName: this.state.name})
          user.sendEmailVerification().then(function() {
            // Email sent.
            console.log('EMAIL VERIFICATION SENT')
          }, function(error) {
            console.log('ERROR SENDING VERIFICATION EMAIL', error);
          });
        })
        .catch((err) => {
          useAlert().error(
            'Whoops',
            err.message,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]
          )
        })
    })
  }

  return (
    <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <img src={Logo} style={{ alignSelf: 'center' }} />
      <div>
        <label htmlFor='NAME'>NAME</label>
        <input
          type='text'
          name={`NAME`}
          placeholder={`Enter full name`}
          value={name}
          onChange={event => setName(event.currentTarget.value)}
        />
      </div>
      <div>
        <label htmlFor='EMAIL'>EMAIL</label>
        <input
          type='text'
          name={`EMAIL`}
          placeholder={`Enter email`}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
        />
      </div>
      <div>
        <label htmlFor='PASSWORD'>PASSWORD</label>
        <input
          type="password"
          name={`PASSWORD`}
          placeholder={`Enter password`}
          value={props.password}
          onChange={event => setPassword(event.currentTarget.value)}
        />
      </div>
      <button onClick={signUpDidPress}>
        <span>Continue</span>
      </button>
      <div>
        <span style={{
          color: config.textSecondaryColor,
          fontSize: 12,
        }}>{`ALREADY HAVE AN ACCOUNT? `}</span>
        <Link to="/sign-in">
          <span style={{
            fontSize: 12,
          }}>{`SIGN IN`}</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp