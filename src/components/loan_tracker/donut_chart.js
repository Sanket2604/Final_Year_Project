import React, { useState, useEffect } from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function LoanDonutChart({ loans, chartType, randomColors }) {

    const [randomDashColors, setRandomDashColors] = useState([])
    const [labels, setLabels] = useState([])
    const [dataSet, setDataSet] = useState([])
    const colors = ['rgb(47,47,161)', 'rgb(246,76,113)', 'rgb(252,68,68)', 'rgb(79,27,29)', 'rgb(53,0,212)', 'rgb(78,78,80)', 'rgb(0,255,0)', 'rgb(70,162,159)', 'rgb(155,23,80)', 'rgb(241,60,31)' ,'rgb(27,51,51)', 'rgb(16,100,102)', 'rgb(255,228,1)', 'rgb(19,167,107)', 'rgb(68,49,141)', 'rgb(45,156,202)', 'rgb(230,66,152)', 'rgb(188,70,58)', 'rgb(129,43,178)', 'rgb(136,211,24)']

    useEffect(() => {
        let tempLabel = [], tempDataSet = [], colourSet = []
        let pos = -1, index
        if (chartType == 'Remaining') {
            loans?.map(loan => {
                if (loan.status === 'active') {
                    index = Math.floor(Math.random() * (20))
                    while(colourSet.includes(colors[index])) {
                        index = Math.floor(Math.random() * (20))
                    }
                    colourSet.push(colors[index])
                    if (tempLabel.includes(loan.name)) {
                        pos = tempLabel.indexOf(loan.name)
                        tempDataSet[pos] = parseFloat(tempDataSet[pos]) + parseFloat((loan.total - loan.paid).toFixed(2))
                    }
                    else {
                        tempLabel.push(loan.name)
                        tempDataSet.push((loan.total - loan.paid).toFixed(2))
                    }
                }
            })
        }
        if (chartType === 'Total') {
            loans?.map(loan => {
                if (loan.status === 'active') {
                    index = Math.floor(Math.random() * (20))
                    if (colourSet.includes(colors[index])) {
                        index = Math.floor(Math.random() * (20))
                    }
                    colourSet.push(colors[index])
                    if (tempLabel.includes(loan.name)) {
                        pos = tempLabel.indexOf(loan.name)
                        tempDataSet[pos] += loan.total
                    }
                    else {
                        tempLabel.push(loan.name)
                        tempDataSet.push(loan.total)
                    }
                }
            })
        }
        setRandomDashColors(colourSet)
        setLabels(tempLabel)
        setDataSet(tempDataSet)
    }, [loans])


    const data = {
        datasets: [{
            data: dataSet,
            backgroundColor: randomColors ? randomColors : randomDashColors
        }],
        labels: labels,
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {  
                    label: function(context) {
                        let label = context.label || '';
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
        }
    }

    return (
        <Doughnut data={data} options={options} />
    )
}
