import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import SelectTeam from '../Team';
import AdminPage from '../Admin';
import NewTeam from '../Team/NewTeam';

import { PracticeList, PracticeNew } from '../Practice';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <main className="main">
      <Navigation />
      <div className="container">

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.TEAM} component={SelectTeam} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.NEW_TEAM} component={NewTeam} />
        <Route exact path={ROUTES.PRACTICE_LIST} component={PracticeList} />
        <Route exact path={ROUTES.PRACTICE_NEW} component={PracticeNew} />
      </div>
    </main>
  </Router>
);

export default withAuthentication(App);
