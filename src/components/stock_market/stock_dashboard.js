import React, { useEffect } from 'react'
import CryptoNewsCard from '../cards/crypto_news';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import { Link } from 'react-router-dom'
import './stock_dashboard.css'

export default function StockDashboard() {

    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: 'Stock Market', count: 9 })

    useEffect(()=>{
        document.title = `CDFYP | Crypto DashBoard`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
    },[])

    return (
        <div className='container stock_dashboard mt-5 mb-5'>
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Top Companies Stocks</div>
                        <Link to="/stock_market" className="btn_cont"><div className='btn_ btn_small'>Show More</div></Link>
                </div>
            </div>
            <div className="row">
                <div className="col-12 heading_cont mt-4 mb-4">
                    <div className="heading">Latest Stock Market News</div>
                        <Link to="/stock_news" className="btn_cont"><div className='btn_ btn_small'>Show More</div></Link>
                </div>
                <CryptoNewsCard cryptoNews={cryptoNews} isFetching={isNewsFetching}/>
            </div>
        </div>
    )
}
