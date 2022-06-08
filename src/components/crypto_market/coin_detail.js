import React , {useState, useEffect} from 'react'
import HTMLReactParser from 'html-react-parser'
import LineChart from './line_chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useGetCryptoHistoryQuery, useGetCryptoDetailsQuery } from '../../services/cryptoApi'
import './coin_detail.css'

const { Option } = Select;

export default function CryptoCoinDetail() {

    const { coinId } = useParams()
    const [timeperiod, setTimeperiod] = useState('7d');
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId)
    const { data: coinHistory, isFetching: isHistoryFetching } = useGetCryptoHistoryQuery({coinId, timeperiod})
    const cryptoDetails = data?.data?.coin;
    const time = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y'];
    let volume24h
    if(cryptoDetails){
        volume24h = cryptoDetails['24hVolume']
    }

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

    function supplyUnits(num){
        let unitNum = parseFloat(num)
        unitNum = unitNum?.toLocaleString('en-IN', { maximumFractionDigits: 0});
        return `${unitNum} ${cryptoDetails?.symbol}`
    }

    const stats = [
        { title: 'Price to USD', value: `₹ ${cryptoDetails?.price && customUnits(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `₹ ${volume24h && customUnits(volume24h)}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `₹ ${cryptoDetails?.marketCap && customUnits(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high', value: `₹ ${cryptoDetails?.allTimeHigh?.price && customUnits(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
    ];
    
    const genericStats = [
        { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: cryptoDetails?.supply?.total===null ? 'Unlimited Supply': supplyUnits(cryptoDetails?.supply?.total), icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: supplyUnits(cryptoDetails?.supply?.circulating), icon: <ExclamationCircleOutlined /> },
    ];

    useEffect(()=>{
        document.title = `CDFYP | Coin Detail`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
    },[])

    return (
        <div className="container coin_details pt-5 pb-5">
            <div className={"heading_cont"+(isFetching?' loading':'')}>
                <div className="image" style={{backgroundImage: `url(${cryptoDetails?.iconUrl})`}}></div>
                <div className="heading ms-2">{isFetching?'':`${cryptoDetails?.name}`}</div>
            </div>
            <div className="mt-2 sub_heading">{isFetching?'':`${cryptoDetails?.name} live price in Indian Rupee (INR). View value statistics, market cap and supply.`}</div>
            <div className="timestamp_cont">
                <span className='me-2' style={{fontSize: '18px'}}>Duration:</span>
                <Select defaultValue="7d" className="select-timeperiod" style={{width: '100px'}} placeholder="Select Timeperiod" onChange={(value) => setTimeperiod(value)}>
                    {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>
            </div>
            <LineChart coinHistory={coinHistory} timeRange={timeperiod} coinColour={cryptoDetails?.color} currentPrice={customUnits(cryptoDetails?.price)} coinName={cryptoDetails?.name} timeperiod={timeperiod} isFetching={isFetching} isHistoryFetching={isHistoryFetching} />
            <div className="row mt-4 mb-4 user_investment">
                <div className="heading mb-3">Your Investment In {cryptoDetails?.name}</div>
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
                    </div>
                    <div className="row invest_data">
                        <div className="col-2 data">₹1000</div>
                        <div className="col-2 data">₹500</div>
                        <div className="col-2 data">17/05/2022</div>
                        <div className="col-2 data">2</div>
                        <div className="col-2 data"><span className='loss'><FontAwesomeIcon icon={faCaretDown} />10%</span></div>
                        <div className="col-2 data">₹900</div>
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
                    <div className={"details_cont"+(isFetching ? " loading":"")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "":`${cryptoDetails?.name} Value Statistics`}</div>
                            <div className="text">{isFetching ? "":`An overview showing the statistics of ${cryptoDetails?.name}, such as the base and quote currency, the rank, and trading volume.`}</div>
                        </div>
                            {stats.map((stat, i)=>
                                <div className="row_details mt-2" key={i}>
                                    {isFetching ? 
                                        (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>):
                                        (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                    }
                                    {isFetching ? (
                                        <div className="value"></div>
                                    ):(
                                        <div className="value">{stat.value}</div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className={"details_cont"+(isFetching ? " loading":"")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "":`Other Stats Info`}</div>
                            <div className="text">{isFetching ? "":`An overview showing the statistics of ${cryptoDetails?.name}, such as the base and quote currency, the rank, and trading volume.`}</div>
                        </div>
                            {genericStats.map((stat, i)=>
                                <div className="row_details mt-2" key={i}>
                                    {isFetching ? 
                                        (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>):
                                        (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                    }
                                    {isFetching ? (
                                        <div className="value"></div>
                                    ):(
                                        <div className="value">{stat.value}</div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-lg-6">
                    {isFetching ? (
                            <div className="about_crpto loading">
                                <div className="title"></div>
                                {[...Array(5)].map((j,i)=>
                                    <div key={i}>
                                        <div className="heading"></div>
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="line half"></div>
                                    </div>
                                )}
                                </div>
                        ):(
                            <div className="about_crpto">
                                <div className="title">What is {cryptoDetails?.name}?</div>
                                {isFetching ? (<></>):HTMLReactParser(cryptoDetails.description) }
                            </div>
                        )
                    }
                </div>
                <div className="col-12 col-lg-6">
                    {isFetching ?
                        (
                            <div className="link_crpto loading">
                                <div className="title mb-3"></div>
                                {[...Array(5)].map((j,i) => 
                                    <div className="row_details" key={i}>
                                        <div className="title"></div>
                                        <div className="value"></div>
                                    </div>
                                )}
                            </div>
                        ):(
                            <div className="link_crpto">
                                <div className="title mb-2">{cryptoDetails?.name} Links</div>
                                {cryptoDetails?.links?.map((link, i) => 
                                    <div className="row_details" key={i}>
                                        <div className="link_type">{link.type}</div>
                                        <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
