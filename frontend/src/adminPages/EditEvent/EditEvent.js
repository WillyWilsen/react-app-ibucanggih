import React, { useState, useEffect} from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import Axios from 'axios'

import './EditEvent.css'

const EditEvent = () => {
  const [name, setName] = useState([]);
  const [type, setType] = useState([]);
  const [date, setDate] = useState([]);
  const [month, setMonth] = useState([]);
  const [poin, setPoin] = useState([]);

  const {id} = useParams();
  const history = useHistory();

  const updateEvent = (e) => {
    e.preventDefault();
    Axios.put('http://localhost:5000/edit-event', {
      id: id,
      name: name,
      type: type,
      date: date,
      month: month,
      poin: poin
    }).then((response) => {
      if (response.data.message) {
        
      } else {
        history.push(`/admin/event`);
      }
    });
  }

  const getEventId = (id) => {
    Axios.post(`http://localhost:5000/get-eventid`, {
        id: id
    }).then((response) => {
        setName(response.data[0].name);
        setType(response.data[0].type);
        setDate(response.data[0].date);
        setMonth(response.data[0].month);
        setPoin(response.data[0].poin);
    })
  }

  useEffect(() => {
    getEventId(id);
  }, [])
    
  return (
    <div>
      <Link to="/admin/event"><h2>Back</h2></Link>
      <form className="editevent-admin">
            <div>
              <input type="text" name="name" placeholder=" Nama Event" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <input type="email" name="email" placeholder=" Tipe Event" value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
            </div>
            <div>
              <input type="number" name="phone" placeholder=" Tanggal" value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div>
              <input type="text" name="password" placeholder=" Bulan" value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
              />
            </div>
            <div>
              <input type="text" name="wagroup" placeholder=" Poin" value={poin}
                onChange={(e) => {
                  setPoin(e.target.value);
                }}
              />
            </div>
            <button onClick={updateEvent}></button>
            <h2>Update</h2>
      </form>
    </div>
  )
}

export default EditEvent