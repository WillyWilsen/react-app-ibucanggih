import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import "./Event.css"

const Event = () => {
  const [event, setEvent] = useState([]);

  const [logIn, setLogIn] = useState(false);
  const [roleLogIn, setRoleLogIn] = useState([]);

  Axios.defaults.withCredentials = true;

  const getEvent = () => {
      Axios.get('http://localhost:5000/get-eventname').then((response) => {
          setEvent(response.data);
      })
  }

  useEffect(() => {
    Axios.get('http://localhost:5000/login').then((response) => {
    if (response.data.loggedIn) {
        setRoleLogIn(response.data.user[0].role);
        setLogIn(true);
      } else {
        setLogIn(false);
      }
    })
    getEvent();
  }, [])

  return (
    <div>
      {logIn && (roleLogIn == "admin") && <div>
      <div>
          <Link to="/admin"><h2>Back</h2></Link>
          <Link to="/admin/add-event"><h2>Add Event</h2></Link>
          <div>
              {event.map((val, key) => {
                  return (
                    <div className="event-admin">
                        <p>Nama Event: {val.name}</p>
                        <p>Tipe Event: {val.type}</p>
                        <p>Date: {val.date} {val.month}</p>
                        <p>Poin: {val.poin}</p>
                        <Link to={`/admin/edit-event/${val.id}`}><button>Edit</button></Link>
                        <Link to={`/admin/delete-event/${val.id}`}><button>Delete</button></Link>
                    </div>
                  )
              })}
          </div>
      </div>
      </div>}
    </div>
  )
}

export default Event
