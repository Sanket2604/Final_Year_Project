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
    const [loanDataSet, setLoanDataSet] = useState([])
    const [paidDataSet, setPaidDataSet] = useState([])
    const [colorSet, setColorSet] = useState([])
    const [profitLossColor, setProfitLossColor]=useState([])
    const [borderColor, setBorderColor]=useState([])

    const colors = ['rgb(47,47,161)', 'rgb(246,76,113)', 'rgb(252,68,68)', 'rgb(79,27,29)', 'rgb(53,0,212)', 'rgb(78,78,80)', 'rgb(0,255,0)', 'rgb(70,162,159)', 'rgb(155,23,80)', 'rgb(241,60,31)' ,'rgb(27,51,51)', 'rgb(16,100,102)', 'rgb(255,228,1)', 'rgb(19,167,107)', 'rgb(68,49,141)', 'rgb(45,156,202)', 'rgb(230,66,152)', 'rgb(188,70,58)', 'rgb(129,43,178)', 'rgb(136,211,24)']

    useEffect(() => {
        let tempLoanData = [], tempPaidData = [], tempColorSet = [], tempLabel=[], tempProfitLossColor=[], tempBorderColor=[]
        let pos = -1, index
        props.loans?.map(loan => {
            if (loan.status === 'active') {
                index = Math.floor(Math.random() * (20))
                while (tempColorSet.includes(colors[index])) {
                    index = Math.floor(Math.random() * (20))
                }
                tempColorSet.push(colors[index])
                if (tempLabel.includes(loan.name)) {
                    pos = tempLabel.indexOf(loan.name)
                    tempPaidData[pos] += loan.paid 
                    tempLoanData[pos] += loan.total
                }
                else {
                    tempLabel.push(loan.name)
                    tempPaidData.push(loan.paid)
                    tempLoanData.push(loan.total)
                }
            }
        })
        for(let i=0;i<tempPaidData.length;i++){
            let calc = tempPaidData[i]*100/tempLoanData[i]
            if(calc>=50){
                tempProfitLossColor.push('rgba(23,203,73,0.5)')
                tempBorderColor.push('rgb(23,203,73)')
            }
            else{
                tempProfitLossColor.push('rgba(235,36,42,0.69)')
                tempBorderColor.push('rgb(235,36,42)')
            }
        }
        setColorSet(tempColorSet)
        setLabels(tempLabel)
        setPaidDataSet(tempPaidData)
        setLoanDataSet(tempLoanData)
        setProfitLossColor(tempProfitLossColor)
        setBorderColor(tempBorderColor)
    }, [props.barGraphData])

    const options = {
        indexAxis: 'y',
        barPercentage: 1,
        maintainAspectRatio: true,
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
                    label: function (context) {
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
                label: 'Loan',
                data: loanDataSet,
                borderColor: '#ffffff',
                backgroundColor: colorSet,
            },
            {
                label: 'Paid',
                data: paidDataSet,
                borderColor: borderColor,
                backgroundColor: profitLossColor,
            },
        ],
    }

    return <Bar options={options} data={data} />;
}
