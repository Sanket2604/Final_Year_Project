import React, { useEffect } from 'react'
import LoanDonutChart from '../loan_tracker/donut_chart'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingDollar, faMoneyBill, faChartLine, faSackDollar, faChartSimple, faPlus, faFileCircleCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import './home.css'

export default function Home() {


    useEffect(() => {
        document.title = `CDFYP | Home`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('1').classList.add('active')
    }, [])


    return (
        <div className="container homepage py-5">
            <div className="row top_row">
                <div className="col-2">
                    <div className="box">
                        <FontAwesomeIcon icon={faMoneyBill} />
                        <div className="content">
                            <div className="subtext">Monthly Earning</div>
                            <div className="text">₹ 10000</div>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <Link to="/borrower_details" className="box">
                        <FontAwesomeIcon icon={faSackDollar} />
                        <div className="content">
                            <div className="subtext">Money Borrowed</div>
                            <div className="text">₹ 10000</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/lender_details" className="box">
                        <FontAwesomeIcon icon={faHandHoldingDollar} />
                        <div className="content">
                            <div className="subtext">Money Lent</div>
                            <div className="text">₹ 10000</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/stock_dashboard" className="box">
                        <FontAwesomeIcon icon={faChartLine} />
                        <div className="content">
                            <div className="subtext">Stock Investment</div>
                            <div className="text">₹ 10000</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/crypto_dashboard" className="box">
                        <FontAwesomeIcon icon={faBitcoin} />
                        <div className="content">
                            <div className="subtext">Crypto Investment</div>
                            <div className="text">₹ 10000</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <div className="box">
                        <FontAwesomeIcon icon={faChartSimple} />
                        <div className="content">
                            <div className="subtext">Portfolio Status</div>
                            <div className="text">Good</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row middle_row my-5">
                <div className="col-3">
                    <div className="box">
                        <FontAwesomeIcon icon={faPlus} />
                        <div className="content">
                            <div className="text">Add A New Transaction</div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <Link to="/transaction_details" className="box">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <div className="content">
                            <div className="text">Edit A Transaction</div>
                        </div>
                    </Link>
                </div>
                <div className="col-3">
                    <div className="box">
                        <FontAwesomeIcon icon={faFileCircleCheck} />
                        <div className="content">
                            <div className="text">View Porfolio Review</div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="box">
                        <FontAwesomeIcon icon={faMoneyBill} />
                        <div className="content">
                            <div className="text">₹ 10000</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row pie_charts">
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Stock Investment</div>
                            <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            <LoanDonutChart />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Crypto Investment</div>
                            <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            <LoanDonutChart />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row pie_charts">
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Borrowed Debt</div>
                            <Link to="/borrower_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            <LoanDonutChart />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Lent Debt</div>
                            <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            <LoanDonutChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
