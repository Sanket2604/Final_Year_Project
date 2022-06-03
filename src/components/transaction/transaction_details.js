import React, {useEffect,useState} from 'react'
import TransactionCard from '../cards/transaction_card'
import { TransactionModal } from './transaction_modal';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './transaction_details.css'

export default function TransactionDetails() {

    
    const [modalOpen, setModalOpen]=useState(false)
    const [newTransaction, setNewTransaction]=useState(false)

    useEffect(()=>{
        document.title = `CDFYP | Transaction Tracker`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
    },[])

    function triggerEditModal(add) {
        setModalOpen(!modalOpen)
        setNewTransaction(add)
    }

    return (
        <div className="container trans_details py-5">
            <TransactionModal modalOpen={modalOpen} newTransaction={newTransaction} setModalOpen={setModalOpen} />
            <div className="add_transaction_btn" onClick={()=>triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Transaction</div>
            </div>
            <div className="row">
                <div className="col-12 heading mb-4">
                    <div className="heading">Show Data by Date</div>
                </div>
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
            <div className="row my-5">
                Bar Graph goes here
            </div>
            <div className="row">
                <div className="col-12 heading mb-2">All Transactions on 02/06/2022</div>
                {[...Array(5)].map((j,i)=>
                    <TransactionCard triggerEditModal={triggerEditModal} />
                )}
            </div>
        </div>
    )
}
