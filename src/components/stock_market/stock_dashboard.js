import React, { useEffect, useState } from 'react'
import CryptoNewsCard from '../cards/crypto_news';
import StockCard from '../cards/stock_card';
import StockDonutChart from './donut_chart';
import { stock_links } from './stock_links'
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import { useGetStockRecommendationQuery } from '../../services/stockDetailApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './stock_dashboard.css'

export default function StockDashboard() {

    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: 'Stock Market', count: 9 })
    const { data: stockRecommendation, isFetching: istockRecommendationFetching } = useGetStockRecommendationQuery()
    const [stockList, setStockList] = useState()

    useEffect(()=>{
        document.title = `CDFYP | Stock DashBoard`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
    },[])

    useEffect(() => {
        if (!istockRecommendationFetching) {
            let newData = stockRecommendation?.finance?.result[0]?.quotes.map((item) => 
                Object.assign({}, item, {logo: stock_links[item.symbol]?.[0], altlogo: stock_links[item.symbol]?.[1]})
            )
            setStockList(newData)
        }
    }, [stockRecommendation])
    
    return (
        <div className='container stock_dashboard pt-5 pb-5'>
            <div className="row mb-4">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Your Stock Investment</div>
                    <Link to="/crypto_investments" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6">
                    <StockDonutChart />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                        <div className="row invest heading">
                            <div className="col-3 data name ms-2">Name</div>
                            <div className="col-3 data pos_price ms-2">Invest Price</div>
                            <div className="col-1 data quantity ms-2">Qty</div>
                            <div className="col-3 data total_money ms-2">Total Investment</div>
                        </div>
                    </div>
                    <div className="container-fluid invest_list ms-1">
                        {[...Array(20)].map((j,i)=>
                            <div className="row invest my-2" key={i}>
                                <div className="col-3 data name ms-2">Stock Name</div>
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
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Trending Stocks</div>
                        <Link to="/stock_market" className="btn_cont"><div className='btn_ btn_small'>Show More</div></Link>
                </div>
                <StockCard stockList={stockList} recommendation={true} />
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
