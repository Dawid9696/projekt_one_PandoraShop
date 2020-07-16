import React, {useState, useEffect} from 'react';
import axios from 'axios'

const LoginRegister = () => {

    const [Email,setEmail] = useState()
    const [Password,setPassword] = useState()

    const [Login2,setLogin2] = useState()
    const [Password2,setPassword2] = useState()
    const [Email2,setEmail2] = useState()

    function zaloguj(e) {
        e.preventDefault()
        let data = {email:Email,password:Password}
        axios.post("http://localhost:5000/Pandora/login",data)
        .then(res => {
            localStorage.setItem('cool-jwt',res.data.token)
            setTimeout(() => {window.location = '/Charms'},500)
        })
        .catch((err) => {console.log('Bad haslo')})
        setEmail('')
        setPassword('')
    }

    const rejestruj = (e) => {
        e.preventDefault()
        let data = {login:Login2,password:Password2,email:Email2}
        console.log(data)
        axios.post("http://localhost:5000/Pandora/register",data)
        .then(res => console.log('User registered!'))
        .catch(err => console.log(err.msg+"Bład"))
        setLogin2('')
        setPassword2('')
        setEmail2('')

    }

    return (
        <div className="LoginRegister">
            <div className="Login">
                <div>
                    <div><h5>Zaloguj sie</h5></div>
                    <div>
                        <form onSubmit={zaloguj}>
                            <fieldset className="formular">
                                <legend>Logowanie</legend>
                                <label>Email</label>
                                <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                                <label>Haslo</label>
                                <input type="text" onChange={(e) => setPassword(e.target.value)}/>
                                <button type="submit">Zaloguj sie</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>

            <div className="Register">
                <div>
                    <div><h5>Zarejestruj sie</h5></div>
                    <div>
                        <form onSubmit={rejestruj}>
                            <fieldset  className="formular">
                                <legend>Rejestracja</legend>
                                <label>Login</label>
                                <input type="text" onChange={(e) => setLogin2(e.target.value)} value={Login2}/>
                                <label>Password</label>
                                <input type="password" onChange={(e) => setPassword2(e.target.value)} value={Password2}/>
                                <label>Email</label>
                                <input type="text" onChange={(e) => setEmail2(e.target.value)} value={Email2}/>
                                <button type="submit">Zarejestruj sie</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister;