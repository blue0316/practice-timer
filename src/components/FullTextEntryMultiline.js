import React, { useState, useRef } from 'react';

import Text from './StyledText';
import config from '../config';

const FullTextEntryMultiline = (props) => {
  const [text, setText] = useState('');
  const [height, setHeight] = useState(40);
  const inputRef = useRef(null);

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
      marginBottom: 8,
      marginLeft: 24
    },
    label: {
      fontSize: 12
    },
    textInput:{
      fontSize: 14,
      color: config.textColor
    },
  };

  const textDidChange = (event) => {
    props.onChange();

    const { contentSize, text } = event.nativeEvent;

    setText(text);
    setHeight(contentSize.height);
  }

  const setNativeProps = (props) => {
    inputRef.current.setNativeProps(props);
  }

  let leftWidth = props.removeLeftWidth === true ? 0 : 58;

  return (
    <div style={styles.container}>
      <div style={{
        width: leftWidth,
        alignSelf: 'stretch',
        flexDirection: 'column'
      }}>
        <img src={props.icon} alt="icon" style={{
          width: 27,
          height: 27
        }}/>
      </div>
      <div style={{
        flex: 1
      }}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          {...props}
          multiline
          ref={inputRef}
          placeholderTextColor={config.textSecondaryColor}
          style={[styles.textInput, { height }]}
          value={props.value || text}
          onChange={textDidChange}
          />
      </div>
    </div>
  );
};

export default FullTextEntryMultiline;