import React, { Component, createRef } from "react";
import { compose } from 'recompose';

import ModelListener from "../../lib/ModelListener";
import ModelTransformer from '../../lib/ModelTransformer';

import { withAuthorization, withEmailVerification } from '../Session'
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';

class TeamItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fbflag: false,
            team: null,
            origin: null,
            ...props.location.state
        }

        this.teamNameRef = createRef();
        this.updateHandler = this.updateHandler.bind(this);
    }

    componentDidMount() {
        if (!this.state.team) {
            return;
        }

        this.setState({ loading: true });

        const teamRef = this.props.firebase.db.ref('teams/' + this.state.team._key);

        if(!this.state.fbflag) {  
            ModelListener.listenForSingleValue(teamRef, ModelTransformer.deserializeTeam, (deserializeTeam) => {
                this.setState({team: deserializeTeam, origin: deserializeTeam});
                this.setState({loading: false, fbflag: true})
            })
        }
    }

    updateHandler() {
        let updates = {};
        let newData = {
            ...this.state.team,
            teamName: this.state.team.name
        };
        updates['/teams/' + this.state.team._key] = newData;
        updates['/user-teams/' + this.state.team.owner + '/' + this.state.team._key] = newData;
        console.log(updates)
        return this.props.firebase.db.ref().update(updates);
    }

    render() {
        const { team, origin, loading } = this.state;
        return (
            <>
                {/* {loading && <div>loading...</div>} */}
                {
                    loading ?
                        <div>loading...</div>
                        :
                        <div>
                            {JSON.stringify(team)}
                            <div>
                                <label htmlFor="teamName">TEAM NAME:</label>
                                <input ref={this.teamNameRef} onChange={event => this.setState({team: {...team, name: event.target.value}})} name="teamName" defaultValue={team.name} required />
                            </div>
                            <div>
                                <p><span>Owner:</span>{team.ownerName}</p>
                            </div>
                            {
                                origin && team && <button onClick={this.updateHandler} disabled={origin.name === team.name}>Update</button>
                            }
                        </div>
                }
            </>
        )
    }
}

const condition = authUser =>
    authUser && (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.STAFF]);


export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(TeamItem);