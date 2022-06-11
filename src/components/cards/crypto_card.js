import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import './crypto_card.css'

export default function CryptoCard(props) {
    
    function customUnits(num){
        let unitNum=parseFloat(num)
        if(unitNum>1000){
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 2});
        }
        else if(unitNum>100){
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 5});
        }
        else{
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 10});
        }
        return(unitNum)
    }

    function reset(){
        window.location.reload()
    }

    if(props.isFetching){
        return [...Array(24)].map((j,i)=>
            <div className="col-6 col-md-3 col-lg-2 p-0" key={i}>
                <div className="crypto_card loading m-1">
                    <div className="img"></div>
                    <div className="name mt-2"></div>
                    <div className="price"></div>
                </div>
            </div> 
        )
    }
    else{
        if(props.cryptoCoins?.length>0){
            return props.cryptoCoins?.map((coin)=>
                <div className="col-6 col-sm-4 col-md-3 col-lg-2 p-0" key={coin.uuid}>
                    <Link to={`/crypto_coin/${coin.uuid }`} className="crypto_card m-1">
                        <div className="img" style={{backgroundImage: `url(${coin?.iconUrl})`}}></div>
                        <div className="name mt-2">{coin.name}</div>
                        <div className="price">
                            ₹ {customUnits(coin.price).toLocaleString('en-IN')} 
                        </div>
                        <div className="ranking">#{coin.rank}</div>
                        <div className='price_change'>
                            {coin.change>0 ? 
                                (<span className='profit'><FontAwesomeIcon icon={faCaretUp} />{coin.change}%</span>): 
                                (coin.change===0 ? 
                                    (<span className='zero'>{coin.change}%</span>):
                                    (<span className='loss'><FontAwesomeIcon icon={faCaretDown} />{Math.abs(coin.change)}%</span>))}
                        </div>
                    </Link>
                </div> 
            )
        }
        else{
            return(
                <div className="no_stock" onClick={reset}>
                    Error Click To Refresh
                </div>
            )
        }
    }
}
