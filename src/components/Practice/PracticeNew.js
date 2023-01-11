import React, { Component } from "react";
import { compose } from 'recompose';
import moment from 'moment';

import ModelListener from "../../lib/ModelListener";
import ModelTransformer from '../../lib/ModelTransformer';

import { withAuthorization, withEmailVerification } from '../Session'
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';

class PracticeNew extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            name: '',
            date: new Date().toLocaleDateString(new Date().getTimezoneOffset(), new Date().getTimezoneOffset()),
            time: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
            travelTime: 0
        }

        this.addPractice = this.addPractice.bind(this);
        this.savePracticeSchedule = this.savePracticeSchedule.bind(this);
    }

    componentDidMount() {
        console.log(this.props.match.params.teamId)
    }

    addPractice() {
        let serializedPracticeData = ModelTransformer.serializePractice(this.state.practiceData)
        console.log(serializedPracticeData)
        let newPracticeKey = this.props.firebase.db.ref().child('team-practices/' + this.props.teamId).push().key;
        console.log(newPracticeKey)
        this.props.firebase({
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
          })
    }

    savePracticeSchedule() {
        console.log(this.props)
        let newScheduleKey = this.props.firebase.db.ref().child('team-practices/' + this.props.match.params.teamId).push().key;
        let updates = {};
        updates['team-practices/' + this.props.match.params.teamId + '/' + newScheduleKey] = {
            practiceDate: this.state.date,
            practiceTime: this.state.time,
            practiceName: this.state.name,
            practiceTravelTime: this.state.travelTime
        };

        return this.props.firebase.db.ref().update(updates);
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <label htmlFor="train_date">
                            Date:
                        </label>
                        <input name="train_date" type="date" defaultValue={this.state.date} onChange={event => this.setState({date: new Date(event.target.value).toLocaleDateString(new Date(event.target.value).getTimezoneOffset(), new Date(event.target.value).getTimezoneOffset())})} />
                    </div>
                    <div>
                        <label htmlFor="train_date">
                            Time:
                        </label>
                        <input name="train_time" type="time" defaultValue={this.state.time} onChange={event => this.setState({time: event.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="train_title">Title:</label>
                        <input name="train_title" type="text" onChange={event => this.setState({name: event.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="train_travel_time">
                            Travel Time:
                        </label>
                        <input name="train_travel_time" type="number" defaultValue={this.state.travelTime} onChange={event => this.setState({travelTime: event.target.value})} />
                    </div>
                </div>
                {/* {
                    practices.length > 0 &&
                        <table border="2" style={{borderCollapse: "collapse"}}>
                            <thead>
                                <tr>
                                    <td>Name</td>
                                    <td>Starts</td>
                                    <td>Duration</td>
                                    <td>Travel Time</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    practices.map(practice => (
                                        <tr>
                                            <td>{practice.name}</td>
                                            <td>{practice.start}</td>
                                            <td>{practice.duration}</td>
                                            <td>{practice.travel_time}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                } */}
                <button onClick={this.savePracticeSchedule}>Create</button>
            </div>
        )
    }
}

const condition = authUser =>
    authUser && (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.STAFF]);


export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(PracticeNew);