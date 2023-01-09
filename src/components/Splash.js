import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { login } from '../actions';
import Layout from './Layout';
import Text from './StyledText';

const Splash = (props) => {
  useEffect(() => {
    props.onMount();
  }, []);

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span>Loading...</span>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => { dispatch(login()) }
  };
};

const AuthSplash = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Splash);

export default AuthSplash;