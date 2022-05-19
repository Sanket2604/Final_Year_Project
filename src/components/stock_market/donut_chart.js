import React from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function StockDonutChart() {

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
            backgroundColor: [
                generateRandomColor(),
                generateRandomColor(),
                generateRandomColor()
            ]
        },
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Stock Name 1',
            'Stock Name 2',
            'Stock Name 3'
        ],
    };

    return (
        <Doughnut data={data} />
    )
}
