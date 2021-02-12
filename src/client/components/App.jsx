import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import HuntPage from "./HuntPage";
import HuntsListPage from "./HuntsListPage";
import Signup from "./Signup";
import CreateHunt from "./CreateHunt";
import CreateEvent from "./CreateEvent";
import { AppContext } from './ContextProvider';
import Login from './Login'
import '../styles/styles.css'
import 'normalize.css';



class App extends Component {
  constructor(props) {
    super(props);


  this.setCurrentUser = user => {
    this.setState(state => ({
      user: user,
    }))
  };

  this.setHunts = hunts => {
    this.setState(state => ({
      hunts: hunts,
    }))
  }

  this.setEvents = events => {
    this.setState(state => ({
      events: events,
    }))
  }

  this.setPotentialHunts = potentialHunts => {
    this.setState(state => ({
      potentialHuntList: potentialHunts,
    }))
  }

  this.setRunningHunts = runningHunts => {
    this.setState(state => ({
      runningHustList: runningHunts,
    }))
  }

  this.setCompletedHunts = completedHunts => {
    this.setState(state => ({
      completedHuntList: completedHunts,
    }))
  }

  this.setUserLat = lat => {
    this.setState(state => ({
      userLat: lat,
    }))
  }

  this.setUserLng = lng => {
    this.setState(state => ({
      userLng: lng,
    }))
  }


  this.state = {
    user: {user_id: 5, user_name: 'guest', password: 'guest', },
    // default location set to Austin, TX
    userLat: 30.2672,
    userLng: -97.7431,
    hunts: [],
    potentialHunts: [],
    runningHunts: [],
    completedHunts: [],
    events: [],
    setEvents: this.setEvents,
    setCurrentUser: this.setCurrentUser,
    setHunts: this.setHunts,
    setPotentialHunts: this.setPotentialHunts,
    setRunningHunts: this.setRunningHunts,
    setCompletedHunts: this.setCompletedHunts,
    setUserLat: this.setUserLat,
    setUserLng: this.setUserLng,
  };
}
  // FIXME added BrowserRouter wrapper in order to be able to prop drill via Link components
  render() {
    return (
        <div className="app">
        <AppContext.Provider value={this.state}>
          
          <BrowserRouter>
            <Switch>
              <Route path="/hunts" component={HuntsListPage} />
              <Route path="/signup" component={Signup} />
              <Route path="/hunt/:id" component={HuntPage} />
              <Route path="/createhunt" component={CreateHunt} />
              <Route path="/createevent" component={CreateEvent} />
              <Route path="/" component={Login} />
            </Switch>
          </BrowserRouter>
        </AppContext.Provider>
      </div>
    )
  }
}

export default App;