import React, {useEffect} from 'react'
import CryptoCard from '../cards/crypto_card';
import CryptoNewsCard from '../cards/crypto_news';
import CryptoDonutChart from './donut_chart';
import { Link } from 'react-router-dom';
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import './crypto_dashboard.css'


export default function CryptoDashboard() {

    const { data, isFetching } = useGetCryptosQuery(20)
    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: 'Cryptocurrency', count: 9 })
    const cryptoCoins = data?.data?.coins

    useEffect(()=>{
        document.title = `CDFYP | Crypto DashBoard`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
    },[])

    return (
        <div className="container crypto_dashboard pt-4 pb-5">
            <div className="row mb-4">
                <div className="col-12 heading_cont mt-4 mb-4">
                    <div className="heading">Cryptocurrency Dashboard</div>
                    <Link to="/user_crypto_investments" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6">
                    <CryptoDonutChart />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="container-fluid invest_list heading_sec ms-1">
                        <div className="row invest heading">
                            <div className="col-1 data">Logo</div>
                            <div className="col-3 data name ms-2">Name</div>
                            <div className="col-3 data pos_price ms-2">Invest Price</div>
                            <div className="col-1 data quantity ms-2">Qty</div>
                            <div className="col-3 data total_money ms-2">Total Investment</div>
                        </div>
                    </div>
                    <div className="container-fluid invest_list ms-1">
                        {[...Array(20)].map((j,i)=>
                            <div className="row invest my-2">
                                <div className="col-1 data"><div className="logo" style={{backgroundImage: `url(https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg)`}}></div></div>
                                <div className="col-3 data name ms-2">Coin Name</div>
                                <div className="col-3 data pos_price ms-2">₹ 10000</div>
                                <div className="col-1 data quantity ms-2">x2</div>
                                <div className="col-3 data total_money ms-2">₹ 20000
                                    <div className='change ms-2'>
                                    {true>0 ? 
                                        (<span className='profit'><FontAwesomeIcon icon={faCaretUp} />{10}%</span>): 
                                        (2===0 ? 
                                            (<span className='zero'>{0}%</span>):
                                            (<span className='loss'><FontAwesomeIcon icon={faCaretDown} />{Math.abs(10)}%</span>))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 heading_cont mt-4 mb-4">
                    <div className="heading">Top 20 Crypto Currencies In the World</div>
                    <Link to="/crypto_market" className="btn_cont"><div className='btn_ btn_small'>Show More</div></Link>
                </div>
                <CryptoCard cryptoCoins={cryptoCoins} isFetching={isFetching} />
            </div>
            <div className="row">
                <div className="col-12 heading_cont mt-4 mb-4">
                    <div className="heading">Latest Cryptocurrency News</div>
                    <Link to="/crypto_news" className="btn_cont"><div className='btn_ btn_small'>Show More</div></Link>
                </div>
                <CryptoNewsCard cryptoNews={cryptoNews} isFetching={isNewsFetching}/>
            </div>
        </div>
    )
}
