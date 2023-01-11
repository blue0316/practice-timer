import React, { useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import TeamList from './TeamList';
import TeamItem from "./TeamItem";

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const SelectTeam = () => {
    useEffect(() => {

    }, []);

    return (
        <div>
            <h1>Team</h1>
            <p>The Team Page is accessible by every signed in administrator and staffs.</p>
    
            <Switch>
                <Route exact path={ROUTES.TEAM_DETAILS} component={TeamItem} />
                <Route exact path={ROUTES.TEAM} component={TeamList} />
            </Switch>
        </div>
    );
};

const condition = authUser =>
    authUser && (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.STAFF]);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(SelectTeam);