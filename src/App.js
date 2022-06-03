import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Nav from './components/nav/nav';
import DialogBox from './components/modal/modal';
import Home from './components/home/home';
import TransactionDashboard from './components/transaction/transaction_dashboard';
import TransactionDetails from './components/transaction/transaction_details'
import CategoryDetails from './components/transaction/category_details';
import SpecificCategory from './components/transaction/specific_category';
import LoanDashboard from './components/loan_tracker/loan_dashboard';
import LenderDetails from './components/loan_tracker/lender_details';
import BorrowerDetails from './components/loan_tracker/borrower_details';
import StockDashboard from './components/stock_market/stock_dashboard';
import StockNews from './components/stock_market/stock_news';
import StockMarket from './components/stock_market/stock_market';
import UserStock from './components/stock_market/user_stock';
import StockDetails from './components/stock_market/stock_details';
import CryptoDashboard from './components/crypto_market/crypto_dashboard';
import CryptoCurrencies from './components/crypto_market/crypto_currencies';
import CryptoCoinDetail from './components/crypto_market/coin_detail';
import UserCrypto from './components/crypto_market/user_crypto';
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
            <Route exact path="/transaction_dashboard" component={()=><TransactionDashboard />} />
            <Route exact path="/transaction_details" component={()=><TransactionDetails />} />
            <Route exact path="/category_details" component={()=><CategoryDetails />} />
            <Route exact path="/category_details/:catName" component={()=><SpecificCategory />} />
            <Route exact path="/loan_dashboard" component={()=><LoanDashboard />} />
            <Route exact path="/lender_details" component={()=><LenderDetails />} />
            <Route exact path="/borrower_details" component={()=><BorrowerDetails />} />
            <Route exact path="/stock_dashboard" component={()=><StockDashboard />} />
            <Route exact path="/stock_news" component={()=><StockNews />} />
            <Route exact path="/stock_market" component={()=><StockMarket />} />
            <Route exact path="/user_stock_investments" component={()=><UserStock />} />
            <Route exact path="/stock_market/:stockSymbol" component={()=><StockDetails />} />
            <Route exact path="/crypto_dashboard" component={()=><CryptoDashboard />} />
            <Route exact path="/crypto_market" component={()=><CryptoCurrencies />} />
            <Route exact path="/crypto_coin/:coinId" component={()=><CryptoCoinDetail />} />
            <Route exact path="/user_crypto_investments" component={()=><UserCrypto />} />
            <Route exact path="/crypto_news" component={()=><CryptoCurrenciesNews />} />
            <Redirect to="/dashboard" />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
