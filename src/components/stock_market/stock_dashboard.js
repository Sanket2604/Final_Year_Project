import React, { useEffect, useState } from 'react'
import CryptoNewsCard from '../cards/crypto_news';
import StockCard from '../cards/stock_card';
import StockDonutChart from './donut_chart';
import axios from 'axios'
import moment from 'moment'
import { url } from '../../url'
import { stock_links } from './stock_links'
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import { useGetStockRecommendationQuery } from '../../services/stockDetailApi'
import { Link } from 'react-router-dom'
import './stock_dashboard.css'

export default function StockDashboard() {

    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: 'Stock Market', count: 9 })
    const { data: stockRecommendation, isFetching: istockRecommendationFetching } = useGetStockRecommendationQuery()
    const [activeInvestment, setActiveInvestment] = useState([])
    const [stockList, setStockList] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Stock DashBoard`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/stock/getStockInvestment', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setActiveInvestment(res.data.activeInvestment)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            window.location.replace("/login")
        }
    }, [])

    useEffect(() => {
        if (!istockRecommendationFetching) {
            let newData = stockRecommendation?.finance?.result[0]?.quotes.map((item) =>
                Object.assign({}, item, { logo: stock_links[item.symbol]?.[0], altlogo: stock_links[item.symbol]?.[1] })
            )
            setStockList(newData)
        }
    }, [stockRecommendation])

    function customUnits(num) {
        let unitNum = parseFloat(num)
        if (unitNum > 10000000) {
            let tempnum = num / 10000000
            unitNum = tempnum.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            unitNum += " Cr"
        }
        if (unitNum > 1000) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        }
        else if (unitNum > 100) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 5 });
        }
        else {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 10 });
        }

        return (unitNum)
    }

    return (
        <div className='container stock_dashboard pt-5 pb-5'>
            <div className="row mb-4">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Your Stock Investment</div>
                    <Link to="/user_stock_investments" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                {activeInvestment?.investments?.length > 0 ?
                    <>
                        <div className="col-12 col-lg-6">
                            <StockDonutChart investments={activeInvestment?.investments} />
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                                <div className="row invest heading">
                                    <div className="col-2 data pos">Date</div>
                                    <div className="col-3 data name">Name</div>
                                    <div className="col-3 data pos_price">Invest Price</div>
                                    <div className="col-1 data quantity">Qty</div>
                                    <div className="col-3 data total_money">Total</div>
                                </div>
                            </div>
                            <div className="container-fluid invest_list ms-1">
                                {activeInvestment?.investments.map(invst =>
                                    <Link to={`/stock_market/${invst.symbol}`} className="row invest my-2" key={invst._id}>
                                        <div className="col-2 data date">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-3 data name">{invst.name}</div>
                                        <div className="col-3 data pos_price">₹ {customUnits(invst.boughtAt)}</div>
                                        <div className="col-1 data quantity">{customUnits(invst.quantity)}</div>
                                        <div className="col-3 data total_money">₹ {customUnits(invst.investment)}</div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>
                }
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
                <CryptoNewsCard cryptoNews={cryptoNews} isFetching={isNewsFetching} />
            </div>
        </div>
    )
}
