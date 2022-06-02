import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import CryptoNewsCard from '../cards/crypto_news';
import LineChart from './line_chart';
import BarChartVolume from './bar_chart_volume';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { stock_links } from './stock_links'
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
import { useGetStockDetailQuery } from '../../services/stockDetailApi';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import './stock_details.css'

const { Option } = Select;

export default function StockDetails() {

    const { stockSymbol } = useParams()
    const [timeperiod, setTimeperiod] = useState('24h');
    const [inrValue, setInrValue] = useState(1)
    const [stockHistory, setStockHistory] = useState();
    const { data: stockDetail, isFetching } = useGetStockDetailQuery(stockSymbol)
    const { data: stockNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: stockSymbol + ' company', count: 9 });

    const time = ['24h', '60d', '6m', '1y', '5y', '10y', 'Max'];
    
    function customUnits(num){
        let unitNum=parseFloat(num)
        if(unitNum>10000000){
            let tempnum=num/10000000
            unitNum = tempnum.toLocaleString('en-IN', { maximumFractionDigits: 0});
            unitNum+=" Cr"
        }
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
    const technicalPointers = [
        { title: 'Share Price', value: stockDetail?.price?.regularMarketPrice.raw*inrValue, icon: <FundOutlined /> },
        { title: 'Market Cap', value: stockDetail?.summaryDetail?.marketCap.raw ? ('₹ '+customUnits(stockDetail?.summaryDetail?.marketCap.raw*inrValue)):'NA', icon: <ExclamationCircleOutlined /> },
        { title: '52 Week High', value: stockDetail?.summaryDetail?.fiftyTwoWeekHigh.raw ? ('₹ '+customUnits(stockDetail?.summaryDetail?.fiftyTwoWeekHigh.raw*inrValue)):'NA', icon: <ExclamationCircleOutlined /> },
        { title: '52 Week Low', value: stockDetail?.summaryDetail?.fiftyTwoWeekLow.raw ? ('₹ '+customUnits(stockDetail?.summaryDetail?.fiftyTwoWeekLow.raw*inrValue)):'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Total Volume', value: stockDetail?.summaryDetail?.volume.raw ? customUnits(stockDetail?.summaryDetail?.volume.raw):'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Avg. 10 Day Daily Volume', value: stockDetail?.price?.averageDailyVolume10Day.raw ? customUnits(stockDetail?.price?.averageDailyVolume10Day.raw):'NA', icon: <MoneyCollectOutlined /> },
        { title: 'Avg. 3 Month Daily Volume', value: stockDetail?.price?.averageDailyVolume3Month.raw ? customUnits(stockDetail?.price?.averageDailyVolume3Month.raw):'NA', icon: <ExclamationCircleOutlined /> },
    ]

    const otherStats = [
        { title: 'Sector Type', value: stockDetail?.assetProfile?.sector ? stockDetail?.assetProfile?.sector :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Industry', value: stockDetail?.assetProfile?.industry ? stockDetail?.assetProfile?.industry :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Exchange Name', value: stockDetail?.price?.exchangeName ? stockDetail?.price?.exchangeName :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue High', value: stockDetail?.calendarEvents?.earnings?.revenueHigh.raw ? ('₹ '+customUnits(stockDetail?.calendarEvents?.earnings?.revenueHigh.raw*inrValue)) :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue Low', value: stockDetail?.calendarEvents?.earnings?.revenueLow.raw ? ('₹ '+customUnits(stockDetail?.calendarEvents?.earnings?.revenueLow.raw*inrValue)) :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue Avg.', value: stockDetail?.calendarEvents?.earnings?.revenueAverage.raw ? ('₹ '+customUnits(stockDetail?.calendarEvents?.earnings?.revenueAverage.raw*inrValue)) :'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Dividend (Yield)', value: stockDetail?.summaryDetail?.dividendRate.raw ? (`${stockDetail?.summaryDetail?.dividendRate.raw} (${stockDetail?.summaryDetail?.dividendYield.raw?.toFixed(6) * 100}%)`) : 'NA', icon: <ExclamationCircleOutlined /> }
    ]

    useEffect(() => {
        document.title = `CDFYP | Stock Name Details`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
        getStockHistory('24h')
        const options = {
            method: 'GET',
            url: 'https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency',
            params: { have: 'USD', want: 'INR', amount: '1' },
            headers: {
                'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com',
                'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
            }
        };
        axios.request(options).then(function (response) {
            setInrValue(response.data.new_amount);
        }).catch(function (error) {
            console.error(error);
        });
    }, [])

    function getStockHistory(timeperiod) {
        setTimeperiod(timeperiod)
        let dateStart, dateEnd
        let params
        let url
        if (timeperiod === '24h') {
            params = { symbol: stockSymbol, interval: '5min', maxreturn: '150' }
            url = '/intraday'
        }
        else if (timeperiod === '14d') {
            dateStart = moment().subtract(14, 'days').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '60d') {
            dateStart = moment().subtract(2, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '6m') {
            dateStart = moment().subtract(6, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '1y') {
            dateStart = moment().subtract(12, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '5y') {
            dateStart = moment().subtract(5, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/weekly'
        }
        else if (timeperiod === '10y') {
            dateStart = moment().subtract(10, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/monthly'
        }
        else if (timeperiod === 'Max') {
            dateStart = moment().subtract(100, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/monthly'
        }
        const options = {
            method: 'GET',
            url: 'https://apistocks.p.rapidapi.com' + url,
            params,
            headers: {
                'X-RapidAPI-Host': 'apistocks.p.rapidapi.com',
                'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
            }
        };
        axios.request(options).then((response) => {
            setStockHistory(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div className="container stock_detail pt-5 pb-5">
            <div className={"heading_cont" + (isFetching ? ' loading' : '')}>
                {isFetching ?
                    <div className="image"></div> :
                    <img src={stock_links[stockDetail?.symbol][0]} alt='Error'></img>
                }
                <div className="heading ms-2">{isFetching ? '' : `${stockDetail?.quoteType?.shortName}`}</div>
            </div>
            <div className="symbol"></div>
            <div className="mt-2 sub_heading">{isFetching ? '' : `Symbol: ${stockDetail?.symbol}`}</div>
            <div className="timestamp_cont d-flex justify-content-end align-items-center">
                <span className='me-2' style={{ fontSize: '18px' }}>Timestamp:</span>
                <Select defaultValue="24h" className="select-timeperiod" style={{ width: '100px' }} placeholder="Select Timeperiod" onChange={(value) => getStockHistory(value)}>
                    {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>
            </div>
            <LineChart stockHistory={stockHistory} stockName={stockDetail?.quoteType?.shortName} timeperiod={timeperiod} isFetching={isFetching} inrValue={inrValue} />
            <BarChartVolume stockHistory={stockHistory} stockName={stockDetail?.quoteType?.shortName} timeperiod={timeperiod} isFetching={isFetching} />
            <div className="row mt-4 mb-4 user_investment">
                <div className="heading mb-3">Your Investment In {stockDetail?.quoteType?.shortName}</div>
                <div className="container-fluid">
                    <div className="row title">
                        <div className="col-2 data">Purchase</div>
                        <div className="col-2 data">Amount</div>
                        <div className="col-2 data">Date</div>
                        <div className="col-2 data">Quantity</div>
                        <div className="col-2 data">% Change</div>
                        <div className="col-2 data">Current Value</div>
                    </div>
                    <div className="row invest_data">
                        <div className="col-2 data">₹1000</div>
                        <div className="col-2 data">₹1000</div>
                        <div className="col-2 data">16/05/2022</div>
                        <div className="col-2 data">1</div>
                        <div className="col-2 data"><span className='profit'><FontAwesomeIcon icon={faCaretUp} />10%</span></div>
                        <div className="col-2 data">₹1100</div>
                        <div className="symbol buy">Buy</div>
                    </div>
                    <div className="row invest_data">
                        <div className="col-2 data">₹1000</div>
                        <div className="col-2 data">₹500</div>
                        <div className="col-2 data">17/05/2022</div>
                        <div className="col-2 data">2</div>
                        <div className="col-2 data"><span className='loss'><FontAwesomeIcon icon={faCaretDown} />10%</span></div>
                        <div className="col-2 data">₹900</div>
                        <div className="symbol sell">Sell</div>
                    </div>
                </div>
                <div className="bottom_footer pt-3">
                    <div className="left">
                        <div className="btn_cont"><div className="btn_ btn_small">Add Investment</div></div>
                    </div>
                    <div className="right">
                        <span className="total_investment me-4">Total Invested: ₹2000</span>
                        <span className="total_currentcalue">Total Current Value: ₹2000</span>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-lg-6">
                    <div className={"details_cont" + (isFetching ? " loading" : "")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "" : `${stockDetail?.quoteType?.shortName} Value Statistics`}</div>
                        </div>
                        {technicalPointers.map((stat, i) =>
                            <div className="row_details mt-2" key={i}>
                                {isFetching ?
                                    (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>) :
                                    (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                }
                                {isFetching ? (
                                    <div className="value"></div>
                                ) : (
                                    <div className="value">{stat.value}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className={"details_cont" + (isFetching ? " loading" : "")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "" : `Other Stats Info`}</div>
                        </div>
                        {otherStats.map((stat, i) =>
                            <div className="row_details mt-2" key={i}>
                                {isFetching ?
                                    (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>) :
                                    (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                }
                                {isFetching ? (
                                    <div className="value"></div>
                                ) : (
                                    <div className="value">{stat.value}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row stock_info mt-5">
                <div className="heading">About {stockDetail?.quoteType?.shortName}</div>
                <div className="company_details">
                    <div className="detail mt-3"><span>Summary:</span><br />{stockDetail?.assetProfile?.longBusinessSummary}</div>
                    <div className="detail mt-2"><span>Address: </span>{stockDetail?.assetProfile?.address1}, {stockDetail?.assetProfile?.address2 ? stockDetail?.assetProfile?.address2+', ': ''}{stockDetail?.assetProfile?.city} - {stockDetail?.assetProfile?.zip}, {stockDetail?.assetProfile?.state}, {stockDetail?.assetProfile?.country} </div>
                    <div className="detail mt-2"><span>Phone: </span>{stockDetail?.assetProfile?.phone}</div>
                    <div className="detail mt-2"><span>Website: </span><a href={stockDetail?.assetProfile?.website} target='_blank'>{stockDetail?.assetProfile?.website}</a></div>
                    <div className="detail mt-2"><span>Number Of Full Time Employee: </span>{stockDetail?.assetProfile?.fullTimeEmployees ? stockDetail?.assetProfile?.fullTimeEmployees : 'Data Not Available'}</div>
                </div>
            </div>
            {stockDetail?.assetProfile?.companyOfficers?.length > 0 ?
                (
                    <div className="row stock_info mt-5">
                        <div className="heading">Top Executives of {stockDetail?.quoteType?.shortName}</div>
                        <div className="company_details container-fluid my-4">
                            <div className="row">
                                <div className="col-2"></div>
                                <div className="col-3 title noboder">Name</div>
                                <div className="col-5 title">Title</div>
                            </div>
                            {stockDetail?.assetProfile?.companyOfficers?.map((person, i) =>
                                <div className="row" key={i}>
                                    <div className="col-2"></div>
                                    <div className="col-3 details noboder">{person?.name}</div>
                                    <div className="col-5 details">{person?.title}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (<></>)
            }
            {stockNews?.value?.length > 0 ?
                (<div className="row stock_info mt-5">
                    <div className="heading mb-4">Recent News of {stockDetail?.quoteType?.shortName}</div>
                    <CryptoNewsCard isFetching={isNewsFetching} cryptoNews={stockNews} />
                </div>) : (<></>)
            }
            <div className="source_name">Source: {stockDetail?.price?.quoteSourceName}</div>
        </div>
    )
}
