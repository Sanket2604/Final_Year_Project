import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function HorizontalBarGraph(props) {
    const [labels, setLabels] = useState([])
    const [investemntDataSet, setInvestemntDataSet] = useState([])
    const [currentValueDataSet, setCurrentValueDataSet] = useState([])
    const [profitLossColor, setProfitLossColor]=useState([])
    const [borderColor, setBorderColor]=useState([])

    useEffect(() => {
        let tempLabel = [], tempDataSet = [], tempActiveDataSet=[], tempProfitLossColor=[], tempBorderColor=[], pos=-1, price=0
        props.investments?.map(invst => {
            props.coinData?.map(data => {
                if (invst.name === data.name) return price = data.price
            })
            if (tempLabel.includes(invst.name)) {
                pos = tempLabel.indexOf(invst.name)
                tempDataSet[pos] += invst.investment
                tempActiveDataSet[pos] += (invst.quantity*price)
            }
            else {
                tempLabel.push(invst.name)
                tempDataSet.push(invst.investment)
                tempActiveDataSet.push(invst.quantity*price)
            }
        })
        for(let i=0; i<tempDataSet.length;i++){
            if(tempDataSet[i]<tempActiveDataSet[i]){
                tempProfitLossColor.push('rgba(23,203,73,0.5)')
                tempBorderColor.push('rgb(23,203,73)')
            }
            else{
                tempProfitLossColor.push('rgba(235,36,42,0.69)')
                tempBorderColor.push('rgb(235,36,42)')
            }
        }
        setLabels(tempLabel)
        setInvestemntDataSet(tempDataSet)
        setCurrentValueDataSet(tempActiveDataSet)
        setProfitLossColor(tempProfitLossColor)
        setBorderColor(tempBorderColor)
    }, [props.investments, props.coinData])

    const options = {
        indexAxis: 'y',
        barPercentage: 1,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {  
                    label: function(context) {
                        let label = context.dataset.label || context.label;
                        if (label) {
                            label += ': ';
                        }
                        if (context.raw !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.raw);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            yAxes: {
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    color: 'rgb(255,255,255)',
                }
            },
            xAxes: {
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    color: 'rgb(255,255,255)',
                    callback: (value, index, values) => {
                        return new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(value)
                    },
                },
            },
        },
        responsive: true,
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Investment',
                data: investemntDataSet,
                borderColor: 'rgb(0,113,189)',
                backgroundColor: 'rgb(0,113,189,0.75)',
            },
            {
                label: 'Return',
                data: currentValueDataSet,
                borderColor: borderColor,
                backgroundColor: profitLossColor,
            },
        ],
    }
    
    return <Bar options={options} data={data} />;
}
