import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './ContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';




// TODO could linkTo just be based on key (aka hunt_id)
const HuntListItem = ({huntId, huntName, voteCount, linkTo, handleHuntItemClick, pos }) => {

  const {
    potentialHunts,
    runningHunts,
    completedHunts,
    setPotentialHunts,
    setRunningHunts,
    setCompletedHunts,
    user,
  } = useContext(AppContext);
    
  const [votes, setVotes] = useState(voteCount)
  const [potential, setPotential] = useState(potentialHunts)
  const [userVoted, setUserVoted] = useState(false);
  const [userHuntStatus, setUserHuntStatus] = useState(0);
  const [running, setRunning] = useState(runningHunts)
  const [completed, setCompleted] = useState(completedHunts)
  
      
  
    
    // conditional check and update state 
    /**
       * state hook for userHuntStatus
       * 3 = completed 
       * 2 = running
       * 1 = potential 
       * = 0 not signed up 
       */
    
      
    
    const handleUpvote = () => {
      if (!userVoted) {
        // update votes and boolean in local state
        setVotes(votes + 1);
        setUserVoted(true);
        // update vote number in database
        const data = {
          hunt_id: huntId,
          hunt_votes: votes + 1,
        }
        console.log('POST data', data)
        axios.post('http://localhost:3000/api/hunts/updateHuntVote', data)
        .then(res => console.log('POST vote update request success'))
        .catch(err => console.log('POST vote update request error'))
      }
    }

    
    
    const handleDownvote = () => {
      if (!userVoted) {
        // update votes and boolean in local state
        setVotes(votes - 1);
        setUserVoted(true);
        // update vote number in database
        const data = {
          hunt_id: huntId,
          hunt_votes: votes - 1,
        }
        axios.post('http://localhost:3000/api/hunts/updateHuntVote', data)
        .then(res => console.log('POST vote update request success'))
        .catch(err => console.log('POST vote update request error'))
      }
    }

    useEffect( () => {
      console.log(user, userVoted, userHuntStatus)
      // GET request for array of users signed up for this hunt
      axios(`http://localhost:3000/api/subs/started/${huntId}`)
        .then(res => {
          for (const sub of res.data) {
            console.log(sub.user_id, user.user_id)
            if (sub.user_id === user.user_id) {
              setUserVoted(true)
              setUserHuntStatus(1)
            }
          } 
        })
        // .then(axios(`http://localhost:3000/api/hunts/${huntId}`))
      // if (completedHunts.includes(huntId)) setUserHuntStatus(3)
      // else if (runningHunts.includes(huntId)) setUserHuntStatus(2)
      // else setUserHuntStatus(0)
    }, [])


    

    
    const signupHandler = () => {
      // update status state hook in order to conditionally render the appropriate button
      setUserHuntStatus(1)
      // request includes user_id and hunt_id
      
      // TODO POST request 
      const data = {
        hunt_id: huntId,
        user_id: user.user_id,
        status: 1,
      }

      axios.post('http://localhost:3000/api/subs/signup', data)
        .then(res => console.log('POST sub request success'))
        .catch(err => console.log('POST sub request error'))


      // update array of potentialHunts (hunts user signed up for) in local state first 
      setPotential([...potential, huntId])
      // replace array in context with the updated array from local state
      setPotentialHunts(potential);
    }


    

    
    // FIXME add didUserVote property in order to prevent double-counting
      
      // TODO conditionally render signup button based on status 
      const signupButton = () => {
        if (!userHuntStatus) return <button 
        onClick={signupHandler}
        className="btn btn-outline-primary btn-sm mr-3"
        type="button"
        >Sign Up!</button>;
        if (userHuntStatus === 1) return <button
        className="btn btn-success btn-sm mr-3"
        type="button"
        >See You There!</button>;
        if (userHuntStatus === 2) return <button>In Progress!</button>;
        if (userHuntStatus === 3) return <button>Completed!</button>;
      }
    
    // TODO include number of people signed up for hunt ?
    return (
        <>
          <div onClick={(e) => handleHuntItemClick(pos, huntName)} className="list-item-container shadow-md background-green overflow-auto">
            <div className="listItem">
                <div className="text-container ">
                    <div className="text-base font-bold">
                        {huntName}
                    </div>
                    <div className="voting-buttons-container">
                      <button className="upvote-button" onClick={handleUpvote}>&#8593;</button>
                      {/* <i className="fas fa-thumbs-up">thumbs up</i> */}
                      {/* <i className="bi bi-hand-thumbs-up"></i> */}
                      <div className={votes > 0 ? "voteCountGreen" : "voteCountRed"}>{votes}</div>
                      <button className="downvote-button" onClick={handleDownvote}>&#8595;</button>
                    </div>
                    {/* <div className="pplGoing-container">
                      <b>{pplGoing}</b> people going to this event!
                    </div> */}
                    <div>
                      {signupButton()}
                    </div>
                </div>
                
                <div className="navigate-container">
                    <div className="navigate">
                        <Link 
                        to={{
                        pathname: linkTo,
                        state: { huntName: huntName }
                        }}
                        className="btn btn-outline-info btn-sm mr-3 h-25"
                        type="button"
                        >
                        Select</Link>
                    </div>
                </div>
            </div>
          </div>
        </>
    );
}

export default HuntListItem;