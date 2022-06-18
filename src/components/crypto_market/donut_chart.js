import React, { useState, useEffect } from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function CryptoDonutChart(props) {

    const [randomColors, setRandomColors] = useState()
    const [labels, setLabels] = useState([])
    const [dataSet, setDataSet] = useState([])

    useEffect(() => {
        let tempLabel = [], tempDataSet = [], colourSet=[]
        let pos = -1
        props.investments?.map(invst => {
            colourSet.push(generateRandomColor())
            if (tempLabel.includes(invst.name)) {
                pos = tempLabel.indexOf(invst.name)
                tempDataSet[pos] += invst.investment
            }
            else {
                tempLabel.push(invst.name)
                tempDataSet.push(invst.investment)
            }
        })
        setRandomColors(colourSet)
        setLabels(tempLabel)
        setDataSet(tempDataSet)
    }, [props.investments])


    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const data = {
        datasets: [{
            data: dataSet,
            backgroundColor: randomColors
        }],
        labels: labels,
    };

    return (
        <Doughnut data={data} />
    )
}
