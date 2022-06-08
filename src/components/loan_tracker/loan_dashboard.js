import React, { useState, useEffect } from 'react'
import LoanDonutChart from './donut_chart'
import axios from 'axios'
import { url } from '../../url'
import { Link } from 'react-router-dom'
import './loan_dashboard.css'

export default function LoanDashboard() {

    const [loanData, setLoanData] = useState([])
    const token = JSON.parse(localStorage.getItem("profile"))?.token
    useEffect(()=>{
        document.title = `CDFYP | Loan Tracker`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('5').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/loan/getLenderDetails', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setLoanData(res.data.lenderDetails.loans)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            window.location.replace("/login")
        }
    },[])

    return (
        <div className="loan_dashboard container pt-5 pb-5">
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Lenders</div>
                    <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6 p-4">
                    <LoanDonutChart loans={loanData}/>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                        <div className="row invest heading">
                            <div className="col-3 data name">Lender Name</div>
                            <div className="col-3 data amount">Amount</div>
                            <div className="col-3 data duration">Paid</div>
                            <div className="col-3 data total_money">Total</div>
                        </div>
                    </div>
                    <div className="container-fluid invest_list ms-1">
                        {loanData.map(loan=>
                            <div className="row invest my-2" key={loan._id}>
                                <div className="col-3 data name">{loan.name}</div>
                                <div className="col-3 data pos_price">₹ {loan.amount}</div>
                                <div className="col-3 data duration">₹ {loan.paid}</div>
                                <div className="col-3 data total_money">₹ {loan.total}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Borowers</div>
                    <Link to="/borrower_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6">
                    <LoanDonutChart />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                        <div className="row invest heading">
                            <div className="col-3 data name">Borrower Name</div>
                            <div className="col-3 data amount">Amount</div>
                            <div className="col-1 data intrest">Intrest</div>
                            <div className="col-2 data duration">Duration</div>
                            <div className="col-3 data total_money">Total</div>
                        </div>
                    </div>
                    <div className="container-fluid invest_list ms-1">
                        {[...Array(20)].map((j,i)=>
                            <div className="row invest my-2" key={i}>
                                <div className="col-3 data name">Stock Name</div>
                                <div className="col-3 data pos_price">₹ 10000</div>
                                <div className="col-1 data quantity">x2</div>
                                <div className="col-2 data duration">10yrs</div>
                                <div className="col-3 data total_money">₹ 20000</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
