import React, { useEffect, useState } from 'react'
import StockDonutChart from './donut_chart'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import './user_crypto.css'

export default function UserStock() {

    const [editModalOpen, setEditModalOpen]=useState(false)
    const [deleteModalOpen, setDeleteModalOpen]=useState(false)
    const [newInvestment, setNewInvestment]=useState(false)

    useEffect(() => {
        document.title = `CDFYP | Crypto Investment`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
    }, [])

    function triggerEditModal(add) {
        setEditModalOpen(true)
        setNewInvestment(add)
    }
    function closeEditModal() {
        setEditModalOpen(false)
    }
    function EditModal() {
        return (
            <Modal size="xl" isOpen={editModalOpen} toggle={closeEditModal}>
                <ModalHeader toggle={closeEditModal}>{newInvestment ? 'Add' : 'Edit'} Investment</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Stock Name</Label>
                                <Input type="text" id="name" name="loanAmount" placeholder="Stock Name" />
                                <div id="error_amount" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Date</Label>
                                <Input type="date" id="name" name="loanAmount" placeholder="Category Description" />
                                <div id="error_amount" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Investment Amount</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="intrest" placeholder="Invested Amount" />
                                <div id="error_amount" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Stock Price</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="intrest" placeholder="Stock Price" />
                                <div id="error_amount" className='form_error'></div>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success">{newInvestment ? 'Add' : 'Edit'}</button>
                    <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    
    function triggerDeleteModal() {
        setDeleteModalOpen(true)
    }
    function closeDeleteModal() {
        setDeleteModalOpen(false)
    }
    function DeleteModal() {
        return (
            <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>Delete Investment?</ModalHeader>
                <ModalBody>Delete Investment</ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" >Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    return (
        <div className='container crypto_stock py-5'>
            <EditModal/>
            <DeleteModal/>
            <div className="add_transaction_btn" onClick={()=>triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className="row mb-4">
                <div className="col-12 heading">Your Crypto Investments</div>
            </div>
            <div className="row">
                <div className="col-6">
                    <StockDonutChart />
                </div>
                <div className="col-6">Investment Bar Graph Goes Here</div>
            </div>
            <div className="row mt-5">
                <div className="col-12 heading">Active Investments</div>
            </div>
            <div className="row mt-5 user_investment">
                <div className="container-fluid">
                    <div className="row title">
                        <div className="col-3 data">Crypto Name</div>
                        <div className="col-2 data">Date</div>
                        <div className="col-2 data">Investment</div>
                        <div className="col-1 data">Quantity</div>
                        <div className="col-2 data">Current Value</div>
                        <div className="col-2 data">% Change</div>
                    </div>
                    <div className="row invest_data py-2">
                        <Link to='/crypto_coin/' className="col-3 data">Apple Inc.</Link>
                        <div className="col-2 data">16/05/2022</div>
                        <div className="col-2 data">₹1000</div>
                        <div className="col-1 data">1</div>
                        <div className="col-2 data">₹1100</div>
                        <div className="col-2 data"><span className='loss'><FontAwesomeIcon icon={faCaretDown} />10%</span></div>
                        <div className="symbol sell">Sell</div>
                        <div className="modify edit" onClick={()=>triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                        <div className="modify delete" onClick={()=>triggerDeleteModal()}><FontAwesomeIcon icon={faTrashCan} /></div>
                    </div>
                    <div className="row invest_data py-2">
                        <Link to='/crypto_coin/' className="col-3 data">Apple Inc.</Link>
                        <div className="col-2 data">16/05/2022</div>
                        <div className="col-2 data">₹1000</div>
                        <div className="col-1 data">1</div>
                        <div className="col-2 data">₹1100</div>
                        <div className="col-2 data"><span className='profit'><FontAwesomeIcon icon={faCaretUp} />10%</span></div>
                        <div className="symbol buy">Buy</div>
                        <div className="modify edit" onClick={()=>triggerEditModal(true)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                        <div className="modify delete" onClick={()=>triggerDeleteModal()}><FontAwesomeIcon icon={faTrashCan} /></div>
                    </div>
                </div>
                <div className="bottom_footer pt-3">
                    <span className="total_investment me-4">Total Invested: ₹2000</span>
                    <span className="total_currentcalue">Total Current Value: ₹2000</span>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 heading">Completed Investments</div>
            </div>
            <div className="row mt-5 user_investment">
                <div className="container-fluid">
                    <div className="row title">
                        <div className="col-3 data">Crypto Name</div>
                        <div className="col-2 data">Date</div>
                        <div className="col-2 data">Investment</div>
                        <div className="col-1 data">Quantity</div>
                        <div className="col-2 data">Closing Value</div>
                        <div className="col-2 data">Earning</div>
                    </div>
                    <div className="row invest_data py-2">
                        <Link to='/stock_market/AAPL' className="col-3 data">Apple Inc.</Link>
                        <div className="col-2 data">16/05/2022</div>
                        <div className="col-2 data">₹1000</div>
                        <div className="col-1 data">1</div>
                        <div className="col-2 data">₹1100</div>
                        <div className="col-2 data"><span className='loss'>- ₹100</span></div>
                        <div className="symbol sell">Sell</div>
                    </div>
                    <div className="row invest_data py-2">
                        <Link to='/stock_market/AAPL' className="col-3 data">Apple Inc.</Link>
                        <div className="col-2 data">16/05/2022</div>
                        <div className="col-2 data">₹1000</div>
                        <div className="col-1 data">1</div>
                        <div className="col-2 data">₹1100</div>
                        <div className="col-2 data"><span className='profit'>+ ₹100</span></div>
                        <div className="symbol buy">Buy</div>
                    </div>
                </div>
                <div className="bottom_footer pt-3">
                    <span className="total_investment me-4">Total Invested: ₹2000</span>
                    <span className="total_currentcalue">Total Earned: ₹2000</span>
                </div>
            </div>
        </div>
    )
}
