import React, {useState,useEffect} from 'react'
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);

export default function StockDonutChart({investments}) {

    const [randomColors, setRandomColors]=useState([])
    const [dataset, setDataset]=useState([])
    const [labels, setLabels]=useState([])
    const colors=['#800000','#9A6324','#808000','#469990','#000075','#e6194B','#f58231','#ffe119','#bfef45','#3cb44b','#42d4f4','#4363d8','#911eb4','#f032e6','#a9a9a9','#fabed4','#ffd8b1','#fffac8','#aaffc3','#dcbeff']
    const reRender = 0
    useEffect(() => {
        let randomColorTemp=[]
        for(let i=0; i<investments?.length; i++){
            let index = Math.floor(Math.random() * (20))
            if(randomColorTemp.includes(colors[index])){
                index = Math.floor(Math.random() * (20))
            }
            randomColorTemp.push(colors[index])
        }
        setRandomColors(randomColorTemp)
    }, [reRender])

    useEffect(()=>{
        let tempDataSet=[], tempLabels=[]
        investments?.map(invst=>{
            tempDataSet.push(invst.investment)
            tempLabels.push(invst.name)
        })
        setLabels(tempLabels)
        setDataset(tempDataSet)
    },[investments])

    const data = {
        labels, 
        datasets: [{
            data: dataset,
            backgroundColor: randomColors
        }]
    };

    return (
        <Doughnut data={data} />
    )
}
