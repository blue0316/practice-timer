import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  role: 'athelete',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, role } = this.state;
    const roles = {};

    if (role === 'admin') {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    if (role === 'staff') {
      roles[ROLES.STAFF] = ROLES.STAFF;
    }
    if (role === 'athelete') {
      roles[ROLES.ATHELETE] = ROLES.ATHELETE;
    }

    console.log({ username, email, passwordOne, role })

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state)
  };

  onChangeCheckbox = event => {
    event.persist();
    console.log(event.target.value)
    this.setState({ role: event.target.value });
    console.log(this.state)
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      role,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-control">
          <label className="form-label" htmlFor="username">Username:</label>
          <input
            className="form-input"
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
        </div>
        <div className="form-control">
          <label className="form-label" htmlFor="email">Email:</label>
          <input
            className="form-input"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </div>
        <div className="form-control">
          <label className="form-label" htmlFor="passwordOne">Password:</label>
          <input
            className="form-input"
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="form-control">
          <label className="form-label" htmlFor="passwordTwo">Confirm:</label>
          <input
            className="form-input"
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </div>
        <div className="form-control" onChange={this.onChangeCheckbox}>
          <input
            className="form-input"
            name="role"
            type="radio"
            value="admin"
            defaultChecked={role === "admin"}
          />
          <label className="form-label" htmlFor="isAdmin">
            Admin
          </label>
          <input
            className="form-input"
            name="role"
            type="radio"
            value="staff"
            defaultChecked={role === "staff"}
          />
          <label className="form-label" htmlFor="isStaff">
            Staff
          </label>
          <input
            className="form-input"
            name="role"
            type="radio"
            value="athelete"
            defaultChecked={role === "athelete"}
          />
          <label className="form-label" htmlFor="isAthelete">
            Athelete
          </label>
        </div>
        <button className="form-btn" disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };

