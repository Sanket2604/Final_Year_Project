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

    useEffect(() => {
        let tempLabel = [], tempDataSet = [], tempActiveDataSet=[], pos=-1, price=0
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
        setLabels(tempLabel)
        setInvestemntDataSet(tempDataSet)
        setCurrentValueDataSet(tempActiveDataSet)
        
    }, [props.investments, props.coinData])

    const options = {
        indexAxis: 'y',
        barPercentage: 1,
        elements: {
            bar: {
                borderWidth: 2,
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
                borderColor: 'rgb(242,41,82)',
                backgroundColor: 'rgba(242,41,82,0.69)',
            },
            {
                label: 'Return',
                data: currentValueDataSet,
                borderColor: 'rgb(0,61,149)',
                backgroundColor: 'rgba(0,61,149,0.69)',
            },
        ],
    }
    
    return <Bar options={options} data={data} />;
}
