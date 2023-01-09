import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MainFlow from '../flows/MainFlow';

const Container = ({ dispatch, nav }) => {
  useEffect(() => {
    // Update the navigation state when the `nav` prop changes
    dispatch({ type: 'UPDATE_NAVIGATION_STATE', nav });
  }, [nav]);

  let screen;
  switch (nav) {
    case 'Home':
      screen = <MainFlow />;
      break;
    default:
      screen = null;
  }

  return (
    <div>
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