import React from 'react'
import moment from 'moment'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend }from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import './line_chart.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



export default function LineChart({ coinHistory, currentPrice, coinName, timeperiod, isFetching, isHistoryFetching, coinColour, timeRange }) {

    const coinPrice = []
    const coinTimestamp = []

    for(let i=coinHistory?.data?.history?.length-1; i>=0; i--){
        coinPrice.push(coinHistory.data.history[i].price)
        if(timeRange==='24h'||timeRange==='3h'){
            coinTimestamp.push(moment(coinHistory?.data?.history[i].timestamp*1000).format("hh:mm A"));
        }
        else{
            coinTimestamp.push(moment(coinHistory?.data?.history[i].timestamp*1000).format("DD/MM/YYYY"));
        }
    }

    const gridColor = true ? "rgba(86, 86, 86, 0.69)" : "#989898"
    const axisTextColor = true ? "white" : "black"

    const data = {
        labels: coinTimestamp,
        datasets: [{
            label: 'Price in INR',
            data: coinPrice,
            fill: false,
            backgroundColor: coinColour ? coinColour:'#0071bd',
            borderColor: coinColour ? coinColour:'#0071bd',
        }],
    };
    const time = ['30d', '3m', '1y', '3y', '5y'];
    let options
    if(time.includes(timeperiod)){
        options = {
            elements: {
                point:{
                    radius: 2
                }
            },
            scales: {
                xAxes: {
                    grid: {
                        color: gridColor
                    },
                    ticks:{
                        color: axisTextColor,
                    }
                },
                yAxes: {
                    grid: {
                        color: gridColor,
                    },
                    ticks: {
                        color: axisTextColor,
                        callback: (value, index, values) => {
                            if(value>10){
                                return new Intl.NumberFormat('en-IN',{
                                    style: 'currency',
                                    currency: 'INR',
                                }).format(value)
                            }
                            return new Intl.NumberFormat('en-IN',{
                                style: 'currency',
                                currency: 'INR',
                            }).format(value)
                        } 
                    },
                },
            },
        };
    }
    else{
        options = {
            locale:'en-IN',
            scales: {
                xAxes: {
                    grid: {
                        color: gridColor
                    },
                    ticks:{
                        color: axisTextColor,
                    }
                },
                yAxes: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: axisTextColor,
                        callback: (value, index, values) => {
                            if(value>10){
                                return new Intl.NumberFormat('en-IN',{
                                    style: 'currency',
                                    currency: 'INR',
                                }).format(value)
                            }
                            return new Intl.NumberFormat('en-IN',{
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 5
                            }).format(value)
                        } 
                    },
                },
            },
        };
    }


    return (
        <div className="chart_cont mt-3 mb-3">
            <div className="heading_cont">
                <div className={"heading"+(isFetching ? " loading":"")}>{isFetching ? '':`${coinName} Price Chart`}</div>
                {!isHistoryFetching ?
                    (
                        <div className="price">Current Price: ₹ {currentPrice}
                            <span className='price_change'>
                                {coinHistory?.data?.change>0 ? 
                                    (<span className='profit'><FontAwesomeIcon icon={faCaretUp} />{coinHistory?.data?.change}%</span>): 
                                    (coinHistory?.data?.change===0 ? 
                                        (<span className='zero'>{coinHistory?.data?.change}%</span>):
                                        (<span className='loss'><FontAwesomeIcon icon={faCaretDown} />{Math.abs(coinHistory?.data?.change)}%</span>))}
                            </span>
                        </div>
                    ):<div className="price loading"></div>
                }
            </div>
            <Line data={data} options={options} />
        </div>
    )
}
