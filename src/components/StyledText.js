import React from 'react';

import config from '../config';

const textStyles = {
  textShared: {
    borderColor: config.textBorderColor,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  textPrimary: {
    color: config.textColor,
  },
  textSecondary: {
    color: config.textSecondaryColor,
  },
};

const StyledText = (props) => {
  // If we pass a parameter called secondary, use the secondary color
  let textVariant = textStyles.textPrimary;
  if (props.secondary === true) {
    textVariant = textStyles.textSecondary;
  }
  // Flatten the styles and overwrite with the rightmost having priority
  const style = { ...textStyles.textShared, ...textVariant, ...props.style };
  return (
    <span style={style}>{props.children}</span>
  );
};

export default StyledText;