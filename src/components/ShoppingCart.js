import React, {useEffect,useReducer} from 'react';
import axios from 'axios'
import {getJwt} from '../jwt'

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

const ShoppingCart = (props) => {

    const [charms,dispatch] = useReducer(reducer,initialState)

    useEffect(() => {
        const jwt = getJwt()
        axios.get("http://localhost:5000/Pandora/shoppingCart",{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => {
            dispatch({type:FETCH_SUCCESS,payload:res.data})
            console.log("Pomyslne APi")
        })
        .catch(err => {
            dispatch({type:FETCH_FAIL,payload:err.msg})
            console.log("Błąd APi")
        })
    },[])

    const wyczyscKoszyk = () => {
        const jwt = getJwt()
        axios.delete(`http://localhost:5000/Pandora/shoppingCart/cleanShoppingCart`,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Wyczyszczono koszyk'))
        .catch(err => console.log('Błąd!'))
        setTimeout(() => {window.location='/ShoppingCart'},500)
    }

    const usunKarte = (id) => {
        console.log(id)
        const jwt = getJwt()
        axios.post(`http://localhost:5000/Pandora/shoppingCart/cleanShoppingCart2/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Wyczyszczono koszyk'))
        .catch(err => console.log('Błąd!'+err.msg))
        setTimeout(() => {window.location='/ShoppingCart'},500)
    }

    console.log(charms)
    const jwt = getJwt()
    return (
        
        <div className="shoppingCart">
            {charms.post.length==0 ? <p>Twoj koszyk jest pusty</p> : !jwt ? <p>Zaloguj sie</p> :
            <React.Fragment>
                <div className="shoppingCart-one">
                {charms.loading ? <p>Loading...</p> : charms.post.shoppingCart.map((item) => <SingleCart key={item._id} deleteCard={() => usunKarte(item.product._id)} item={item}/>)}
            </div>

            <div className="shoppingCart-two">
                <div className="shoppingCart-two-inside">
                    <div>
                        {charms.loading ? <p>Loading...</p> :
                        <React.Fragment>
                            <h4>Twój koszyk</h4>
                            <b>Ostateczna cena: {charms.post.shoppingCartTotalPrice} zł</b>
                            <p>Ilość produktów: {charms.post.shoppingCartTotalQuantity}</p>
                        </React.Fragment>
                        }
                    </div>
                    <div className="shoppingCart-button"><p>ZAMAWIAM</p></div>
                    <div className="shoppingCart-button" onClick={wyczyscKoszyk}><p>WYCZYŚĆ KOSZYK</p></div>
                </div>
            </div>
            </React.Fragment>
            }
        </div>
    )
}

export default ShoppingCart;

const SingleCart = (props) => {
    
    return (
        <div className="shoppingCart-one-card">
            <div><img src={props.item.product.charmPhotos[0]}  width="200px" alt="Loading..."/></div>
            <div className="shoppingCart-one-card-desc">
                <div>
                    <b>Produkt: {props.item.product.charmName}</b>
                    <p>Cena: {props.item.product.charmPrice} zł</p>
                    <p>Ilość: {props.item.totalQuantity} szt.</p>
                </div>
                <div className="shoppingCart-delete">
                    <div onClick={props.deleteCard} className="shoppnigCart-deleteButton"><p>Usuń</p></div>
                </div>
            </div>
        </div>
    )
}