import React, {useState,useEffect} from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function LoanDonutChart() {

    const [randomColors, setRandomColors]=useState()
    const reRender = 0
    useEffect(() => {
        setRandomColors([generateRandomColor(),generateRandomColor(),generateRandomColor()])
    }, [reRender])
    
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
            data: [30, 30, 30],
            backgroundColor: randomColors
        },
        ],
        labels: [
            'Loan Name 1',
            'Loan Name 2',
            'Loan Name 3'
        ],
    };

    return (
        <Doughnut data={data} />
    )
}
