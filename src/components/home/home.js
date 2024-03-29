import React, { useEffect, useState } from 'react'
import LoanDonutChart from '../loan_tracker/donut_chart'
import StockDonutChart from '../stock_market/donut_chart'
import CryptoDonutChart from '../crypto_market/donut_chart'
import axios from 'axios'
import { url } from '../../url'
import { TransactionModal } from '../transaction/transaction_modal'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingDollar, faMoneyBill, faChartLine, faSackDollar, faChartSimple, faPlus, faFileCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import './home.css'

export default function Home() {

    const [modalOpen, setModalOpen] = useState(false)
    const [incomeModal, setIncomeModal] = useState({
        open: false,
        income: 0
    })
    const [data, setData] = useState()
    const [portfolioStatus, setPortfolioStatus] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Home`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('1').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/account/getMainDashboard', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setData(res.data)
                        setIncomeModal({...incomeModal, income: res.data.income})
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

    useEffect(() => {
        if (data) {
            try {
                axios
                    .get(`https://cdfyp-server.herokuapp.com/portfolio_decision/${data?.income}/${data?.loan?.total}/${data?.borrow?.total}/${data?.stock?.total}/${data?.crypto?.total}`)
                    .then((res) => {
                        setPortfolioStatus(res.data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            catch (error) {
                console.log(error)
            }
        }
    }, [data])

    function triggerEditModal() {
        setModalOpen(!modalOpen)
    }

    function triggerIncomeModal(){
        setIncomeModal({...incomeModal, open: !incomeModal.open})
    }

    function editMonthlyIncome(){
        axios
            .put(url + '/account/editMonthlyIncome', {
                income: incomeModal.income
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert("Monthly Income Edited")
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function customUnits(num) {
        let unitNum = parseFloat(num)
        if (unitNum > 10000000) {
            let tempnum = num / 10000000
            unitNum = tempnum.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            unitNum += " Cr"
        }
        if (unitNum > 1000) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        }
        else if (unitNum > 100) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 5 });
        }
        else {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 10 });
        }

        return (unitNum)
    }

    return (
        <div className="container homepage py-5">
            <TransactionModal modalOpen={modalOpen} newTransaction={true} setModalOpen={setModalOpen} />
            <Modal isOpen={incomeModal.open} toggle={triggerIncomeModal}>
                <ModalHeader toggle={triggerIncomeModal}>Change Your Monthly Income</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Label htmlFor="income">Enter Your Monthly Income</Label>
                                <Input type="text" id="income" name="income" placeholder="New Category Name" value={incomeModal.income} onChange={(e)=>setIncomeModal({...incomeModal, income: e.target.value})} />
                                <div id="error_income" className='form_error'></div>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success" onClick={editMonthlyIncome}>Edit</button>
                    <button type="button" className="btn btn-secondary" onClick={triggerIncomeModal}>Cancel</button>
                </ModalFooter>
            </Modal>
            <div className="row top_row">
                <div className="col-2">
                    <div className="box" onClick={triggerIncomeModal}>
                        <FontAwesomeIcon icon={faMoneyBill} />
                        <div className="content">
                            <div className="subtext">Monthly Earning</div>
                            <div className="text">₹ {data?.income ? customUnits(data?.income) : 0}</div>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <Link to="/borrower_details" className="box">
                        <FontAwesomeIcon icon={faSackDollar} />
                        <div className="content">
                            <div className="subtext">Money Taken</div>
                            <div className="text">₹ {data?.borrow?.total ? customUnits(data?.loan?.total) : 0}</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/lender_details" className="box">
                        <FontAwesomeIcon icon={faHandHoldingDollar} />
                        <div className="content">
                            <div className="subtext">Money Given</div>
                            <div className="text">₹ {data?.loan?.total ? customUnits(data?.borrow?.total) : 0}</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/stock_dashboard" className="box">
                        <FontAwesomeIcon icon={faChartLine} />
                        <div className="content">
                            <div className="subtext">Stock Investment</div>
                            <div className="text">₹ {data?.stock?.total ? customUnits(data?.stock?.total) : 0}</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <Link to="/crypto_dashboard" className="box">
                        <FontAwesomeIcon icon={faBitcoin} />
                        <div className="content">
                            <div className="subtext">Crypto Investment</div>
                            <div className="text">₹ {data?.crypto?.total ? customUnits(data?.crypto?.total) : 0}</div>
                        </div>
                    </Link>
                </div>
                <div className="col-2">
                    <div className="box">
                        <FontAwesomeIcon icon={faChartSimple} />
                        <div className="content">
                            <div className="subtext">Portfolio Status</div>
                            <div className="text">{portfolioStatus?.Status}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row middle_row my-5">
                <div className="col-3">
                    <div className="box" onClick={triggerEditModal}>
                        <FontAwesomeIcon icon={faPlus} />
                        <div className="content">
                            <div className="text">Add A New Transaction</div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <Link to="/user_stock_investments" className="box">
                        <FontAwesomeIcon icon={faChartLine} />
                        <div className="content">
                            <div className="text">Add Stock Investment</div>
                        </div>
                    </Link>
                </div>
                <div className="col-3">
                    <Link to='/user_crypto_investments' className="box">
                        <FontAwesomeIcon icon={faBitcoin} />
                        <div className="content">
                            <div className="text">Add Crypto Investment</div>
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
            </div>
            <div className="row pie_charts">
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Stock Investment</div>
                            <Link to="/user_stock_investments" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            {data?.stock?.list?.length > 0 ?
                                <StockDonutChart investments={data?.stock?.list} /> :
                                <div className="no_data">No Data Available</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Crypto Investment</div>
                            <Link to="/user_crypto_investments" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            {data?.crypto?.list?.length > 0 ?
                                <CryptoDonutChart investments={data?.crypto?.list} /> :
                                <div className="no_data">No Data Available</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row pie_charts">
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Lender Loans</div>
                            <Link to="/lender_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            {data?.loan?.list?.length > 0 ?
                                <LoanDonutChart loans={data?.loan?.list} chartType="Total" /> :
                                <div className="no_data">No Data Available</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="pie_cont">
                        <div className="heading_cont">
                            <div className="heading">Borrower Loans</div>
                            <Link to="/borrower_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                        </div>
                        <div className='px-5'>
                            {data?.borrow?.list?.length > 0 ?
                                <LoanDonutChart loans={data?.borrow?.list} chartType="Total" /> :
                                <div className="no_data">No Data Available</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
