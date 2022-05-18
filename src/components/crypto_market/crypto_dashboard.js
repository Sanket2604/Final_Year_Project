import React, {useEffect} from 'react'
import CryptoCard from '../cards/crypto_card';
import CryptoNewsCard from '../cards/crypto_news';
import { Link } from 'react-router-dom';
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
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
