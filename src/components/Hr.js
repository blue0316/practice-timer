import React from 'react';

import Text from './StyledText';

const styles = {
  separator: {
    flex: 1,
    height: 10,
    width: 20,
    backgroundColor: '#8E8E8E',
  },
};

const Hr = (props) => {
  return (
    <div>
      <Text>{`kgjrelj`}</Text>
      <div style={{height: 20, width: 10, flex: 1, alignSelf: 'stretch',  backgroundColor: '#8E8E8E'}}></div>
      <div style={{ ...styles.separator, ...props.style }}></div>
    </div>
  );
};

export default Hr;