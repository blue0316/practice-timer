import React, { useRef } from 'react';
import config from '../config';

const headerTextStyles = {
  headerText: {
    alignSelf: 'center',
    margin: 8,
    fontSize: 20,
    borderColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: config.textColor,
  },
};

const HeaderText = (props) => {
  const textRef = useRef(null);

  const setNativeProps = (props) => {
    textRef.current.setNativeProps(props);
  }

  const style = { ...headerTextStyles.headerText, ...props.style };

  return (
    <div
      ref={textRef}
      {...props}
      style={style}
    >
      {props.children}
    </div>
  );
};

export default HeaderText;