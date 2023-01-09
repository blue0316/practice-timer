import React, { Component, useEffect, useState } from 'react';

import config from '../config';

const styles = {
  container: {
    height: 29,
    width: 29,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.errorColor,
  },
  inner: {
    height: 4,
    width: 15,
  },
};

const DeleteButton = (props) => {
  const [touchableHighlightStyles,setTouchableHighlightStyles] = useState(null);
  
  useEffect(() => {
    setTouchableHighlightStyles({
      ...styles.container,
      ...props.style || {},
    })
  }, []);

  return (
    <button style={touchableHighlightStyles} onClick={this.props.onPress}>
      <div style={styles.inner} />
    </button>
  );
}

export default DeleteButton;