import React, { useState, useEffect } from 'react'
import LoanDonutChart from './donut_chart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashAlt, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import './lender_details.css'



export default function LenderDetails() {

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState({
        open: false,
        add: false
    })
    const [nameForm, setNameForm] = useState(false)

    useEffect(() => {
        document.title = `CDFYP | Lender Details`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('5').classList.add('active')
    }, [])

    function closeDeleteModal() {
        setDeleteModal(false)
    }
    function triggerDeleteModal() {
        setDeleteModal(!deleteModal)
    }
    function closeEditModal() {
        setEditModal({...editModal, open: false})
    }
    function triggerEditModal(add) {
        setEditModal({ open: true, add: add })
    }
    function toggleNameForm() {
        setNameForm(!nameForm)
    }

    function DeleteModal() {
        return (
            <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>Delete Debt?</ModalHeader>
                <ModalBody>Delete Modal</ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" >Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    function EditModal() {
        return (
            <Modal size="xl" isOpen={editModal.open} toggle={closeEditModal}>
                <ModalHeader toggle={closeEditModal}>{editModal.add ? 'Add':'Edit'} Debt</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={12} className='mb-3'>
                                <Label htmlFor="name">Lender Name</Label>
                                <div className="container_fluid">
                                    <div className="row">
                                        <div className="col-2">
                                            <div className="name_box">HDFC</div>
                                        </div>
                                        <div className="col-2">
                                            <div className="name_box">HDFC</div>
                                        </div>
                                        <div className="col-2">
                                            <div className="name_box add_name" onClick={toggleNameForm}>{!nameForm ? <><FontAwesomeIcon icon={faPlus} /> Add Lender</>:<><FontAwesomeIcon icon={faXmark} /> Close</>}</div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            {nameForm ?
                                <Col md={12} className='mb-3'>
                                    <Label htmlFor="name">Enter A New Lender Name</Label>
                                    <Input type="text" id="name" name="loanAmount" placeholder="Lender Name" />
                                    <div id="error_amount" className='form_error'></div>
                                    <div className="btn_cont mt-3"><div className="btn_ btn_small">Add</div></div>
                                </Col>:<></>
                            }
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Loan Amount</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="loanAmount" placeholder="Loan Amount" />
                                <div id="error_amount" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Intrest</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="intrest" placeholder="Intrest" />
                                <div id="error_intrest" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Start Date</Label>
                                <Input type="date" id="startDate" name="startDate" placeholder="Country Code" />
                                <div id="error_startDate" className='form_error'></div>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">End Date</Label>
                                <Input type="date" id="endDate" name="endDate" placeholder="Country Code" />
                                <div id="error_endDate" className='form_error'></div>
                            </Col>
                            {!editModal.add ?
                                <>
                                    <Col md={3} className='mb-3'></Col>
                                    <Col md={6} className='mb-3 d-flex justify-content-center align-items-center'>
                                        <span className='col_heading mx-2'>Debt Status:</span>
                                        <span className='active highlight mx-2'>Active</span>
                                        <span className='completed mx-2'>Completed</span>
                                    </Col>
                                    <Col md={3} className='mb-3'></Col>
                                </>:<></>
                            }
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success">{editModal.add ? 'Add':'Edit'}</button>
                    <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    return (
        <div className="debt_details container py-5">
            <div className="heading mb-3">Borrower Details</div>
            <DeleteModal />
            <EditModal />
            <div className="row">
                <div className="col-12 col-lg-6 p-1">
                    <LoanDonutChart />
                </div>
                <div className="col-12 col-lg-6 p-1">
                    Line Chart
                </div>
            </div>
            <div className="row my-4 debt_table">
                <div className="col-6 sub_heading mb-3">Active Borrower Debt</div>
                <div className="col-6">
                    <div className="btn_cont" style={{ justifyContent: 'flex-end' }}><div className='btn_ btn_small' onClick={()=>triggerEditModal(true)}><FontAwesomeIcon icon={faPlus} />Add</div></div>
                </div>
                <div className="col-12">
                    <div className="container_fluid">
                        <div className="row heading_row">
                            <div className="col-2 heading">Name</div>
                            <div className="col-1 heading">Start Date</div>
                            <div className="col-1 heading">End Date</div>
                            <div className="col-2 heading">Amount</div>
                            <div className="col-1 heading">Intrest</div>
                            <div className="col-2 heading">Paid (Remaining)</div>
                            <div className="col-1 heading">%Completed</div>
                            <div className="col-2 heading">Total</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 data_scroll">
                    <div className="container_fluid">
                        {[...Array(20)].map((j, i) =>
                            <div className="row data_row" key={i}>
                                <div className="col-2 data name_sec" style={{ cursor: 'pointer' }}><div className="name">Sanket</div></div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-2 data">₹ 10000</div>
                                <div className="col-1 data">10%</div>
                                <div className="col-2 data">₹ 10000 (₹ 10000)</div>
                                <div className="col-1 data">5%</div>
                                <div className="col-2 data">₹ 10000</div>
                                <div className="edit" onClick={()=>triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="delete" onClick={triggerDeleteModal}><FontAwesomeIcon icon={faTrashAlt} /></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="total_sec col-12 pt-3">
                    <div>Borrowed: ₹ 10000</div>
                    <div>Total Repayment: ₹ 10000</div>
                    <div>Extra: ₹ 10000</div>
                </div>
            </div>
            <div className="row my-4 debt_table">
                <div className="col-6 sub_heading mb-3">Completed Borrower Debt</div>
                <div className="col-6">
                    <div className="btn_cont" style={{ justifyContent: 'flex-end' }}><div className='btn_ btn_small' onClick={()=>triggerEditModal(true)}><FontAwesomeIcon icon={faPlus} />Add</div></div>
                </div>
                <div className="col-12">
                    <div className="container_fluid">
                        <div className="row heading_row">
                            <div className="col-3 heading">Name</div>
                            <div className="col-1 heading">Start Date</div>
                            <div className="col-1 heading">End Date</div>
                            <div className="col-2 heading">Amount</div>
                            <div className="col-1 heading">Intrest</div>
                            <div className="col-1 heading">Duration</div>
                            <div className="col-3 heading">Total</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 data_scroll">
                    <div className="container_fluid">
                        {[...Array(20)].map((j, i) =>
                            <div className="row data_row" key={i}>
                                <div className="col-3 data name_sec" style={{ cursor: 'pointer' }}><div className="name">Sanket</div></div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-2 data">₹ 10000</div>
                                <div className="col-1 data">10%</div>
                                <div className="col-1 data">1Yr</div>
                                <div className="col-3 data">₹ 10000</div>
                                <div className="edit" onClick={()=>triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="delete" onClick={triggerDeleteModal}><FontAwesomeIcon icon={faTrashAlt} /></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 total_sec pt-3">
                    <div>Borrowed: ₹ 10000</div>
                    <div>Total Repayment: ₹ 10000</div>
                    <div>Extra: ₹ 10000</div>
                </div>
            </div>
            <div className="row">
                <div className="col-6 sub_heading mb-3">Details About Name</div>
                <div className="col-12">
                    <div className="details_cont container_fluid">
                        <div className="row">
                            <div className="col-3">
                                <div className="detail my-2">
                                    <div className="title">Total Amount</div>
                                    <div className="value">₹ 100000</div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="detail my-2">
                                    <div className="title">Amount Payed</div>
                                    <div className="value">Value</div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="detail my-2">
                                    <div className="title">Amount Remaining</div>
                                    <div className="value">Value</div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="detail my-2">
                                    <div className="title">Number Of Times Borrowed</div>
                                    <div className="value">5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-4 debt_table">
                <div className="col-12 sub_heading mb-3">All Debts From Name</div>
                <div className="col-12">
                    <div className="container_fluid">
                        <div className="row heading_row">
                            <div className="col-2 heading">Name</div>
                            <div className="col-1 heading">Start Date</div>
                            <div className="col-1 heading">End Date</div>
                            <div className="col-2 heading">Amount</div>
                            <div className="col-1 heading">Intrest</div>
                            <div className="col-2 heading">Paid (Remaining)</div>
                            <div className="col-1 heading">%Completed</div>
                            <div className="col-2 heading">Total</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 data_scroll">
                    <div className="container_fluid">
                        {[...Array(20)].map((j, i) =>
                            <div className="row data_row" key={i}>
                                <div className="col-2 data name_sec" style={{ cursor: 'pointer' }}><div className="name">Sanket</div></div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-1 data">16/04/2022</div>
                                <div className="col-2 data">₹ 10000</div>
                                <div className="col-1 data">10%</div>
                                <div className="col-2 data">₹ 10000 (₹ 10000)</div>
                                <div className="col-1 data">5%</div>
                                <div className="col-2 data">₹ 10000</div>
                                <div className="edit" onClick={()=>triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="delete" onClick={triggerDeleteModal}><FontAwesomeIcon icon={faTrashAlt} /></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 total_sec pt-3">
                    <div>Borrowed: ₹ 10000</div>
                    <div>Total Repayment: ₹ 10000</div>
                    <div>Extra: ₹ 10000</div>
                </div>
            </div>
        </div>
    )
}
