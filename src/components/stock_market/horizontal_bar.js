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

    const [randomColors, setRandomColors] = useState([])
    const [labels, setLabels] = useState([])
    const [investemntDataSet, setInvestemntDataSet] = useState([])
    const colors = ['#800000', '#9A6324', '#808000', '#469990', '#000075', '#e6194B', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6', '#a9a9a9', '#fabed4', '#ffd8b1', '#fffac8', '#aaffc3', '#dcbeff']
    const reRender = 0

    useEffect(() => {
        let randomColorTemp = []
        for (let i = 0; i < props.investments?.length; i++) {
            let index = Math.floor(Math.random() * (20))
            while (randomColorTemp.includes(colors[index])) {
                index = Math.floor(Math.random() * (20))
            }
            randomColorTemp.push(colors[index])
        }
        setRandomColors(randomColorTemp)
    }, [reRender])

    useEffect(() => {
        let tempLabel = [], tempDataSet = [], pos = -1
        props.investments?.map(invst => {
            if (tempLabel.includes(invst.name)) {
                pos = tempLabel.indexOf(invst.name)
                tempDataSet[pos] += invst.investment
            }
            else {
                tempLabel.push(invst.name)
                tempDataSet.push(invst.investment)
            }
        })
        setLabels(tempLabel)
        setInvestemntDataSet(tempDataSet)
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
                    label: function (context) {
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
            responsive: true,
        }
    }

    const data = {
            labels,
            datasets: [
                {
                    label: 'Investment',
                    data: investemntDataSet,
                    borderColor: ['rgba(255,255,255,0.69)'],
                    backgroundColor: randomColors,
                },
            ],
        }

    return<Bar options = { options } data = { data } />;
}
