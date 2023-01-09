import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Splash from '../components/Splash';
import SignUpFlow from '../flows/SignUpFlow';
import TeamSelectionFlow from '../flows/TeamSelectionFlow';
import MainFlowCurrentPracticePlayback from '../screens/MainFlow/MainFlowCurrentPracticePlayback';
import Drawer from './Drawer';
import TimerBar from './TimerBar';

const Container = ({ dispatch, nav }) => {
  useEffect(() => {
    // Update the navigation state when the `nav` prop changes
    dispatch({ type: 'UPDATE_NAVIGATION_STATE', nav });
  }, [nav]);

  let screen;
  switch (nav) {
    case 'Load':
      screen = <Splash />;
      break;
    case 'Login':
      screen = <SignUpFlow />;
      break;
    case 'Team':
      screen = <TeamSelectionFlow />;
      break;
    case 'Main':
      screen = <Drawer />;
      break;
    case 'Timer':
      screen = <MainFlowCurrentPracticePlayback />;
      break;
    default:
      screen = null;
  }

  return (
    <div>
      {nav === 'Main' ? <TimerBar /> : null}
      {screen}
    </div>
  );
};

Container.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    nav: state.nav,
  };
};

export default connect(mapStateToProps)(Container);