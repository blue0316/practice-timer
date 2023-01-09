import React, { useState } from 'react';

import config from '../config';

const FullTextEntry = (props) => {
  const [text, setText] = useState(null);

  const onChange = (newText) => {
    setText(newText);
    if (props.onChange) {
      props.onChange(newText);
    }
  };

  let leftWidth = props.removeLeftWidth ? 0 : 58;

  return (
    <div style={{
      display: 'flex',
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
    }}>
      <div style={{
        width: leftWidth,
        alignSelf: 'stretch',
        flexDirection: 'column'
      }}>
        {props.icon && <img src={props.icon} alt="" style={{
          width: 27,
          height: 27
        }} />}
      </div>
      <div style={{
        flex: 1
      }}>
        <span style={{
          fontSize: 12
        }}>{props.label}</span>
        <input
          {...props}
          placeholderTextColor={config.textSecondaryColor}
          style={{
            height: 40,
            fontSize: 14,
            color: config.textColor
          }}
          value={props.value || text}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default FullTextEntry;
