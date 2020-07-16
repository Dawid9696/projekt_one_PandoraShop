import React, {useState,useEffect,useReducer} from 'react';
import axios from 'axios'
import { getJwt } from '../jwt';

const initialState2 = {
    loading:true,
    post:{},
    error:''
}

const FETCH_SUCCESS = "FETCH_SUCCESS"
const FETCH_FAIL = "FETCH_FAIL"

const reducer2 = (state,action) => {
    switch (action.type) {
        case FETCH_SUCCESS: return {
            loading:false,
            post:action.payload,
            error:''
        }
        case FETCH_FAIL: return {
            loading:true,
            post:{},
            error:action.payload
        }
        default:return state
    }
}

function MyProfile() {
    const [profile2,dispatch] = useReducer(reducer2,initialState2)

    const [name,setName] = useState()
    const [surname,setSurname] = useState()
    const [city,setCity] = useState()
    const [street,setStreet] = useState()
    const [numberOfHome,setNumberOfHome] = useState()
    const [postalCode,setPostalCode] = useState()

    const [oldPassword,setOldPassword] = useState()
    const [newPassword,setNewPassword] = useState()

    useEffect(() => {
        const jwt = getJwt()
        if(!jwt) {
            console.log("Brak danych 1!!!1")
        }
        console.log("cojest")
        axios.get("http://localhost:5000/Pandora/myprofile",{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => {
            dispatch({type:FETCH_SUCCESS,payload:res.data})
            console.log('Pozyskało dane')
        }).catch(err => {
            dispatch({type:FETCH_FAIL,payload:err})
            console.log('Nie pozyskano danych')
        })
    },[])

    console.log(profile2)

    const uzupelnijDane = (e) => {
        e.preventDefault()
        const personalData = {name,surname,city,street,numberOfHome,postalCode,}
        const jwt = getJwt()
        console.log(personalData)
        axios.post("http://localhost:5000/Pandora/UpdateMyProfile",personalData,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Udalosie'))
        .catch(err => console.log(err.msg+"Bład"))
        setName('')
        setSurname('')
        setCity('')
        setStreet('')
        setNumberOfHome('')
        setPostalCode('')
        setTimeout(() => {window.location = '/MyProfile'},500)
    }

    const uzupelnijDane2 = (e) => {
        e.preventDefault()
        const passwordChange = {password:oldPassword,newPassword}
        const jwt = getJwt()
        axios.post("http://localhost:5000/Pandora/changePassword",passwordChange,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => window.alert('Hasło zmienione!'))
        .catch(err => console.log('Nie udana zmiana hasla'))
        setOldPassword('')
        setNewPassword('')
        setTimeout(() => {window.location = '/MyProfile'},500)
    }
    
    const deleteAcc = () => {
        const jwt = getJwt()
        axios.delete("http://localhost:5000/Pandora/deleteMyProfile",{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => localStorage.removeItem('cool-jwt'))
        .catch(err => console.log('Nie udane usuniecie konta!'))
        setTimeout(() => {window.location = '/LoginRegister'},2000)
    }
  return (
    <div>
        {profile2.loading ? <p>Zaloguj się!</p>
        :
        <React.Fragment>
        <div className="Register">
                <div>
                    <div><h5>Uzupelnij swoje dane</h5></div>
                    <div>
                        {profile2.loading ? <p>Ładowanie...</p> :
                        <React.Fragment>
                            <div>Imię: {profile2.post[0].personalData.name}</div> 
                            <div>Nazwisko: {profile2.post[0].personalData.surname}</div> 
                            <div>Miasto: {profile2.post[0].personalData.city}</div> 
                            <div>Ulica: {profile2.post[0].personalData.street}</div> 
                            <div>Numer domu: {profile2.post[0].personalData.numberOfHome}</div> 
                            <div>Kod pocztowy: {profile2.post[0].personalData.postalCode}</div>
                        </React.Fragment> 
                        }
                    </div>
                    <div>
                        <form onSubmit={uzupelnijDane}>
                            <fieldset  className="formular">
                                <legend>Wpisz dane</legend>
                                <label>Imie</label>
                                <input type="text" onChange={(e) => setName(e.target.value)} value={name}/>
                                <label>Nazwisko</label>
                                <input type="text" onChange={(e) => setSurname(e.target.value)} value={surname}/>
                                <label>Miasto</label>
                                <input type="text" onChange={(e) => setCity(e.target.value)} value={city}/>
                                <label>Ulica</label>
                                <input type="text" onChange={(e) => setStreet(e.target.value)} value={street}/>
                                <label>Numer domu</label>
                                <input type="text" onChange={(e) => setNumberOfHome(e.target.value)} value={numberOfHome}/>
                                <label>Kod pocztowy</label>
                                <input type="text" onChange={(e) => setPostalCode(e.target.value)} value={postalCode}/>
                                <button type="submit">Uzuepłnij dane</button>
                            </fieldset>
                        </form>
                        <form onSubmit={uzupelnijDane2}>
                            <fieldset  className="formular">
                                <legend>Zmien haslo</legend>
                                <label>Stare haslo</label>
                                <input type="text" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword}/>
                                <label>Nowe haslo</label>
                                <input type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword}/>
                                <button type="submit">Zmien hasło</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <div className="MyProfileDeleteAcc" onClick={deleteAcc}>USUŃ KONTO</div>
        </React.Fragment>}
    </div>
  );
}

export default MyProfile;