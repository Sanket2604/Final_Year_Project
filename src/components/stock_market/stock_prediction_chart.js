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

export default function PredictChart({ prediction, isFetching, stockName, stockHistory, inrValue }) {

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
        if(stockHistory&&prediction?.High.length > 0){
            tempData.unshift(((stockHistory?.Results[stockHistory?.Results.length-1].Low+stockHistory?.Results[stockHistory?.Results.length-1].High)/2)*inrValue)
            for (let i = 0; i <= 4; i++) {
                tempData.push((prediction.High[i] + prediction.Low[i]) / 2)
            }
            setDataset(tempData)
        }
    }, [prediction, stockHistory])

    const data = {
        labels: stockTimestamp,
        datasets: [{
            label: 'Prediction',
            data: dataset,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: '#0071bd',
            borderWidth: borderWidth,
            pointRadius: borderWidth,
        }],
    };

    let options = {
        elements: {
            point: {
                radius: 2
            }
        },
        scales: {
            xAxes: {
                grid: {
                    color: gridColor
                },
                ticks: {
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
                        if (value > 10) {
                            return new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            }).format(value)
                        }
                        return new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(value)
                    }
                },
            },
        },
    }

    return (
        <div className="chart_cont mt-3 mb-3">
            <div className="heading_cont my-3">
                <div className={"heading" + (isFetching ? " loading" : "")}>{isFetching ? '' : `${stockName} Prediction Chart`}</div>
            </div>
            <div style={{height: '350px', display: 'flex', alignItems: 'center'}}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}
