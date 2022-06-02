import React, {useEffect} from 'react'
import LoanDonutChart from './donut_chart'
import TransactionCard from '../cards/transaction_card';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { Link } from 'react-router-dom'
import './transaction_dashboard.css'

export default function TransactionDashboard() {
    
    useEffect(()=>{
        document.title = `CDFYP | Transaction Tracker`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
    },[])

    return (
        <div className="trans_dashboard container py-5">
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Show Data by Date</div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Form>
                        <Row className='mb-4'>
                            <Col md={6}>
                                <Label htmlFor="name">Start Date</Label>
                                <Input type="date" id="startDate" name="startDate" />
                                <div id="error_startDate" className='form_error'></div>
                            </Col>
                            <Col md={6}>
                                <Label htmlFor="name">End Date</Label>
                                <Input type="date" id="endDate" name="endDate" />
                                <div id="error_endDate" className='form_error'></div>
                            </Col>
                            <Col md={12}>
                                <div className="btn_cont mt-4"><div className="btn_ btn_small">Search</div></div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Expenses by Category</div>
                    <Link to="/category_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6">
                    <LoanDonutChart />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                        <div className="row invest heading">
                            <div className="col-4 data name">Category Name</div>
                            <div className="col-4 data total_money">Total</div>
                            <div className="col-4 data percentage">Percentage</div>
                        </div>
                    </div>
                    <div className="container-fluid invest_list ms-1">
                        {[...Array(20)].map((j,i)=>
                            <div className="row invest my-2" key={i}>
                                <div className="col-4 data name">Category 1</div>
                                <div className="col-4 data total_money">₹ 20000</div>
                                <div className="col-4 data percentage">20%</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row transaction_sec mt-5">
                <div className="col-12 heading_cont my-4">
                    <div className="heading">Last 10 Transactions</div>
                    <Link to="/transaction_details" className="btn_cont"><div className='btn_ btn_small'>View All</div></Link>
                </div>
                {[...Array(10)].map((j,i)=>
                    <TransactionCard/>
                )}
            </div>
        </div>
    )
}
