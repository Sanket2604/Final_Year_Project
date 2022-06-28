import React, { useState } from 'react'
import ChatBot from '../chat_bot/chat_bot'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseChimney, faRightFromBracket, faChartLine, faMoneyBillTransfer, faUserGear, faHandHoldingDollar, faHeart, faCodeCompare } from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import './nav.css'

export default function Nav(props) {
    const [navId, setNavId] = useState()

    function navMouseOver(){
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            setNavId(ele.id)
            ele.classList.remove('active');
        })
    }

    function navMouseOut(){
        document.getElementById(navId).classList.add('active')
        document.querySelector('.nav_bar').classList.add('active')
    }

    function logout(){
        localStorage.clear()
        window.location.reload()
    }

    function activeNavEle(id){
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            ele.classList.remove('active');
        })
        setNavId(id)
        document.getElementById(id).classList.add('active')
    }

    function addActive(){
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            setNavId(ele.id)
        })
        document.querySelector('.nav_bar').classList.remove('active')
    }

    return (
        <>
            <div className={"nav_bar active"+ (props.hideNav ? " hidden":"")} onMouseOver={()=>{addActive()}} onMouseOut={()=>navMouseOut()}>
                <div className="brand">
                    <div className="logo"></div>
                </div>
                <div style={{transform: 'translateY(-10px)'}}>
                    <Link to="/dashboard">
                        <div className="nav_ele" id="1" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(1)}>
                            <FontAwesomeIcon icon={faHouseChimney} />
                            <div className="text">Dashboard</div>
                        </div>
                    </Link>
                    <Link to="/transaction_dashboard">
                        <div className="nav_ele" id="2" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(2)}>
                            <FontAwesomeIcon icon={faMoneyBillTransfer} />
                            <div className="text">Transactions</div>
                        </div>
                    </Link>
                    <Link to="/compare_price">
                        <div className="nav_ele" id="7" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(7)}>
                            <FontAwesomeIcon icon={faCodeCompare} />
                            <div className="text">Compare Price</div>
                        </div>
                    </Link>
                    <Link to="/loan_dashboard">
                        <div className="nav_ele" id="5" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(5)}>
                            <FontAwesomeIcon icon={faHandHoldingDollar} />
                            <div className="text">Loans Tracking</div>
                        </div>
                    </Link>
                    <Link to="/stock_dashboard">
                        <div className="nav_ele" id="3" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(3)}>
                            <FontAwesomeIcon icon={faChartLine} />
                            <div className="text">Stock Market</div>
                        </div>
                    </Link>
                    <Link to="/crypto_dashboard">
                        <div className="nav_ele" id="4" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(4)}>
                            <FontAwesomeIcon icon={faBitcoin} />
                            <div className="text">Cypto Market</div>
                        </div>
                    </Link>
                    <Link to="/user_settings">
                        <div className="nav_ele" id="6" onMouseOver={()=>navMouseOver()} onClick={()=>activeNavEle(6)}>
                            <FontAwesomeIcon icon={faUserGear} />
                            <div className="text">User Settings</div>
                        </div>
                    </Link>
                </div>
                <div className="logout" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></div>
            </div>
            <ChatBot />
            {/* <div className="notifications">
                <FontAwesomeIcon icon={faBell} />
            </div> */}
        </>
    )
}
