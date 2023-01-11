import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import ModelListener from '../../lib/ModelListener';
import ModelTransformer from '../../lib/ModelTransformer';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class TeamList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fbflag: false,
            teams: []
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
    }

    componentDidUpdate() {
        if (this.props.firebase.auth.currentUser && !this.state.fbflag) {
            const userID = this.props.firebase.auth.currentUser.uid;
            const teamRef = this.props.firebase.db.ref('user-teams/' + userID);
            // dispatch(requestTeams(userID));
            ModelListener.listenForMultipleValues(teamRef, ModelTransformer.deserializeTeam, (deserializedTeams) => {
                const mappedTeams = deserializedTeams.map(team => ({
                    ...team,
                    isOwner: team['owner'] === userID,
                }));
                this.setState({ loading: false, fbflag: true, teams: mappedTeams })
            });
        }
    }

    render() {
        const { teams, loading } = this.state;

        return (
            <div>
                <h2>Teams</h2>
                {loading && <div>Loading ...</div>}
                <ul>
                    {
                        teams.map(team => (
                            <li key={`team-${team._key}`}>
                                <span>
                                    <strong>ID:</strong> {team._key}
                                </span>
                                <span>
                                    <strong>Teamname:</strong> {team.name}
                                </span>
                                <span>
                                    <strong>Owner Name:</strong> {team.ownerName}
                                </span>
                                <span>
                                    <Link
                                        to={{
                                            pathname: `${ROUTES.PRACTICE}/${team._key}`
                                        }}
                                    >
                                        Practices
                                    </Link>
                                </span>
                                <span>
                                    <Link
                                        to={{
                                            pathname: `${ROUTES.TEAM}/${team._key}`,
                                            state: { team },
                                        }}
                                    >
                                        Details
                                    </Link>
                                </span>
                            </li>
                        ))
                    }
                </ul>
                {(teams.length < 1 && !loading) && <h3>No teams</h3>}
                <Link to={{
                    pathname: `${ROUTES.NEW_TEAM}`
                }} style={{width: '3rem', height: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '100%', fontSize: '2rem'}}>+</Link>
            </div>
        );
    }
}

const condition = authUser =>
    authUser && (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.STAFF]);

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(TeamList);