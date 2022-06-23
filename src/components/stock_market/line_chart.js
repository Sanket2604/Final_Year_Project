import React, {useState, useEffect} from 'react'
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

export default function LineChart({ stockHistory, stockName, timeperiod, isFetching, inrValue }) {

    const [datasets, setDataSets] = useState([])
    let stockChartOpen = []
    let stockChartHigh = []
    let stockChartLow = []
    let stockTimestamp = []
    const borderWidth = 2
    
    for(let i=0; i<=stockHistory?.Results.length-1; i++){
        stockChartOpen.push((stockHistory.Results[i].High*inrValue+stockHistory.Results[i].Low*inrValue)/2)
        stockChartHigh.push(stockHistory.Results[i].High*inrValue)
        stockChartLow.push(stockHistory.Results[i].Low*inrValue)
        if(timeperiod==='24h'){
            stockTimestamp.push(moment(stockHistory?.Results[i].Date).format("hh:mm A"));
        }
        else{
            stockTimestamp.push(moment(stockHistory?.Results[i].Date).format("DD/MM/YYYY"));
        }
    }

    useEffect(()=>{
        setDataSets([{
            label: 'Average',
            data: stockChartOpen,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: '#0071bd',
            borderWidth: borderWidth,
            pointRadius: borderWidth,
        }])
        document.getElementById('avg').classList.add('active')
    },[stockHistory])
    
    const gridColor = true ? "rgba(86, 86, 86, 0.69)" : "#989898"
    const axisTextColor = true ? "white" : "black"

    function selectRadioButton(id){
        const ele = document.getElementById(id)
        if(ele.classList.contains('active')){
            if(datasets.length===1) return
            ele.classList.remove('active')
            if(id==='high'){
                setDataSets(datasets.filter(data => data.label !== 'High'))
            }
            if(id==='avg'){
                setDataSets(datasets.filter(data => data.label !== 'Average'))
            }
            if(id==='low'){
                setDataSets(datasets.filter(data => data.label !== 'Low'))
            }
        }
        else{
            ele.classList.add('active')
            if(id==='high'){
                setDataSets([...datasets, {
                    label: 'High',
                    data: stockChartHigh,
                    fill: false,
                    backgroundColor: '#00FF00',
                    borderColor: '#00FF00',
                    borderWidth: borderWidth,
                    pointRadius: borderWidth,
                }])
            }
            if(id==='avg'){
                setDataSets([...datasets, {
                    label: 'Average',
                    data: stockChartOpen,
                    fill: false,
                    backgroundColor: '#0071bd',
                    borderColor: '#0071bd',
                    borderWidth: borderWidth,
                    pointRadius: borderWidth,
                }])
            }
            if(id==='low'){
                setDataSets([...datasets, {
                    label: 'Low',
                    data: stockChartLow,
                    fill: false,
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    borderWidth: borderWidth,
                    pointRadius: borderWidth,
                }])
            }
        }
    }

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

    const data = {
        labels: stockTimestamp,
        datasets
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

    const startingPrice = (stockHistory?.Results[0].Low+stockHistory?.Results[0].High)/2
    const lastPrice = (stockHistory?.Results[stockHistory?.Results?.length-1]?.Low+stockHistory?.Results[stockHistory?.Results?.length-1]?.High)/2
    const priceChange = (((lastPrice-startingPrice)/startingPrice)*100).toFixed(2)

    return (
        <div className="chart_cont mt-3 mb-3">
            <div className="heading_cont my-3">
                <div className={"heading"+(isFetching ? " loading":"")}>{isFetching ? '':`${stockName} Price Chart`}</div>
                <div className="radio_cont">
                    <div className="radio_group me-3">
                        <div className="radio_btn high" id='high' onClick={()=>selectRadioButton('high')}><div className="dot"></div></div>
                        <div className="text">High</div>
                    </div>
                    <div className="radio_group mx-3">
                        <div className="radio_btn avg" id='avg' onClick={()=>selectRadioButton('avg')}><div className="dot"></div></div>
                        <div className="text">Average</div>
                    </div>
                    <div className="radio_group mx-3">
                        <div className="radio_btn low" id='low' onClick={()=>selectRadioButton('low')}><div className="dot"></div></div>
                        <div className="text">Low</div>
                    </div>
                </div>
                {stockHistory&&!isFetching ?
                    (
                        <div className="price">Current Price: ₹ {customUnits(parseFloat(stockHistory.Results[stockHistory?.Results?.length-1].Open*inrValue).toFixed(2))}
                            <span className='price_change'>
                                {priceChange>0 ? 
                                    (<span className='profit'><FontAwesomeIcon icon={faCaretUp} />{customUnits(priceChange)}%</span>): 
                                    (priceChange===0 ? 
                                        (<span className='zero'>{customUnits(priceChange)}%</span>):
                                        (<span className='loss'><FontAwesomeIcon icon={faCaretDown} />{customUnits(Math.abs(priceChange))}%</span>))}
                            </span>
                        </div>
                    ):<div className="price loading"></div>
                }
            </div>
            <Line data={data} options={options} />
        </div>
    )
}
