import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import "./WAGroup.css"

const WAGroup = () => {
    const [WAGroup, setWAGroup] = useState([]);

    const getWAGroup = () => {
        Axios.get('http://localhost:5000/get-wagroup').then((response) => {
            setWAGroup(response.data);
        })
    }

    useEffect(() => {
        getWAGroup();
    }, [])

  return (
    <div>
      <div>
          <Link to="/admin"><h2>Back</h2></Link>
          <Link to="/admin/add-wagroup"><h2>Add WA Group</h2></Link>
          <div>
              {WAGroup.map((val, key) => {
                  return (
                    <div className="wagroup-admin">
                        <p>Nama Grup Whataapp: {val.name}</p>
                        <Link to={`/admin/edit-wagroup/${val.id}`}><button>Edit</button></Link>
                        <Link to={`/admin/delete-wagroup/${val.id}`}><button>Delete</button></Link>
                    </div>
                  )
              })}
          </div>
      </div>
    </div>
  )
}

export default WAGroup