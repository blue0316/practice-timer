import React, { Component } from 'react';

import {
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ListView,
  StyleSheet,
  ScrollView,
} from 'react-native'

import moment from 'moment'

import Text from '../../components/StyledText'

import EditButton from '../../assets/EditButton.png'

import Container from '../../components/Container'
import FullTextEntry from '../../components/FullTextEntry'
import FullTextEntryMultiline from '../../components/FullTextEntryMultiline'
import HeaderText from '../../components/HeaderText'
import BasicFullTextEntry from '../../components/BasicFullTextEntry'
import CircularButton from '../../components/CircularButton'
import Spacer from '../../components/Spacer'

import ModelTransformer from '../../lib/ModelTransformer'
import ModelListener from '../../lib/ModelListener'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStrip: {
    height: 150,
    backgroundColor: '#788390',
    marginTop: 60,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  mainSectionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }
});

class MainFlowPeriod extends Component {
  constructor(props) {
    super(props);

    const userID = this.props.firebase.auth().currentUser.uid;

    let practiceSectionDefaults = {
      name: '',
      duration: moment.duration({minutes: 10}),
      notes: { userID: "" },
      _key: this.props.practiceSectionId
    }

    this.practiceSectionRef = this.props.firebase.database().ref('practice-sections/' + this.props.practiceId + '/' + props.practiceSectionId)
    this.practiceRef = this.props.firebase.database().ref('team-practices/' + this.props.teamId + '/' + this.props.practiceId)

    let practiceSection = Object.assign({}, practiceSectionDefaults, props.practiceSectionData)

    console.log('PRACTICE DURATION: ', practiceSectionDefaults, props.practiceSectionData)

    let tempDurations = {
      tempDurationMinutes: practiceSection.duration.minutes().toString(),
      tempDurationSeconds: practiceSection.duration.seconds().toString()
    }

    this.state = {
      editing: this.props.defaultToEditing || false,
      practiceSection: practiceSection,
      practice: this.props.practiceData,
      ...tempDurations
    }
    console.log('ON LOAD PROPS: ', this.props, 'ON LOAD STATE', this.state)
    this._updateDuration = this._updateDuration.bind(this)
    this._editButtonDidPress = this._editButtonDidPress.bind(this)
    this._savePracticeSection = this._savePracticeSection.bind(this)
  }


  componentDidMount() {
    this._listenForPracticeSectionUpdates(this.practiceSectionRef)
    this._listenForPracticeUpdates(this.practiceRef)
  }

  componentWillUnmount() {
    this.practiceSectionRef.off()
    this.practiceRef.off()
  }

  _listenForPracticeSectionUpdates(practiceSectionRef) {
    ModelListener.listenForSingleValue(practiceSectionRef, ModelTransformer.deserializePracticeSection, (deserializedPracticeSection) => {
      this.setState({
        practiceSection: deserializedPracticeSection
      });
    })
  }

  _listenForPracticeUpdates(practiceRef) {
    ModelListener.listenForSingleValue(practiceRef, ModelTransformer.deserializePractice, (deserializedPractice) => {
      this.setState({
        practice: deserializedPractice
      });
    })
  }

  leftButtonDidPress() {
    if (this.state.editing) {
      Alert.alert(
          'Confirm Practice',
          'Would you like to save your changes?',
          [
            {text: 'Yes', onPress: () => {
              this._savePracticeSection().then(() => {
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

  _savePracticeSection() {
    let updates = {
      ['practice-sections/' + this.props.practiceId + '/' +  this.state.practiceSection._key]:
        ModelTransformer.serializePracticeSection(this.state.practiceSection, this.props.index)
    };
    console.log("UPDATES: ", updates)
    console.log("STATE: ", this.state)
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

  _editButtonDidPress() {
    if (this.state.editing) {
      this._updateDuration(this.state.tempDurationMinutes, this.state.tempDurationSeconds, () => {
        this._savePracticeSection()
      })
    }
    this.setState({editing: !this.state.editing})
  }

  _updateDuration(minutes, seconds, callback) {
    let minuteValue = parseInt(minutes, 10);
    let secondValue = parseInt(seconds, 10);
    console.log('MINUTE: ', minuteValue, 'SECOND: ', secondValue)
    if (! isNaN(minuteValue) && !isNaN(secondValue)) {
      let newDuration = moment.duration({minutes: minuteValue, seconds: secondValue})
      let previousPracticeSectionData = this.state.practiceSection
      previousPracticeSectionData.duration = newDuration
      this.setState({practiceSection: previousPracticeSectionData}, callback())
    }
  }

  render() {
    console.log('MAIN FLOW PERIOD', this.state)
    const userID = this.props.firebase.auth().currentUser.uid;
    return (
      <Container>
        <View style={styles.headerStrip}>
            {this.state.editing ?
            <BasicFullTextEntry
              placeholder={`Period Name`}
              value={this.state.practiceSection.name}
              onChangeText={(text) => {
                let previousPracticeSectionData = this.state.practiceSection
                previousPracticeSectionData.name = text
                this.setState({practiceSection: previousPracticeSectionData})
              }}
            />
            :
            <HeaderText>{this.state.practiceSection.name}</HeaderText>
          }
          <Text style={{alignSelf: 'center', marginTop: 8}}>{this.props.practiceData.name}</Text>
        </View>
        <ScrollView>
          <View style={styles.mainSectionContainer}>
            <FullTextEntry
              removeLeftWidth={true}
              label={`PERIOD NAME`}
              placeholder={`Enter period name`}
              value={this.state.practiceSection.name}
              editable={this.state.editing}
              onChangeText={(text) => {
                let previousPracticeSectionData = this.state.practiceSection
                previousPracticeSectionData.name = text
                this.setState({practiceSection: previousPracticeSectionData})
              }}
            />
            {this.state.editing ?
              <View>
                <FullTextEntry
                  removeLeftWidth={true}
                  label={`DURATION (MINUTES)`}
                  placeholder={`Enter minutes here`}
                  value={this.state.tempDurationMinutes}
                  editable={this.state.editing}
                  onChangeText={(text) => {
                    this.setState({tempDurationMinutes: text})
                  }}
                />
                <FullTextEntry
                  removeLeftWidth={true}
                  label={`DURATION (SECONDS)`}
                  placeholder={`Enter seconds here`}
                  value={this.state.tempDurationSeconds}
                  onChangeText={(text) => {
                    this.setState({tempDurationSeconds: text})
                  }}
                />
              </View>
              :
              <FullTextEntry
                removeLeftWidth={true}
                label={`DURATION`}
                editable={this.state.editing}
                value={this.state.practiceSection.duration.humanize()}
              />
            }
            <FullTextEntryMultiline
              removeLeftWidth={true}
              label={`NOTES`}
              placeholder={`Enter notes here`}
              value={(userID in this.state.practiceSection.notes) ?
                this.state.practiceSection.notes[userID] : ''}
              editable={this.state.editing}
              onChangeText={(text) => {
                let previousPracticeSectionData = this.state.practiceSection
                previousPracticeSectionData.notes[userID] = text
                this.setState({practiceSection: previousPracticeSectionData})
              }}
            />
          </View>
        </ScrollView>
        <CircularButton
          style={{ alignSelf: 'center'}}
          onPress={this._editButtonDidPress} >
          {this.state.editing ?
            <Text>{`Done`}</Text>
          :
          <Image style={{
              height: 24,
              width: 24,
          }} source={EditButton} />
          }
        </CircularButton>
        <Spacer height={16} />
      </Container>
    )
  }
}

module.exports = MainFlowPeriod
