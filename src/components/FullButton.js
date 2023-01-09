import React, { Component } from 'react';

import config from '../config';

const styles = {
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: config.textBorderColor,
    borderWidth: 1,
    borderRadius: 29,
    height: 58,
    padding: 8,
    marginTop: 8,
    marginRight: config.gutterWidth,
    marginBottom: 8,
    marginLeft: config.gutterWidth,
  },
  inner: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
};

const FullButton = (props) => {
  return (
    <button style={styles.container} onClick={props.onPress}>
      <div style={styles.inner}>{props.children}</div>
    </button>
  );
}

export default FullButton;