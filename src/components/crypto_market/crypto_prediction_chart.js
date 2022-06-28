import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
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

export default function PredictChart({ currentPrice, prediction, coinColour, coinName, isFetching,  }) {

    const [dataset, setDataset] = useState([])
    const borderWidth = 2
    const gridColor = true ? "rgba(86, 86, 86, 0.69)" : "#989898"
    const axisTextColor = true ? "white" : "black"
    let today = moment().format("DD/MM/YYYY")
    let stockTimestamp = []

    for (let i = 0; i <= 5; i++) {
        stockTimestamp.push(moment(today, "DD/MM/YYYY").add(i, 'days').format("DD/MM/YYYY"))
    }

    useEffect(() => {
        let tempData = []
        tempData.push(currentPrice)
        if(prediction?.High.length > 0){
            for (let i = 0; i <= 4; i++) {
                tempData.push((prediction.High[i] + prediction.Low[i]) / 2)
            }
            setDataset(tempData)
        }
    }, [prediction, currentPrice])

    const data = {
        labels: stockTimestamp,
        datasets: [{
            label: 'Prediction',
            data: dataset,
            fill: false,
            backgroundColor: coinColour ? coinColour:'#0071bd',
            borderColor: coinColour ? coinColour:'#0071bd',
        }],
    };

    let options = {
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
    }

    return (
        <div className="chart_cont prediction mb-3">
            <div className="heading_cont mb-4">
                <div className={"heading" + (isFetching ? " loading" : "")}>{isFetching ? '' : `${coinName} Prediction Chart`}</div>
            </div>
            <Line data={data} options={options} />
        </div>
    )
}
