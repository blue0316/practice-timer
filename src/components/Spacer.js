import React from 'react';

const Spacer = (props) => {
  const styles = { height: props.height, ...props.style };

  return (
    <div style={styles} />
  );
};

export default Spacer;