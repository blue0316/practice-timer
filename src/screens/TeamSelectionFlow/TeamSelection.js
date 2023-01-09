import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTeams, fetchEmailVerified } from '../../actions';

import config from '../../config'

import Text from '../../components/StyledText'
import InlineText from '../../components/InlineText'

import Container from '../../components/Container'
import FullTextEntry from '../../components/FullTextEntry'
import FullButton from '../../components/FullButton'
import Spacer from '../../components/Spacer'

import ModelTransformer from '../../lib/ModelTransformer'
import ModelListener from '../../lib/ModelListener'

const styles = {
  ownerText: {
    marginBottom: 5
  },
  rowText: {
    fontSize: 20,
    marginBottom: 5
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
};

class TeamSelection extends Component {

  constructor(props) {
    super(props);
    this._checkEmailVerification = this._checkEmailVerification.bind(this)
  }

  componentDidMount() {
    this._checkEmailVerification()
    this.props.listenForTeams();
    this._renderListCell = this._renderListCell.bind(this)
    this._teamDidPress = this._teamDidPress.bind(this)
  }

  _checkEmailVerification() {
    if (this.props.emailVerified) return;
    // Not the best way but we just poll for the user to have verified their email
    setTimeout(() => {
      // Dispatch email verify check
      this.props.fetchEmailVerified();
      // If not, send call this function again
      if (!this.props.emailVerified) this._checkEmailVerification();
    }, 500)
  }

  _teamDidPress(teamData) {
    this.props.teamDidSelect(teamData)
  }

  _renderListCell(rowData) {
    return (
      <div>
        <button onPress={() => this._teamDidPress(rowData)}>
          <span style={styles.rowText}>{rowData.name}</span>
          {rowData.isOwner ?
            <span style={styles.ownerText}>{`(You own this team)`}</span>
            :
            <span style={styles.ownerText}>{'Owner: '+ rowData.ownerName}</span>
          }
        </button>
      </div>
    )
  }

  _renderListView() {
    if (this.props.teams.length < 1) {
      if (this.props.loading) {
        return (
          <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 16
          }}>
            <ActivityIndicator
              animating={true}
              style={{height: 80, alignSelf: 'center'}}
              size="large"
            />
          </div>
        )
      }

      return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 16
        }}>
          <span>{`Teams you create or those which you are invited to join will show up here. Create a team to get started`}</span>
        </div>
      )
    } else {
      return (
        <ListView
          style={{
            flex: 1,
            marginTop: 60,
            marginLeft: 16,
            marginRight: 16
          }}
          enableEmptySections={true}
          dataSource={this.props.dataSource}
          renderRow={this._renderListCell}
          renderSeparator={(sectionId, rowId) => <div key={rowId} style={styles.separator} />}
          />
      )
    }
  }

  render () {
    return (
      <Container>
      {!this.props.emailVerified ?
        <div style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <span>{`Please verify your email to continue.`}</span>
        </div>
        : this._renderListView() }
        {!this.props.emailVerified ?
        <InlineText style={{
          marginBottom: 20
        }}>
          <span style={{
            color: config.textSecondaryColor,
            fontSize: 12,
          }}>{`DIDN'T GET AN EMAIL? `}</span>
          <button onPress={this.props.signInOptionDidPress}>
            <span style={{
              color: config.textColor,
              fontSize: 12,
            }}>{`RE-SEND VERIFICATION EMAIL`}</span>
          </button>
        </InlineText>
        : null }
      </Container>
    )
  }
}

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

const mapStateToProps = (state) => {
  return {
    dataSource: dataSource.cloneWithRows(state.team.teams),
    teams: state.team.teams,
    loading: state.team.loading,
    emailVerified: state.user.emailVerified,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listenForTeams: () => { dispatch(fetchTeams()) },
    fetchEmailVerified: () => { dispatch(fetchEmailVerified()) },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamSelection);
