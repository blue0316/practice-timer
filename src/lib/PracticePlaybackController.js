'use strict'

var moment = require('moment')
const nop = function() {}

class PracticePlaybackController {

  constructor(teamId, teamPlaybackState, database, modelTransformers, playbackUpdateCallback) {
    this.teamId = teamId
    this.teamPlaybackState = teamPlaybackState
    this.database = database
    this.practice = null
    this.practiceSections = null
    this.modelTransformers = modelTransformers || {}
    this.playbackUpdateCallback = playbackUpdateCallback || nop

    // Refs
    this.teamPlaybackStateRef = null
    this.practiceRef = null
    this.practiceSectionsRef = null

    // Loading state
    this.practiceLoaded = false
    this.practiceSectionLoaded = false

    // Timer for polling time updates
    this.pollingTimeout = null

    // Playback context
    this.oneMinuteWarningFired = false
    this.endOfPracticeFired = false
    this.lastCurrentPracticeSection = null

    // Cached begin times
    this.beginTimes = null

    // Bind `this` contexts
    this.teamPlaybackStateDidUpdate = this.teamPlaybackStateDidUpdate.bind(this)
    this.practiceDidUpdate = this.practiceDidUpdate.bind(this)
    this.practiceSectionsDidUpdate = this.practiceSectionsDidUpdate.bind(this)
    this.tick = this.tick.bind(this)

    // Call the setup
    this.setup()
  }

  setup() {
    this.teamPlaybackStateRef = this.database.ref('teams/' + this.teamId + '/practiceState')
    this.teamPlaybackStateRef.on('value', this.teamPlaybackStateDidUpdate)
    this.invalidateEverything() // Setup the initial listeners
    this.playbackUpdateCallback('updateState', {loading: true, visible: true})
  }

  tearDown() {
    // Clear all listeners
    if (this.teamPlaybackStateRef) {
      this.teamPlaybackStateRef.off()
    }
    if (this.practiceRef) {
      this.practiceRef.off()
    }
    if (this.practiceSectionsRef) {
      this.practiceSectionsRef.off()
    }
    // Stop polling
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout)
      this.pollingTimeout = null
    }
  }

  teamPlaybackStateDidUpdate(newPlaybackState) {

    if (this.modelTransformers['team'] != undefined) {
      newPlaybackState = this.modelTransformers['team'](newPlaybackState)
    }
    this.playbackUpdateCallback('updateState', {playbackState: newPlaybackState})
    console.log('NEW PLAYBACK STATE', newPlaybackState)

    // Was there a teamPlaybackState current set?
    if(!this.teamPlaybackState) {
      // Set the next state and invalidate existing listeners
      this.teamPlaybackState = newPlaybackState
      this.invalidateEverything()
      return
    }

    if (newPlaybackState == null) {
      this.teamPlaybackState = newPlaybackState
      this.invalidateEverything()
      this.playbackUpdateCallback('updateState', {loading: false, visible: false})
      return
    }

    // If team state is different
    if (this.teamPlaybackState.practiceId != newPlaybackState.practiceId ||
        this.teamPlaybackState.startTime != newPlaybackState.startTime) {

      // If the practiceId is different
      if (this.teamPlaybackState.practiceId != newPlaybackState.practiceId) {
        // Invalidate everything
        this.teamPlaybackState = newPlaybackState
        this.invalidateEverything()
        return
      }

      // If the start time is different
      if (this.teamPlaybackState.startTime != newPlaybackState.startTime) {
        // Update the time
        this.teamPlaybackState = newPlaybackState
        this.forceTimeUpdate()
        return
      }

    } // Otherwise nothing happens
  }

  practiceDidUpdate(newPractice) {
    // Transform if defined
    newPractice = this.modelTransformers['practice'] ? this.modelTransformers['practice'](newPractice) : newPractice
    console.log('NEW PRACTICE UPDATE', newPractice)
    this.practiceLoaded = true
    this.practice = newPractice
    this.playbackUpdateCallback('updateState', {practice: newPractice})
    if (this.practiceSectionsLoaded && this.practiceLoaded) {
      this.forceTimeUpdate()
    }
  }

  practiceSectionsDidUpdate(newPracticeSections) {
    // Transform if defined
    newPracticeSections = this.modelTransformers['practiceSections'] ? this.modelTransformers['practiceSections'](newPracticeSections) : newPracticeSections
    console.log('NEW PRACTICE SECTIONS', newPracticeSections)
    this.practiceSectionsLoaded = true
    this.practiceSections = newPracticeSections
    if (this.practiceSectionsLoaded && this.practiceLoaded) {
      this.forceTimeUpdate()
    }
  }

  // Forces time remaining to update
  forceTimeUpdate() {
    // Are loading?  If we are waiting on either, we are still listening
    console.log("forceTimeUpdate called");
    const loaded = this.practiceSectionsLoaded && this.practiceLoaded
    if (loaded) {
      // Calculate timing
      this.calculateBeginTimes()
      if (this.pollingTimeout) {
        clearTimeout(this.pollingTimeout)
        this.pollingTimeout = null
      }
      console.log("pollPracticeRemaining will be called.");
      this.pollPracticeRemaining(0)
    } else {
      // Cancel timer
      if (this.pollingTimeout) {
        clearTimeout(pollingTimeout)
        this.pollingTimeout = null
      }
    }
  }

  tick() {
    var lastPracticeSectionKey = null
    var currentPracticeSectionKey = null
    var lastBeginTime = null
    var currentBeginTime = null
    let currentMomentIterator =  moment()
    for (const practiceSectionKey of this.practice.order) {
      //console.log('BEGIN TIME FOR KEY: ', this.beginTimes[practiceSectionKey].valueOf(), currentMomentIterator.valueOf())
      if (this.beginTimes[practiceSectionKey].valueOf() > currentMomentIterator.valueOf() ) {
        // The current section is lastPractice or the first one in the order
        currentPracticeSectionKey = lastPracticeSectionKey
        //console.log('CURRENT BEGIN TIME', lastBeginTime.valueOf())
        currentBeginTime = lastBeginTime
      }
      lastPracticeSectionKey = practiceSectionKey

      lastBeginTime = moment(this.beginTimes[practiceSectionKey].valueOf())
    }
    currentPracticeSectionKey = currentPracticeSectionKey || lastPracticeSectionKey // Edge case for first practice section
    currentBeginTime = currentBeginTime || lastBeginTime
    let currentPracticeSection = this.practiceSections[currentPracticeSectionKey]

    let isLastSection = this.practice.order[this.practice.order.length - 1] == currentPracticeSectionKey
    if (currentPracticeSection != this.lastCurrentPracticeSection) {
      this.oneMinuteWarningFired = false
      this.endOfPeriodFired = false
    }

    //console.log("CURRENT BEGIN TIME", currentBeginTime)
    let timeEnd = currentBeginTime.valueOf()
    //console.log('TIME END: ', timeEnd)
    //console.log('DURATION: ', currentPracticeSection.duration.valueOf())

    timeEnd +=  this.practice.travelTime.valueOf()
    timeEnd += currentPracticeSection.duration.valueOf()
    let currentMoment = moment(moment().valueOf())
    console.log('TIME END: ', timeEnd, 'CURRENT MOMENT: ', currentMoment.valueOf())
    let timeRemaining = moment.duration(timeEnd - currentMoment.valueOf())

    // Make sure:
    // 1) We're under 1 minute
    // 2) 1 minute warning hasn't fired
    // 3) This section is over 1 minute long

    if (timeRemaining.valueOf() <= 60000 && timeRemaining.valueOf() >= 58000 && !this.oneMinuteWarningFired && currentPracticeSection.duration.valueOf() > 60000) {
      this.oneMinuteWarningFired = true
      this.playbackUpdateCallback('signal', {signalName: 'oneMinuteWarning'})
    }

    if (!isLastSection) {
      if (timeRemaining.valueOf() <= 500 && !this.endOfPeriodFired) {
        this.endOfPeriodFired = true
        this.playbackUpdateCallback('signal', {signalName: 'endOfPeriod'})
      }
    } else {
      if (timeRemaining.valueOf() <= 0 && timeRemaining.valueOf() >= -1000 && !this.endOfPracticeFired) {
        this.endOfPracticeFired = true
        this.playbackUpdateCallback('signal', {signalName: 'endOfPractice'})
      }
    }

    this.lastCurrentPracticeSection =  currentPracticeSection
    this.playbackUpdateCallback('updateState', {timeRemaining, currentPracticeSection, loading: false, visible: timeRemaining.valueOf() > 0})
  }

  pollPracticeRemaining(timeout = 500) {
    this.pollingTimeout = setTimeout(() => {
      this.tick()
      this.pollPracticeRemaining()
    }, timeout)
  }

  calculateBeginTimes() {
    // TODO: Optomize this to know if the practice is already over
    let beginTimes = {}
    console.log('BEGIN TIME: ', this.teamPlaybackState.startTime.valueOf())
    var lastBeginTime = moment(this.teamPlaybackState.startTime.valueOf()*1000) // Intialize frist begin time to practice start (Have to copy value)
    for (const practiceSectionKey of this.practice.order) {
      console.log('LAST BEGIN TIME: ', lastBeginTime, lastBeginTime.valueOf())
      beginTimes[practiceSectionKey] = moment(lastBeginTime.valueOf())
      lastBeginTime.add(this.practice.travelTime)
      lastBeginTime.add(this.practiceSections[practiceSectionKey].duration)
    }
    console.log('BEGIN TIMES: ', beginTimes)
    this.beginTimes = beginTimes
  }


  // Invalidation methods set the cached values to null & reinstall the listeners
  invalidateEverything() {
    //debugger;
    // Reset playback
    this.oneMinuteWarningFired = false
    this.endOfPracticeFired = false
    this.lastCurrentPracticeSection = null

    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout)
      this.pollingTimeout = null
    }

    // We need this to be set before we reload the listeners b/c they can finish before we are ready to force the timing update
    this.practiceLoaded = false
    this.practiceSectionsLoaded = false

    this.practice = null
    this.practiceSections = null


    this._invalidatePractice()
    this._invalidatePracticeSections()
  }

  _invalidatePractice() {
    if (this.practiceRef) {
      this.practiceRef.off()
    }
    if (this.teamPlaybackState && this.teamPlaybackState.practiceId) {
      const practiceRef = 'team-practices/' + this.teamId + '/' + this.teamPlaybackState.practiceId
      console.log('Setting practiceRef', practiceRef)
      this.practiceRef = this.database.ref(practiceRef)
      this.practiceRef.on('value', this.practiceDidUpdate)
    }
  }

  _invalidatePracticeSections() {
    if (this.practiceSectionsRef) {
      this.practiceSectionsRef.off()
    }
    if (this.teamPlaybackState && this.teamPlaybackState.practiceId) {
      const practiceSectionsRef = 'practice-sections/' + this.teamPlaybackState.practiceId
      console.log('Setting practiceSectionsRef', practiceSectionsRef)
      this.practiceSectionsRef = this.database.ref(practiceSectionsRef)
      this.practiceSectionsRef.on('value', this.practiceSectionsDidUpdate)
    }
  }
}

module.exports = PracticePlaybackController;
