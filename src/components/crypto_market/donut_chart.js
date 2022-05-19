import React from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function CryptoDonutChart() {

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    console.log(generateRandomColor)

    const data = {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor: [
                generateRandomColor(),
                generateRandomColor(),
                generateRandomColor()
            ]
        },
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Coin Name 1',
            'Coin Name 2',
            'Coin Name 3'
        ],
    };

    return (
        <Doughnut data={data} />
    )
}
