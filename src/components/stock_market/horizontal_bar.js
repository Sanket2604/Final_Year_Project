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
    const colors = ['rgb(47,47,161)', 'rgb(246,76,113)', 'rgb(252,68,68)', 'rgb(79,27,29)', 'rgb(53,0,212)', 'rgb(78,78,80)', 'rgb(0,255,0)', 'rgb(70,162,159)', 'rgb(155,23,80)', 'rgb(241,60,31)' ,'rgb(27,51,51)', 'rgb(16,100,102)', 'rgb(255,228,1)', 'rgb(19,167,107)', 'rgb(68,49,141)', 'rgb(45,156,202)', 'rgb(230,66,152)', 'rgb(188,70,58)', 'rgb(129,43,178)', 'rgb(136,211,24)']
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
