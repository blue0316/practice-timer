import React, { Component } from 'react';

import BackgroundGradient from '../assets/BackgroundGradient.png';

const BackgroundView = () => {
  return (
    <div style={{
      backgroundImage: `url(${BackgroundGradient})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }}>
      {this.props.children}
    </div>
  );
}

export default BackgroundView;