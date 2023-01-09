import React, { Component, useEffect, useState } from 'react';

import config from '../config';

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.brandColor,
  },
  containerLg: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  containerSm: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  innner: {
    alignItems: 'center',
  },
};

const CircularButton = (props) => {
  const [touchableHighlightStyles, setTouchableHighlightStyles] = useState(null);

  useEffect(() => {
    const smallOrLarge = props.large === true ? styles.containerLg : styles.containerSm;

    setTouchableHighlightStyles({
      ...styles.container,
      ...smallOrLarge,
      ...this.props.style || {},
    })
  },[])

  return (
    <button style={touchableHighlightStyles} onClick={this.props.onPress}>
      <div style={styles.inner}>{this.props.children}</div>
    </button>
  );
}

export default CircularButton;