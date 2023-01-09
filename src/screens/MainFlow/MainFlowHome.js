import React, { Component } from 'react';

// import {
//   View,
//   Image,
//   TouchableOpacity,
//   TouchableHighlight,
//   Alert,
//   ListView,
//   StyleSheet
// } from 'react-native'

import AddButton from '../../assets/AddButton.png'

import ModelTransformer from '../../lib/ModelTransformer'
import ModelListener from '../../lib/ModelListener'

import Text from '../../components/StyledText'
import HeaderText from '../../components/HeaderText'
import Spacer from '../../components/Spacer'
import LoadingEmptyListView from '../../components/LoadingEmptyListView'
import Container from '../../components/Container'
import CircularButton from '../../components/CircularButton'
// import { SwipeListView } from 'react-native-swipe-list-view';

import moment from 'moment'
import _ from 'underscore'

const styles = {
  container: {
    flex: 1,
  },
  rowContainer: {
    backgroundColor: '#50535C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 14,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
};

class MainFlowHome extends Component {

  constructor(props) {
    super(props);

    //var user = this.props.firebase.auth().currentUser;

    // TODO: query (based on time) for practices here & set state
    this.practicesRef = this.props.firebase.database().ref('team-practices/' + this.props.teamId);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })

    this.state = {
      //user: user,
      loading: true,
      dataSource: dataSource,
      practices: [],
    }
    this._practiceDidPress = this._practiceDidPress.bind(this)
    this._practiceDeleteDidPress = this._practiceDeleteDidPress.bind(this)
    this._addPracticeDidPress = this._addPracticeDidPress.bind(this)
    this._renderListCell = this._renderListCell.bind(this)
    this._renderHiddenListCell = this._renderHiddenListCell.bind(this)
  }

  componentDidMount() {
    this._listenForPractices(this.practicesRef)
    // this._addPracticeDidPress()
  }

  componentWillUnmount() {
    this.practicesRef.off()
  }

  _listenForPractices(practicesRef) {
    ModelListener.listenForMultipleValues(practicesRef, ModelTransformer.deserializePractice, (deserializedPractices) => {
      deserializedPractices = _.sortBy(deserializedPractices, 'date').reverse()
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(deserializedPractices),
        practices: deserializedPractices,
        loading: false
      });
    })
  }

_practiceDidPress(rowData) {
  // Redirect to the actual practice page.
  this.props.mainFlowNavigator.push({
    identifier: 'Practice',
    componentProps: {
      practiceId: rowData._key,
      practiceData: rowData
    }
  });
}

_practiceDeleteDidPress(rowData) {
  Alert.alert(
    'Delete Practice',
    'Are you sure you want to delete this practice?',
    [
      {text: 'Yes', onPress: () => {
        // Delete the practice
        this.props.firebase.database().ref().child('team-practices/' + this.props.teamId + '/' + rowData._key).remove().then(() => {
          console.log('Deleted row')
        });
      }},
      {text: 'No', onPress: () =>  {
        // Do nothing, could close the cell...
      }},
  ])
}

_addPracticeDidPress() {
  var newPracticeKey = this.props.firebase.database().ref().child('team-practices/' + this.props.teamId).push().key;
  this.props.mainFlowNavigator.push({
    identifier: 'Practice',
    practiceId: newPracticeKey,
    componentProps: {
      defaultToEditing: true,
      practiceData: {
        name: 'Untitled Practice',
        date: moment(),
        travelTime: moment.duration(30),
        order: [],
        _key: newPracticeKey
      },
    }
  });
}

_renderListCell(rowData) {
  // Add swipe to delete and swipe to
  return (
     <div>
      <div onClick={() => {this._practiceDidPress(rowData)}}>
        <div style={styles.rowContainer}>
          <div style={{flexDirection: 'row', alignItems: 'center' , marginBottom: 6}}>
            <div style={{alignItems: 'center'}}>
              <HeaderText style={{fontSize: 30, marginBottom: 0}}>{rowData.date.format('D')}</HeaderText>
              <span>{rowData.date.format('MMM')}</span>
            </div>
            <span style={styles.rowText}>{rowData.name}</span>
          </div>
          <span style={styles.rowText}>{rowData.date.format('h:mm a')}</span>
        </div>
      </div>
    </div>
  )
}

_renderHiddenListCell(rowData) {
  return (
    <div onClick={() => {this._practiceDeleteDidPress(rowData)}}>
      <div style={{height: 67, paddingLeft: 16, justifyContent: 'center', backgroundColor: 'red'}}>
        <span>{`Delete`}</span>
      </div>
    </div>
  )
}

 _renderListView() {
    return (
      <LoadingEmptyListView
        loading={this.state.loading}
        dataAvailable={this.state.practices.length > 0}
        emptyText={`No practices found. Use the plus button to create your first practice.`} >
        {/* <SwipeListView
          style={{
            flex: 1,
            marginTop: 60,
            marginLeft: 16,
            marginRight: 16
          }}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderListCell}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          removeClippedSubviews={false}
          renderHiddenRow={this._renderHiddenListCell}
          leftOpenValue={75}
          /> */}
      </LoadingEmptyListView>
    )
  }

  render () {
    return (
      <div>
        <div style={styles.container}>
          <span>Welcome</span>
          {this._renderListView()}
          <CircularButton
            style={{ alignSelf: 'center'}}
            onPress={this._addPracticeDidPress} >
            <img style={{
                height: 24,
                width: 24,
            }} src={AddButton} />
          </CircularButton>
        </div>
      </div>
    )
  }
}

module.exports = MainFlowHome
