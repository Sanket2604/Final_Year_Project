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
    const colors = ['#800000', '#9A6324', '#808000', '#469990', '#000075', '#e6194B', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6', '#a9a9a9', '#fabed4', '#ffd8b1', '#fffac8', '#aaffc3', '#dcbeff']

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
