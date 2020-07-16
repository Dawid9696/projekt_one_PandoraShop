import React, {useState,useEffect,useReducer} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { FaComments } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAIL = 'FETCH_FAIL';

const initialState = {
    loading:true,
    post:{},
    error:''
}

const reducer = (state,action) => {
    switch(action.type) {
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

const Charms = () => {

    const [param,setParam] = useState()

    const [charms,dispatch] = useReducer(reducer,initialState)

    useEffect(() => {
        axios.get(`http://localhost:5000/Pandora/charms?limit=${param}`)
        .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
        .catch(err => dispatch({type:FETCH_FAIL,payload:err.msg}))
    },[param])
    console.log(charms)

    return (
        <div className="catalog">
            <div className="catalog-content-filtertab">
                <div className="LateralFilterTab">
                <div className="LateralFilterTab-card"><p>Kolor</p></div>
                <div className="LateralFilterTab-card"><p>Motyw</p></div>
                <div className="LateralFilterTab-card"><p>Metal</p></div>
                <div className="LateralFilterTab-card"><p>Kolekcja</p></div>
                <div className="LateralFilterTab-card"><p>Wymiary</p></div>
        </div>
            </div>
            <div className="catalog-content-main">
                <div className="catalog-content-main-filtertab">
                    <div className="UpperFilterTab">

                        <div className="UpperFilterTab-card">
                            <div><b>Cena</b></div>
                            <div>Wyświetl: <input type="text" placeholder="Wpisz liczbe" onChange={(e) => setParam(e.target.value)}/></div>
                            <div>Cena rosnąco <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>Cena malejąco <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>0 -100 <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>100 - 200 <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>200 - 300 <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                        </div>

                        <div className="UpperFilterTab-card">
                            <div><b>Oceny</b></div>
                            <div>Oceny rosnąco <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>Oceny malejąco <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>Najlepsze 4 <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                        </div>

                        <div className="UpperFilterTab-card">
                            <div><b>Oceny</b></div>
                            <div>Najczęściej oceniane <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>Najmniej oceniane <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                        </div>

                        <div className="UpperFilterTab-card">
                            <div><b>Nowości</b></div>
                            <div>Najnowsze <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                            <div>Najstarsze <input type="checkbox" name="Od najniższej" title="Od najniższej"/></div>
                        </div>

                    </div>
                </div>
                <div className="catalog-content-main-cards">
                {charms.loading ? <p>Loading...</p> : charms.post.map(charm =>
                     <Card 
                        key={charm._id} 
                        id={charm._id}
                        name={charm.charmName} 
                        picture={charm.charmPhotos} 
                        price={charm.charmPrice} 
                        ratio={charm.overallRatio}
                        numberRatio={charm.numberRatio}
                     />)}
                </div>
            </div>
        </div>
    )
}

export default Charms;

const Card = (props) => {

        return (
            <Link className="productCard" to={`/ProductDetail/${props.id}`}>
                <div className="productCard-photo"><img className="productCard-image" src={props.picture} alt="Loading" description={props.name} title={props.name} height="300px" width="270px"/></div>
                <div className="productCard-desc">
                    <h5 style={{color:"Black"}}>{props.name}</h5>
                    <p style={{color:"red"}}>{props.price} zł</p>
                    <p>Ocena ogólna: {props.ratio}<AiFillStar/>   ({props.numberRatio} <FaComments/>)</p>
                </div>
            </Link>
        )
    }