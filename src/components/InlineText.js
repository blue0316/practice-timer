import React from 'react';

const styles = {
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
};

const InlineText = (props) => {
  return (
    <div style={{ ...styles.container, ...props.style }}>
      {props.children}
    </div>
  );
};

export default InlineText;