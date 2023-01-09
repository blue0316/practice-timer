import React, { Component } from 'react';

// import Keyboard from 'react-native-keyboard';
import BackgroundView from './BackgroundView';

const Container = () => {
  return (
    <BackgroundView>
      {/* <div onClick={Keyboard.dismiss} style={{ flex: 1 }}> */}
      <div style={{ flex: 1 }}>
        <div style={{ height: '100%' }}>{this.props.children}</div>
      </div>
    </BackgroundView>
  );
}

export default Container;