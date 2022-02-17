import React, { useState, useEffect} from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import Axios from 'axios'

import './EditWAGroup.css'

const EditWAGroup = () => {
  const [name, setName] = useState([]);

  const {id} = useParams();
  const history = useHistory();

  const updateWAGroup = (e) => {
    e.preventDefault();
    Axios.put(`http://localhost:5000/edit-wagroup/`, {
      id: id,
      name: name
    }).then((response) => {
      if (response.data.message) {
        
      } else {
        history.push(`/admin/wagroup`);
      }
    });
  }

  const getWAGroup = (id) => {
    Axios.post(`http://localhost:5000/get-wagroupid`, {
        id: id
    }).then((response) => {
        setName(response.data[0].name);
    })
  }

  useEffect(() => {
    getWAGroup(id);
  }, [])
    
  return (
    <div>
      <Link to="/admin/wagroup"><h2>Back</h2></Link>
      <form className="editwagroup-admin">
            <div>
              <input type="text" name="name" placeholder=" Nama Lengkap" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <button onClick={updateWAGroup}></button>
            <h2>Update</h2>
      </form>
    </div>
  )
}

export default EditWAGroup