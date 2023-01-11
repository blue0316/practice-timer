import React, { Component } from "react";
import { compose } from 'recompose';

// import _ from 'underscore';

import ModelListener from "../../lib/ModelListener";
import ModelTransformer from "../../lib/ModelTransformer";

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { Link } from "react-router-dom";

class MainFlowHome extends Component {
    constructor(props) {
        super(props);

        this.practiceRef = this.props.firebase.db.ref('team-practices/' + this.props.match.params.id);

        this.state = {
            loading: true,
            fbflag: false,
            practices: []
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
    }
    
    componentDidUpdate() {
        if(!this.state.fbflag) {
            ModelListener.listenForMultipleValues(this.practiceRef, ModelTransformer.deserializePractice, (deserializedPractices) => {
                // deserializedPractices = _.sortBy(deserializedPractices, 'date').reverse()
                this.setState({
                  practices: deserializedPractices,
                  loading: false,
                  fbflag: true
                });
            })
        }
    }

    render() {
        const {loading, practices} = this.state;
        return(
            <div>
                {loading && <div>loading...</div>}
                {
                    practices.length > 0 ? <ul>
                        {
                            practices.map(practice => (
                                <li key={practice._key}>
                                    {JSON.stringify(practice)}
                                    <span>Name: {practice.name}</span>
                                    <span>Date: {practice.date}</span>
                                    {/* <span>Travel Time: {practice.travelTime}</span> */}
                                </li>
                            ))
                        }
                    </ul> : <></>
                }
                {
                    !loading && practices.length < 1 && <h2>No Practice Schedule</h2>
                }
                <div>
                    {!loading && <Link to={{pathname: ROUTES.PRACTICE + '/' + this.props.match.params['id'] + '/new'}}>+ Add practice schedule</Link>}
                </div>
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
)(MainFlowHome);