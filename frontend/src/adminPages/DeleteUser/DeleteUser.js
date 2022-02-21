import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import Axios from 'axios'

const DeleteUser = () => {
  const [name, setName] = useState([]);
  const [phone, setPhone] = useState([]);
  const [address, setAddress] = useState([]);
  const [wagroup, setWagroup] = useState([]);
  const [email, setEmail] = useState([]);
  
  const {id} = useParams();
  const history = useHistory();

  const [logIn, setLogIn] = useState(false);
  const [roleLogIn, setRoleLogIn] = useState([]);

  Axios.defaults.withCredentials = true;

  const deleteUser = (e) => {
      e.preventDefault();
      Axios.delete(`http://localhost:5000/delete-user/${id}`).then((response) => {
          history.push('/admin/user');
      })
  }

  const getUserId = (id) => {
    Axios.post(`http://localhost:5000/profil`, {
        id: id
    }).then((response) => {
        setName(response.data[0].name);
        setPhone(response.data[0].phone);
        setAddress(response.data[0].address);
        setWagroup(response.data[0].wagroup);
        setEmail(response.data[0].email);
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
    getUserId(id);
  }, [])

  return (
    <div>
      {logIn && (roleLogIn == "admin") && <div>
      <Link to="/admin/user"><h2>Back</h2></Link>  
      <p>Nama: {name}</p>
      <p>Email: {email}</p>
      <p>No Handphone: {phone}</p>
      <p>Alamat: {address}</p>
      <p>Asal Grup Whatsapp: {wagroup}</p>
      <h2>Delete this user?</h2>
      <button onClick={deleteUser}>Yes</button>
      </div>}
    </div>
  )
}

export default DeleteUser
