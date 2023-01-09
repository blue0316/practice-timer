import React, { Component } from 'react';

// import {
//   View,
//   Alert,
//   TouchableHighlight,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   DatePickerIOS,
//   StyleSheet
// } from 'react-native'

import config from '../../config'

import Text from '../../components/StyledText'

import AddButton from '../../assets/AddButton.png'
import EditButton from '../../assets/EditButton.png'
import DoneButton from '../../assets/DoneButton.png'

import Spacer from '../../components/Spacer'
import BasicFullTextEntry from '../../components/BasicFullTextEntry'
import HeaderText from '../../components/HeaderText'
import CircularButton from '../../components/CircularButton'
import InlineText from '../../components/InlineText'
import DeleteButton from '../../components/DeleteButton'

// import SortableListView from 'react-native-sortable-listview';
import Container from '../../components/Container'

import ModelTransformer from '../../lib/ModelTransformer'
import ModelListener from '../../lib/ModelListener'

import moment from 'moment'
//import Hr from 'react-native-hr'

const styles = StyleSheet.create({
  spacedItems: {
    justifyContent: 'space-between',
    marginLeft: config.gutterWidth,
    marginRight: config.gutterWidth,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})

class PracticeRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight {...this.props.sortHandlers} onPress={() => {this.props.practiceSectionDidPress(this.props.rowData)}}>
        <View>
          {this.props.editing ?
            <DeleteButton
              style={{ marginLeft: 11}}
              onPress={() => {this.props.onPressDelete(this.props.rowData)}} >
            </DeleteButton>
          : null }
          <InlineText style={{justifyContent: 'space-between', margin: 8}}>
            <Text secondary={true}>{this.props.rowData.name}</Text>
            <View>
              <Text>{this.props.rowData.duration.humanize()}</Text>
              <Text>{this.props.rowData.beginTime !== undefined ? this.props.rowData.beginTime.format('h:mm a') : '--'}</Text>
            </View>

          </InlineText>

        </View>
      </TouchableHighlight>
    )
  }
}

class MainFlowPractice extends Component {

  constructor(props) {
    super(props);


    this.practiceSectionRef = this.props.firebase.database().ref('practice-sections/' + this.props.practiceId ).orderByChild('index');
    this.practiceRef = this.props.firebase.database().ref('team-practices/' + this.props.teamId + '/' + this.props.practiceId)

    this.state = {
      editing: this.props.defaultToEditing || false,
      practiceData: {
        ...props.practiceData,
      },
      practiceSections: [],
    }

    console.log("PERIOD STARTING STATE: ", this.state)

    this._addPracticeSectionDidPress = this._addPracticeSectionDidPress.bind(this)
    this._renderHeaderButtons = this._renderHeaderButtons.bind(this)
    this._editButtonDidPress = this._editButtonDidPress.bind(this)
    this._practiceSectionDidPress = this._practiceSectionDidPress.bind(this)
    this.savePractice = this.savePractice.bind(this)
    this.savePracticeSections = this.savePracticeSections.bind(this)
    this._startPracticeDidPress = this._startPracticeDidPress.bind(this)
    this._deleteDidPress = this._deleteDidPress.bind(this)
  }

  componentDidMount() {
    this._listenForPracticeSections(this.practiceSectionRef)
    this._listensForPracticeUpdate(this.practiceRef)
    // this._addPracticeSectionDidPress()
  }

  componentWillUnmount() {
    this.practiceSectionRef.off()
    this.practiceRef.off()
  }

  _listensForPracticeUpdate(practiceRef) {
    ModelListener.listenForSingleValue(practiceRef, ModelTransformer.deserializePractice, (deserializedPractice) => {
      console.log('PRACTICE DATA:', deserializedPractice)
      if (isNaN(deserializedPractice.date.valueOf())) {
        deserializedPractice.date = this.state.practiceData.date
      }
      this.setState({
        practiceData: deserializedPractice
      });
    });
  }

  _listenForPracticeSections(practiceSectionRef) {
    ModelListener.listenForMultipleOrderedValues(practiceSectionRef, ModelTransformer.deserializePracticeSection, (deserializedPracticeSections) => {
      console.log('PRACTICE SECTIONS: ', deserializedPracticeSections)
      if (deserializedPracticeSections) {
        this.setState({
          practiceSections: deserializedPracticeSections
        });
      }
    })
  }

  _startPracticeDidPress() {
    // This should eventually be handled entirely in redux.
    // Right now, we're converting local component state to redux.
    // const orderedPracticeSections =
    const travelTime = this.state.practiceData.travelTime;
    this.props.startPractice(this.state.practiceData.name, this.state.practiceData._key, this.state.practiceSections, travelTime);
  }

  _addPracticeSectionDidPress() {
    this.props.mainFlowNavigator.push({
      identifier: 'Period',
      componentProps: {
        practiceId: this.props.practiceId,
        practiceData: this.state.practiceData,
        defaultToEditing: true,
        practiceSectionId: this.props.firebase.database().ref().child('practice-sections/' + this.props.practiceId).push().key,
        index: this.state.practiceSections.length,
      }
    })
  }

  _practiceSectionDidPress(practiceSection) {
    this.props.mainFlowNavigator.push({
      identifier: 'Period',
      componentProps: {
        practiceId: this.props.practiceId,
        practiceData: this.state.practiceData,
        practiceSectionId: practiceSection._key,
        practiceSectionData: practiceSection,
        index: practiceSection.index,
      }
    })
  }

  _deleteDidPress(practiceSection) {
    // Remove from the firebase data
    const newPracticeOrder = this.state.practiceSections
      .filter(e => e !== practiceSection._key)
      .forEach((section, i) => section.index = i)
    debugger;

    this.setState({practiceSections: newPracticeOrder});
  }

  _editButtonDidPress()  {
    if (this.state.editing) {
      this.savePractice();
      this.setState({editing: false, editingTime: false})
    } else {
      this.setState({editing: true})
    }
  }

  leftButtonDidPress() {
    if (this.state.editing) {
      Alert.alert(
          'Confirm Practice',
          'Would you like to save your changes?',
          [
            {text: 'Yes', onPress: () => {
              this.savePractice().then(() => {
                this.props.mainFlowNavigator.pop()
              });
            }},
            {text: 'No', onPress: () =>  {
              this.props.mainFlowNavigator.pop()
            }},
        ])
    } else {
      this.props.mainFlowNavigator.pop()
    }
  }

  savePractice() {
    // Stop editing and save
    var serializedPracticeData = ModelTransformer.serializePractice(this.state.practiceData)
    console.log('LKFJWE', serializedPracticeData)
    var updates = {}
    updates['team-practices/' + this.props.teamId + '/' + this.props.practiceId] = serializedPracticeData;
    return this.props.firebase.database().ref().update(updates).catch( (err) => {
      Alert.alert(
        'Whoops',
        err.message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  savePracticeSections() {
    // Stop editing and save
    var serializedPracticeSections = ModelTransformer.serializePracticeSections(this.state.practiceSections)
    console.log('Serialized Practice Sections:', serializedPracticeSections)
    var updates = { ['practice-sections/' + this.props.practiceId]: serializedPracticeSections };
    return this.props.firebase.database().ref().update(updates).catch( (err) => {
      Alert.alert(
        'Whoops',
        err.message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  _renderHeaderButtons() {
    const rightButtonSource =  this.state.editing ? DoneButton : EditButton
    const negativeMarginRightButton = this.state.editing ? -25 : -50

    return (
      <View>
        <Spacer style={{marginTop: 32}} height={0} />

        <View style={{height: 0, marginLeft: 8, marginRight: 8, flexDirection: 'column'}}>
          {!this.state.editing ?
            <CircularButton
              style={{ alignSelf: 'flex-start', marginTop: -25}}
              onPress={this._startPracticeDidPress} >
              <Text>{`Start`}</Text>
            </CircularButton> : null }
          <CircularButton
            style={{ alignSelf: 'flex-end', marginTop: negativeMarginRightButton}}
            onPress={this._editButtonDidPress} >
            <Image style={{
                height: 24,
                width: 24,
            }} source={rightButtonSource} />
          </CircularButton>
        </View>
        <Spacer style={{marginTop: 32}} height={0} />
      </View>
    )
  }

  render () {
    return (
      <Container>
        <Spacer height={60} />
        <Spacer height={20} />
        {this.state.editing ?
          <BasicFullTextEntry
            placeholder={`Practice Name`}
            value={this.state.practiceData.name}
            onChangeText={(text) => {
              let previousPracticeData = this.state.practiceData
              previousPracticeData.name = text
              this.setState({practiceData: previousPracticeData})
            }}
          />
          :
          <HeaderText>{this.state.practiceData.name}</HeaderText>
        }
        {this._renderHeaderButtons()}
        <TouchableOpacity onPress={() => {
          if (this.state.editing) {
            this.setState({editingTime: !this.state.editingTime})
          }
        }}>
        <View>
          <InlineText style={styles.spacedItems}>
            <Text secondary={true}>{`Date`}</Text>
            <Text>{this.state.practiceData.date.format('MMMM Do, YYYY')}</Text>
          </InlineText>
          <Spacer height={16} />

        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (this.state.editing) {
            this.setState({editingTime: !this.state.editingTime})
          }
        }}>
        <View>
        <Spacer height={16} />
          <InlineText style={styles.spacedItems}>
            <View>
              <Text secondary={true}>{`Starts`}</Text>
              <Spacer height={8} />
              <Text>{this.state.practiceData.date.format('h:mm a')}</Text>
            </View>
            <View>
              <Text secondary={true}>{`Ends`}</Text>
              <Spacer height={8} />
              <Text>{this.state.practiceData.date.format('h:mm a')}</Text>
            </View>
            <View ><Text style={{color: 'rgba(0, 0, 0, 0)'}} secondary={true}>{`Ends`}</Text></View>
          </InlineText>
        <Spacer height={16} />

        </View>
      </TouchableOpacity>
        <Spacer height={16} />
        {this.state.editingTime ?
          <View style={{backgroundColor: '#fff', marginBottom: 16}}>
          <DatePickerIOS
            date={this.state.practiceData.date.toDate()}
            mode="datetime"
            onDateChange={(newDate) => {
              console.log('NEW DATE', newDate)
              let previousPracticeData = this.state.practiceData
              previousPracticeData.date = moment(newDate)
              this.setState({practiceData: previousPracticeData})
            }}
          />
          </View>
          :
        <SortableListView
          style={{flex: 1}}
          data={this.state.practiceSections.reduce((acc, section, i) => {
            acc[i] = section;
            return acc;
          }, {})}
          order={this.state.practiceSections.map((s, i) => i + "")}
          onRowMoved={ (e) => {
            console.log('ROW MOVED: ',e)
            let order = this.state.practiceSections
            order.splice(e.to, 0, order.splice(e.from, 1)[0]);
            order.forEach((section, i) => section.index = i);
            // Update order in firebase
            this.setState({practiceSections: order}, () => {
              this.savePracticeSections()
              this.forceUpdate()
            })
          }}
          renderRow={rowData => <PracticeRow editing={this.state.editing} onPressDelete={this._deleteDidPress} practiceSectionDidPress={this._practiceSectionDidPress} rowData={rowData}/>}
          disableSorting={!this.state.editing}
          onMoveStart={ () => console.log('on move start') }
          onMoveEnd={ () => console.log('on move end') }
          rowHasChanged={(row1, row2) => {return(row1 !== row2)}}
          removeClippedSubviews={false}
        /> }
        {this.state.editing ?
          <CircularButton
            style={{ alignSelf: 'center'}}
            onPress={this._addPracticeSectionDidPress} >
            <Image style={{
                height: 24,
                width: 24,
            }} source={AddButton} />
          </CircularButton>
        : null }
        <Spacer height={16} />
      </Container>
    )
  }
}

module.exports = MainFlowPractice
