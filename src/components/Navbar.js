import React from 'react'
import {Link} from 'react-router-dom'
import { BsFillPersonFill,BsFillPersonLinesFill } from 'react-icons/bs';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { GrLogout } from 'react-icons/gr';
import {getJwt} from '../jwt'
import axios from 'axios'

const Navbar = () => {
    const jwt = getJwt()
    const logout = () => {
        axios.post(`http://localhost:5000/pandora/logoutAll`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => localStorage.removeItem('cool-jwt'))
        .catch(err => console.log('Błąd!'+err.msg))
        setTimeout(() => {window.location = './LoginRegister'},2000)
    }

    return (
        <nav>
            <div className="navbar-logo"><h1>PANDORA</h1></div>
            <div className="navbar-navigator">
                <Link className="navbar-link" to={'/Home'}>Home</Link>
                <Link className="navbar-link" to={'/Charms'}>Charms</Link>
                {/* <Link className="navbar-link" to={'/Bracelets'}>Bransoletki</Link> */}
            </div>
            <div className="navbar-userpanel">
                {jwt ? 
                    <React.Fragment>
                        <Link className="navbar-link" to={'/MyProfile'}><div><BsFillPersonLinesFill size="2rem"/>Mój profil</div></Link>
                        <Link className="navbar-link" to={'/ShoppingCart'}><div><AiOutlineShoppingCart size="2rem"/>Mój koszyk</div></Link>
                        <div className="navbar-link" to={'/LoginRegister'}><div onClick={logout}><GrLogout size="2rem"/>Wyloguj sie</div></div>
                    </React.Fragment>
                        : 
                    <React.Fragment>
                        <Link className="navbar-link" to={'/LoginRegister'}><div><BsFillPersonFill size="2rem"/>Zaloguj sie</div></Link>
                    </React.Fragment>
                }
            </div>
        </nav>
    )
}

export default Navbar;