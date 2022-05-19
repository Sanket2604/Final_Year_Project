import React from 'react'
import moment from 'moment'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import './line_chart.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChartVolume(props) {

    let stockChartVolume = []
    let stockTimestamp = []
    let stockVolumeColour=[]
    for(let i=0; i<=props.stockHistory?.Results.length-1; i++){
        stockChartVolume.push(props.stockHistory?.Results[i].Volume)
        if(i==0){
            stockVolumeColour.push('')
        }

        if(props.timeperiod==='24h'){
            stockTimestamp.push(moment(props.stockHistory?.Results[i].Date).format("hh:mm A"));
        }
        else{
            stockTimestamp.push(moment(props.stockHistory?.Results[i].Date).format("DD/MM/YYYY"));
        }
    }

    const gridColor = true ? "rgba(86, 86, 86, 0.69)" : "#989898"
    const axisTextColor = true ? "white" : "black"

    const options = {
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
                },
            },
        },
    };

    const data = {
        labels: stockTimestamp,
        datasets: [
            {
                label: 'Volume',
                data: stockChartVolume,
                backgroundColor: "rgb(0,113,189)",
            },
        ],
    };

    return (
        <div className="chart_cont mt-3 mb-3">
            <div className="heading_cont my-3">
                <div className={"heading" + (props.isFetching ? " loading" : "")}>{props.isFetching ? '' : `${props.stockName} Volume Chart`}</div>
            </div>
            <Bar data={data} options={options} />
        </div>
    )
}
