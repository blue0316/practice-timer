import moment from 'moment'

class PracticeTimingHelper {
  static calculateBeginTimes(practiceData, practiceSections, firstTime = null) {
    if (!firstTime) {
      // Default to using the practiceTime as the begin time
      firstTime = practiceData.date.valueOf()
    }
    let beginTimes = {}
    if (!practiceData.order) {
       let lastTime = moment(firstTime) // This is when the practice will end
      return {beginTimes, practiceSections, lastTime}
    }
    for (var i = 0; i < practiceData.order.length; i++) {
      // Get the first practice section based on order
      const practiceSection = practiceSections[practiceData.order[i]];

      // Make sure it really exists
      if (practiceSection !== undefined) {
        beginTimes[practiceSection._key] = moment(firstTime)
        practiceSections[practiceSection._key].beginTime = moment(firstTime)
        firstTime += practiceData.travelTime.asMilliseconds() + practiceSection.duration.asMilliseconds()
      }
    }
    let lastTime = moment(firstTime) // This is when the practice will end
    return {beginTimes, practiceSections, lastTime}
  }

  static getCurrentTiming(practiceData, practiceSections, beginTimes)  {
    let currentMoment = moment()
    let currentIndex = -1;

    for (var i = 0; i < practiceData.order.length; i++) {
      const practiceSection = practiceSections[practiceData.order[i]];

      // Make sure it really exists
      if (practiceSection !== undefined) {
        let nextBeginTime = beginTimes[practiceSection._key] 
        if (nextBeginTime > currentMoment) {
          currentIndex = i == 0 ? 0 : i - 1
          // duration between now and nextBeginTime
          let currentSection = practiceSections[practiceData.order[currentIndex]]
          let prevBeginTime = beginTimes[currentSection._key]
          let endTime = moment(prevBeginTime + currentSection.duration + practiceData.travelTime)
          let timeRemaining = moment.duration(endTime - currentMoment)
          return {timeRemaining, currentSection, nextSection:practiceSection}
        }
      }
    }
    // Practice has expired
    return null
  }

}
module.exports = PracticeTimingHelper