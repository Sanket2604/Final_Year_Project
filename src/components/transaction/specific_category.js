import React, {useEffect} from 'react'
import TransactionCard from '../cards/transaction_card'
import { useParams } from 'react-router-dom'
import './specific_category.css'

export default function SpecificCategory() {

    const params = useParams()
    useEffect(()=>{
        document.title = `CDFYP | ${params.catName} Category`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
    },[])

    return (
        <div className="container specific_cat py-5">
            <div className="row">
                <div className="heading col-12">{params.catName} Category Details</div>
            </div>
            <div className="row">
                <div className="col-12 data_sec mt-2 mb-3">
                    <div className="status_bar">
                        <div className="progress_bar" style={{width: '50%'}}>
                            {/* <div className={"percentage"+( < 10 ? ' outside' : '')}>{ }%</div> */}
                        </div>
                    </div>
                    <div className="amount">1000/2000</div>
                </div>
            </div>
            <div className="row">
                Bar Graph Showing monthly spending
            </div>
            <div className="row mt-5">
                <div className="col-12 heading mb-2">All Transactions of {params.catName} Category</div>
                {[...Array(5)].map((j,i)=>
                    <TransactionCard/>
                )}
            </div>
        </div>
    )
}
