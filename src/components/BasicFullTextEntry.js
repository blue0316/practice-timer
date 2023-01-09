import React, { useState } from 'react';

// import {
//   View,
//  TextInput,
//   StyleSheet,
//   Image,
// } from 'react-native'

import config from '../config';

const styles = {
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: config.textSecondaryBorderColor,
    borderBottomWidth: 1,
    marginTop: 8,
    marginRight: 24,
    marginLeft: 24
  },
  textInput:{
    height: 40,
    fontSize: 14,
    color: config.textColor
  }
};

const BasicFullTextEntry = () => {
  const [text, setText] = useState("");

  const textDidChange = (text) => {
    setText({text});
  }

  return (
    <div style={styles.container}>
      <div style={{
        flex: 1
      }}>
        <input
          {...props}
          placeholderTextColor={config.textSecondaryColor}
          style={styles.textInput}
          value={props.value || text}
          onChange={props.onChangeText || textDidChange}
          />
      </div>
    </div>
  )
}

export default BasicFullTextEntry