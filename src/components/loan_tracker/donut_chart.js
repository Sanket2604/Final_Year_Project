import React, {useState,useEffect} from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function LoanDonutChart({loans}) {

    const [randomColors, setRandomColors]=useState()
    const reRender = 0
    const [labels, setLabels] = useState([])
    const [dataSet, setDataSet] = useState([])
    useEffect(() => {
        setRandomColors([generateRandomColor(),generateRandomColor(),generateRandomColor()])
    }, [reRender])

    useEffect(()=>{
        let tempLabel=[], tempDataSet=[]
        let pos=-1
        loans?.map(loan=>{
            if(tempLabel.includes(loan.name)){
                pos = tempLabel.indexOf(loan.name)
                tempDataSet[pos]+=loan.total
            }
            else{
                tempLabel.push(loan.name)
                tempDataSet.push(loan.total)
            }
        })
        setLabels(tempLabel)
        setDataSet(tempDataSet)
    }, [loans])
    
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
        },
        ],
        labels: labels,
    };

    return (
        <Doughnut data={data} />
    )
}
