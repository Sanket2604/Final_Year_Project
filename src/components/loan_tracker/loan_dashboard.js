import React, { useState, useEffect } from 'react'
import LoanDonutChart from './donut_chart'
import axios from 'axios'
import { url } from '../../url'
import { Link } from 'react-router-dom'
import './loan_dashboard.css'

export default function LoanDashboard() {

    const [lenderData, setLenderData] = useState([])
    const [borrowerData, setBorrowerData] = useState([])
    const token = JSON.parse(localStorage.getItem("profile"))?.token
    
    useEffect(() => {
        document.title = `CDFYP | Loan Tracker`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
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
                        setLenderData(res.data.activeLoans.loans)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                axios
                    .get(url + '/loan/getBorrowerDetails', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setBorrowerData(res.data.activeLoans.loans)
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
    }, [])

    return (
        <div className="loan_dashboard container pt-5 pb-5">
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Lenders</div>
                    <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                {lenderData.length > 0 ?
                    <>
                        <div className="col-12 col-lg-6 p-4">
                            <LoanDonutChart loans={lenderData} chartType="Total" />
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
                                {lenderData.map(loan =>
                                    <div className="row invest my-2" key={loan._id}>
                                        <div className="col-3 data name">{loan.name}</div>
                                        <div className="col-3 data pos_price">₹ {loan.amount}</div>
                                        <div className="col-3 data duration">₹ {loan.paid}</div>
                                        <div className="col-3 data total_money">₹ {loan.total}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>}
            </div>
            <div className="row mt-5">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Borowers</div>
                    <Link to="/borrower_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                {borrowerData.length > 0 ?
                    <>
                        <div className="col-12 col-lg-6">
                            <LoanDonutChart loans={borrowerData} chartType="Total" />
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
                                {borrowerData.map(loan =>
                                    <div className="row invest my-2" key={loan._id}>
                                        <div className="col-3 data name">{loan.name}</div>
                                        <div className="col-3 data pos_price">₹ {loan.amount}</div>
                                        <div className="col-3 data duration">₹ {loan.paid}</div>
                                        <div className="col-3 data total_money">₹ {loan.total}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>
                }
            </div>
        </div>
    )
}
