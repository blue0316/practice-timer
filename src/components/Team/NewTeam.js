import React, { Component } from "react";

import { withFirebase } from '../Firebase';

class NewTeam extends Component {
    constructor(props) {
        super(props)

        this.state = {
            teamname: ''
        }

        this.addTeam = this.addTeam.bind(this)
    }

    addTeam () {
        let user = this.props.firebase.auth.currentUser;
        let teamName = this.state.teamname;
        let newTeamData = {
            teamName,
            members: {},
            owner: user.uid,
            ownerName: user.displayName || user.email
        }

        let newTeamKey = this.props.firebase.db.ref().child('teams').push().key;

        let updates = {};
        updates['/teams/' + newTeamKey] = newTeamData;
        updates['/user-teams/' + user.uid + '/' + newTeamKey] = newTeamData;

        console.log(updates)
        return this.props.firebase.db.ref().update(updates);
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor="teamname">TEAM NAME: </label>
                    <input type="text" name="teamname" onChange={event => this.setState({teamname: event.target.value})} />
                </div>
                <button onClick={this.addTeam}>Add</button>
            </div>
        )
    }
}

export default withFirebase(NewTeam);