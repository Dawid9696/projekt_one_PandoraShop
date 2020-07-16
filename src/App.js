import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.scss'

import Charms from './components/Charms'
import ProductDetail from './components/ProductDetail'
import Home from './components/Home'
import LoginRegister from './components/LoginRegister'
import MyProfile from './components/MyProfile'
import ShoppingCart from './components/ShoppingCart'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar/>
        <Switch>
          <Route path={'/Charms'} exact component={Charms}/>
          <Route path={'/ProductDetail/:id'} exact component={ProductDetail}/>
          <Route path={'/Home'} exact component={Home}/>
          <Route path={'/LoginRegister'} exact component={LoginRegister}/>
          <Route path={'/MyProfile'} exact component={MyProfile}/>
          <Route path={'/ShoppingCart'} exact component={ShoppingCart}/>
        </Switch>
      <Footer/>
    </Router>
  );
}

export default App;
