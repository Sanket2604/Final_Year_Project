import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Nav from './components/nav/nav';
import DialogBox from './components/modal/modal';
import Home from './components/home/home';
import StockDashboard from './components/stock_market/stock_dashboard';
import StockNews from './components/stock_market/stock_news';
import StockMarket from './components/stock_market/stock_market';
import StockDetails from './components/stock_market/stock_details';
import CryptoDashboard from './components/crypto_market/crypto_dashboard';
import CryptoCurrencies from './components/crypto_market/crypto_currencies';
import CryptoCoinDetail from './components/crypto_market/coin_detail';
import CryptoCurrenciesNews from './components/crypto_market/crypto_news';

function App() {
  const [modal, setModal] = useState({open: false, header: "", body: ""})

  function closeModal(){
    setModal({open: !modal.open})
  }
  
  function triggerModal(header, body){
    setModal({
      open: !modal.open,
      header: header,
      body: body  
    })
  }
  return (
    <BrowserRouter>
        <Nav /> 
        <DialogBox modal={modal} closeModal={closeModal} />
        <Switch>
            <Route exact path="/dashboard" component={()=><Home />} />
            <Route exact path="/stock_dashboard" component={()=><StockDashboard />} />
            <Route exact path="/stock_news" component={()=><StockNews />} />
            <Route exact path="/stock_market" component={()=><StockMarket />} />
            <Route exact path="/stock_market/:stockSymbol" component={()=><StockDetails />} />
            <Route exact path="/crypto_dashboard" component={()=><CryptoDashboard />} />
            <Route exact path="/crypto_market" component={()=><CryptoCurrencies />} />
            <Route exact path="/crypto_coin/:coinId" component={()=><CryptoCoinDetail />} />
            <Route exact path="/crypto_news" component={()=><CryptoCurrenciesNews />} />
            <Redirect to="/dashboard" />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
