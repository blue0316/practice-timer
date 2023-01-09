/*

  ModelTransformer

  Serializes and deserializes object from firebase to be used in components.

  Takes basic data types and add context/transforms them like converting a unix timestamp to
  a momentjs object.

*/
import moment from 'moment'

class ModelTransformer {
  static deserializeGeneric(fbObj, key) {
    return {
      ...fbObj,
      _key: key,
    }
  }

  static deserializePractice(fbPractice, key) {
    return {
      name: fbPractice.practiceName,
      date: moment.unix(fbPractice.practiceDate),
      travelTime: moment.duration({seconds: fbPractice.practiceTravelTime}),
      _key: key,
    }
  }

  static serializePractice(practice) {
    return {
      practiceName: practice.name,
      practiceDate: practice.date.unix(),
      practiceTravelTime: practice.travelTime.asSeconds(),
    }
  }

  static deserializePracticeSection(fbPracticeSection, key, index) {
    return {
      name: fbPracticeSection.practiceSectionName,
      duration: moment.duration({seconds: fbPracticeSection.practiceSectionDuration}),
      notes: fbPracticeSection.practiceSectionNotes,
      _key: key,
      index: index,
    }
  }

  static serializePracticeSections(practiceSections) {
    return practiceSections.reduce((acc, section, i) => {
      acc[section._key] = ModelTransformer.serializePracticeSection(section, i);
      return acc;
    }, {});
  }

  static serializePracticeSection(practiceSection, index) {
    const tempIndex = index !== undefined ? index : practiceSection.index;
    return {
      practiceSectionName: practiceSection.name,
      practiceSectionDuration: practiceSection.duration.asSeconds(),
      practiceSectionNotes: practiceSection.notes,
      index: tempIndex,
    }
  }


  static deserializeTeam(fbTeam, key) {
    var practiceState = {};
    if (fbTeam.practiceState) {
      practiceState.practiceId = fbTeam.practiceState.practiceId
      practiceState.startTime = fbTeam.practiceState.startTime ? moment.unix(fbTeam.practiceState.startTime) : null
    }
    console.log('DESERIALZE TEAM: ',fbTeam)
    return {
      name: fbTeam.teamName,
      owner: fbTeam.owner,
      ownerName: fbTeam.ownerName,
      practiceState: practiceState,
      _key: key,
    }
  }

  static serializeTeam(team) {
    return {
      teamName: team.name,
      owner: team.owner,
      ownerName: team.ownerName,
    }
  }
}

export default ModelTransformer
