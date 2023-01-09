import React from 'react';


import Text from '../../components/StyledText';

import Container from '../../components/Container';
import FullButton from '../../components/FullButton';
import FullTextEntry from '../../components/FullTextEntry';

import Profile from '../../assets/Profile.png';

constrAddTeam = (props) => {
  return (
    <Container>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <FullTextEntry 
          label={`TEAM NAME`}
          placeholder={`Enter team name`}
          value={props.addTeamName}
          onChange={(event) => props.addTeamNameDidChange(event.target.value)}
          icon={Profile}
        /> 
        <FullButton onClick={() => {
          props.addTeam().then(() => {
            props.teamSelectionFlowNavigator.pop();
          }).catch( (err) => {
            console.log(err);
            alert(err.message);
          })
        }}>
            <Text>Add Team</Text>
        </FullButton>
      </div>
    </Container>
  );
}

export default AddTeam;