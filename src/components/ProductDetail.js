import React, {useState,useEffect,useReducer} from 'react';
import axios from 'axios'
import {getJwt} from '../jwt'
import { FaComments } from 'react-icons/fa';

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

const ProductDetail = (props) => {

    const [product,dispatch] = useReducer(reducer,initialState)
    const [comment,setComment] = useState()
    const [ratio,setRatio] = useState(5)

    useEffect(() => {
        axios.get(`http://localhost:5000/Pandora/charms/${props.match.params.id}`)
        .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
        .catch(err => dispatch({type:FETCH_FAIL,payload:err.msg}))
    },[props.match.params.id])

    const dodajDoKoszyka = () => {
        const jwt = getJwt()
        axios.patch(`http://localhost:5000/Pandora/shoppingCart/update/${props.match.params.id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Dodano do koszyka'))
        .catch(err => console.log('Błąd!'))
        window.alert('Dodano do koszyka')
    }

    const koszyk = () => {
        setTimeout(() => {window.location = '/ShoppingCart'},500)
    }

    const dodajKomentarz = (e) => {
        e.preventDefault()
        const newComment = {opinion:comment,ratio}
        const jwt = getJwt()
        axios.post(`http://localhost:5000/Pandora/addCharmComment/${props.match.params.id}`,newComment,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Dodano komentarz'))
        .catch(err => console.log('Nie dodano komantarza!'))
        setComment('')
        setTimeout(() => {window.location = `/ProductDetail/${props.match.params.id}`},1000)
    }

    const usunKomentarz = (id) => {
        const jwt = getJwt()
        axios.delete(`http://localhost:5000/Pandora/deleteCharmComment/${props.match.params.id}/comment/${id}`,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Usunieto komentarz'))
        .catch(err => console.log('Nie usunieto komantarza!'))
        setComment('')
        setTimeout(() => {window.location = `/ProductDetail/${props.match.params.id}`},1000)
    }

console.log(product)
    return (
        <div className="productDetail">

            {product.loading ? <p>Loading...</p> :
            <React.Fragment>
            <div className="ProductDetail-one">
                <div className="ProductDetail-smallPhotos">
                    {product.post[0].charmPhotos.map((charm) => <div><img  width="75px" src={charm} alt="Loading..."/></div>)}
                </div>
                <div className="ProductDetail-bigPhoto">
                    <img className="bigPhoto-image" src={product.post[0].charmPhotos[0]} alt="Loading..."/>
                </div>
                <div className="ProductDetail-info">
                    <div>
                        {product.post[0].newCharm && <h3>Nowość !</h3>}
                        <b>{product.post[0].charmName}</b>
                        <p>Cena: {product.post[0].charmPrice} zł</p>
                        <p>Ocena ogólna: {product.post[0].overallRatio} ({product.post[0].numberRatio} <FaComments/>)</p>
                    </div>
                    <div>
                        <div className="ProductDetail-button" onClick={dodajDoKoszyka}>Dodaj do koszyka</div>
                        <div className="ProductDetail-button" onClick={koszyk}>Przejdz do koszyka</div>
                        <div className="ProductDetail-button">Wyślij email</div>
                    </div>
                </div>
            </div>

            <div className="ProductDetail-two">
                <div className="ProductDetail-desc">
                    <h1>Informacje</h1>
                    <p>{product.post[0].charmInfo}</p>
                </div>
                <div className="ProductDetail-properites">
                    <div className="productDetail-card">
                        <div><b>Kolekcja</b></div>
                        <div>{product.post[0].charmCollection}</div>
                    </div>
                    <div className="productDetail-card">
                        <div><b>Metal</b></div>
                        <div>{product.post[0].charmMetal}</div>
                    </div>
                    <div className="productDetail-card">
                        <div><b>Kolor</b></div>
                        <div>{product.post[0].charmColor}</div>
                    </div>
                    <div className="productDetail-card">
                        <div><b>Motyw</b></div>
                        <div>{product.post[0].charmMotiv}</div>
                    </div>
                    <div className="productDetail-card">
                        <div><b>Wymiary</b></div>
                        <div>
                            <div>Głębokość: {product.post[0].charmDimension.deep}</div>
                            <div>Szerokość: {product.post[0].charmDimension.width}</div>
                            <div>Wysokość: {product.post[0].charmDimension.height}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ProductDetail-three">
                <div><h3>Opinie</h3></div>
                <div className="ProductDetail-comments">
                    {product.loading ? <p>Loading..</p> : product.post[0].comments.length==0
                     ? <p>Brak komentarzy</p> : product.post[0].comments.map((item) => 
                     <SingleComment key={item._id} login={product.post[0].login} item={item} 
                     deleteComment={() => usunKomentarz(item._id)}
                     />) }
                </div>
                <div>
                    <form onSubmit={dodajKomentarz}> 
                    <input type="textarea" placeholder="Wpisz komentarz..." onChange={(e) => setComment(e.target.value)} value={comment}/><br/>
                    <label>Ocena: {ratio}</label><br/>
                    <input type="range" min="0" max="10"  onChange={(e) => setRatio(e.target.value)} value={ratio}/><br/>
                        <button type='submit'>Dodaj</button>
                    </form>
                </div>
            </div>
            </React.Fragment>
            }

        </div>
    )
}

export default ProductDetail;

const SingleComment = (props) => {
    const jwt = getJwt()
    const {opinion,ratio,postedBy} = props.item
    return (
        <div className="ProductDetail-comment">
            <q style={{fontSize:"18px"}}>{opinion}</q>
            <p style={{fontSize:"12px"}}>Użytkownik: {postedBy.login} </p>
            <b>Ocena: {ratio} </b>
            {postedBy.tokens.every((item) => {
                console.log(item.token)
                console.log(jwt+"To jest jwt")
                return item.token != jwt
            }) ? <p></p> : <p className="ProductDetail-comment-button" onClick={props.deleteComment}>Usuń komentarz</p> }
        </div>
    )
}