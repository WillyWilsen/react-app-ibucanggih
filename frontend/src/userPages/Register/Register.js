import React from 'react';
import { Link } from 'react-router-dom';

import Logo from "../../img/Logo.png";
import Background from "../../img/Background.png";
import "./Register.css";
import FooterRegister from "../../components/FooterRegister/FooterRegister";

const Register = () => {
  return (
    <div>
      <img className="background" src={Background} />
      <div>
        <img className="logo" src={Logo} />
      </div>
      <div>
        <form>
          <input className="name" type="text" name="name" placeholder=" Nama Lengkap" />
          <div className="form">
            <input className="email" type="email" name="email" placeholder=" Email" />
            <input className="password" type="password" name="password" placeholder=" Kata Sandi" />
            <input className="pwconfirm" type="pwconfirm" name="pwconfirm" placeholder=" Ulangi Kata Sandi" />
          </div>
          <button type="submit" className="submit"><p className="submit-text">Daftar</p></button>
        </form>
      </div>
      <p className="bottom-text">
        Sudah punya Akun Ibu-Ibu Canggih? <Link to="/login">Masuk disini</Link>
      </p>
      <FooterRegister />
    </div>
  )
}

export default Register;
