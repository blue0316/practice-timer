import React from 'react';

import Text from '../components/StyledText';
import config from '../config';

const loadingEmptyListViewStyles = {
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: config.gutterWidthList,
  },
};

const LoadingEmptyListView = (props) => {
  if (!props.dataAvailable) {
    if (props.loading) {
      return (
        <div style={loadingEmptyListViewStyles.container}>
         <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div style={loadingEmptyListViewStyles.container}>
        <Text>{props.emptyText}</Text>
      </div>
    );
  }
  return props.children;
};

export default LoadingEmptyListView;