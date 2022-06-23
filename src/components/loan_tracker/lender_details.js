import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HorizontalBarGraph from './horizontal_bar'
import moment from 'moment'
import { url } from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashAlt, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import './lender_details.css'

function EditModalForm({ loanData, editModal, closeEditModal, token, setLoanData }) {

    const [formData, setFormData] = useState({
        id: editModal.loan?._id ? editModal.loan._id : '',
        name: editModal.loan?.name ? editModal.loan.name : '',
        startDate: editModal.loan?.startDate ? editModal.loan.startDate : '',
        endDate: editModal.loan?.endDate ? editModal.loan.endDate : '',
        amount: editModal.loan?.amount ? editModal.loan.amount : '',
        intrest: editModal.loan?.intrest ? editModal.loan.intrest : '',
        paid: editModal.loan?.paid ? editModal.loan.paid : '',
        status: editModal.loan?.status ? editModal.loan.status : ''
    })

    const [errors, setErrors] = useState(formData)
    let newLenderName = ''
    const [nameForm, setNameForm] = useState(false)

    useEffect(() => {
        if (editModal.amount) {
            setFormData({ ...formData, status: 'active' })
        }
        else {
            setFormData({ ...formData, status: 'completed', paid: 0 })
        }
    }, [])

    function toggleNameForm() {
        setNameForm(!nameForm)
    }
    function postLenderName() {
        axios
            .post(url + '/loan/postLenderName', {
                'newLenderName': newLenderName
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                setLoanData({ ...loanData, lenderList: res.data.lenderList })
                setNameForm(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function selectName(id, name) {
        document.querySelectorAll('.name_box').forEach((ele) => {
            if (!ele.classList.contains('highlight')) return
            ele.classList.remove('highlight')
        })
        document.getElementById(id).classList.add('highlight')
        setFormData({ ...formData, name: name, })
    }
    function changeLoanStatus(status) {
        if (status) {
            document.querySelector('.completed').classList.remove('highlight')
            document.querySelector('.active').classList.add('highlight')
            setFormData({ ...formData, status: 'active' })
        }
        else {
            document.querySelector('.active').classList.remove('highlight')
            document.querySelector('.completed').classList.add('highlight')
            setFormData({ ...formData, status: 'completed', paid: 0 })
        }
    }
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function validateForm() {
        const nodeList = document.querySelectorAll('.form_error')
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].classList.remove('error')
        }
        if (formData.name === '') {
            setErrors({ ...errors, name: 'Select A Name' })
            document.getElementById('error_name').classList.add('error')
            return false
        }
        if (formData.startDate === '') {
            document.getElementById('error_startDate').classList.add('error')
            setErrors({ ...errors, startDate: 'Select A Start Date' })
            return false
        }
        if (formData.endDate === '') {
            setErrors({ ...errors, endDate: 'Select An End Date' })
            document.getElementById('error_endDate').classList.add('error')
            return false
        }
        if (formData.amount === '') {
            setErrors({ ...errors, amount: 'Enter Amount' })
            document.getElementById('error_amount').classList.add('error')
            return false
        }
        if (formData.intrest === '') {
            setErrors({ ...errors, intrest: 'Enter Intrest' })
            document.getElementById('error_intrest').classList.add('error')
            return false
        }
        if (formData.paid === '') {
            setErrors({ ...errors, paid: 'Enter Amount Already Paid' })
            document.getElementById('error_paid').classList.add('error')
            return false
        }
        return true;
    }

    function submitAddLoan() {
        const valid = validateForm()
        if (!valid) return
        axios
            .post(url + '/loan/postLenderLoan', formData, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert("Loan Added")
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function submitEditLoan() {
        const valid = validateForm()
        if (!valid) return
        axios
            .put(url + '/loan/editLenderLoan', formData, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert("Loan Edited")
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <ModalHeader toggle={closeEditModal}>{editModal.add ? formData.status === 'active' ? 'Add Active' : 'Add Completed' : formData.status === 'active' ? 'Edit Active' : 'Edit Completed'} Debt</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col md={12} className='mb-3'>
                            <Label htmlFor="name">Lender Name</Label>
                            <div className="container_fluid">
                                <div className="row">
                                    {loanData.lenderList?.length > 0 ?
                                        loanData.lenderList.map((name, i) =>
                                            <div className="col-2 mb-3" key={i}>
                                                <div className={"name_box" + (name === formData.name ? " highlight" : "")} onClick={() => selectName(`bankname_${i}`, name)} id={`bankname_${i}`} name={name}>{name}</div>
                                            </div>
                                        )
                                        : <></>
                                    }
                                    <div className="col-2">
                                        <div className="name_box add_name mb-3" onClick={toggleNameForm}>
                                            {!nameForm ?
                                                <><FontAwesomeIcon icon={faPlus} /> Add Lender</> :
                                                <><FontAwesomeIcon icon={faXmark} /> Close</>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div id="error_name" className='form_error'>{errors.name}</div>
                            </div>
                        </Col>
                        {nameForm ?
                            <Col md={12} className='mb-3'>
                                <Label htmlFor="name">Enter A New Lender Name</Label>
                                <Input type="text" id="name" name="loanAmount" placeholder="Lender Name" onChange={e => newLenderName = e.target.value} />
fde                                <div id="error_amount" className='form_error'></div>
                                <div className="btn_cont mt-3"><div className="btn_ btn_small" onClick={postLenderName}>Add</div></div>
                            </Col> : <></>
                        }
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input type="date" id="startDate" name="startDate" placeholder="startDate" onChange={handleChange} value={moment(formData.startDate).format('YYYY-MM-DD')} />
                            <div id="error_startDate" className='form_error'>{errors.startDate}</div>
                        </Col>
                        <Col md={6} className='mb-4'>
                            <Label htmlFor="end_date">End Date</Label>
                            <Input type="date" id="endDate" name="endDate" placeholder="endDate" onChange={handleChange} value={moment(formData.endDate).format('YYYY-MM-DD')} />
                            <div id="error_endDate" className='form_error'>{errors.endDate}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="amount">Loan Amount</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="amount" name="amount" placeholder="Total Loan Amount (in rupees)" value={formData.amount} onChange={handleChange} />
                            <div id="error_amount" className='form_error'>{errors.amount}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="intrest">Intrest</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="intrest" name="intrest" placeholder="Rate of Intrest (in percentage)" value={formData.intrest} onChange={handleChange} />
                            <div id="error_intrest" className='form_error'>{errors.intrest}</div>
                        </Col>
                        {formData.status === 'active' ?
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="paid">Amount Paid</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="paid" name="paid" placeholder="Amount Already Paid (in rupees)" value={formData.paid} onChange={handleChange} />
                                <div id="error_paid" className='form_error'>{errors.paid}</div>
                            </Col> : <></>
                        }
                        <Col md={12} className='d-flex justify-content-center align-items-center'>
                            <span className='col_heading mx-2'>Debt Status:</span>
                            <span className={'active mx-2' + (formData.status === 'active' ? ' highlight' : '')} onClick={() => changeLoanStatus(true)}>Active</span>
                            <span className={'completed mx-2' + (formData.status === 'completed' ? ' highlight' : '')} onClick={() => changeLoanStatus(false)}>Completed</span>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={editModal?.add ? submitAddLoan : submitEditLoan}>{editModal?.add ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </>
    )
}

export default function LenderDetails() {

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState({
        open: false,
        add: false,
        amount: false,
        loan: {
            _id: '',
            name: '',
            startDate: '',
            endDate: '',
            amount: '',
            intrest: '',
            paid: '',
            status: ''
        }
    })
    let debtDeleteId
    const [nameDetails, setNameDetails] = useState({
        loans: [],
        totalAmount: 0,
        totalPaid: 0,
        totalBorrowed: 0
    })
    const [loanData, setLoanData] = useState([])
    const [activeLoans, setActiveLoans] = useState([])
    const [completedLoans, setCompletedLoans] = useState([])
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Lender Details`
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
                        setLoanData(res.data.lenderDetails)
                        setActiveLoans(res.data.activeLoans)
                        setCompletedLoans(res.data.completedLoans)
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

    function closeDeleteModal() {
        setDeleteModal(false)
    }
    function triggerDeleteModal(id) {
        setDeleteModal(!deleteModal)
        debtDeleteId = id
    }
    function deleteDebt() {
        axios
            .delete(url + '/loan/deleteLenderLoan/' + debtDeleteId, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Debt Successfully Deleted')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function closeEditModal() {
        setEditModal({ ...editModal, open: false })
    }
    function triggerEditModal(add, amount, loan) {
        if (loan) {
            setEditModal({ open: true, add: add, amount: amount, loan: loan })
        }
        else {
            setEditModal({ open: true, add: add, amount: amount })
        }
    }

    function DeleteModal() {
        return (
            <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>Delete Debt?</ModalHeader>
                <ModalBody>Are You Sure You Want To Delete This Debt?</ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" onClick={deleteDebt}>Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    function EditModal() {
        return (
            <Modal size="xl" isOpen={editModal?.open} toggle={closeEditModal}>
                <EditModalForm loanData={loanData} editModal={editModal} setEditModal={setEditModal} closeEditModal={closeEditModal} token={token} setLoanData={setLoanData} />
            </Modal>
        )
    }

    function showNameDetails(name) {
        let totalAmount = 0, totalBorrowed = 0, totalPaid = 0
        let namedLoans = loanData.loans.filter(loan => {
            return (loan.name === name)
        })
        namedLoans.map(loan => {
            totalAmount += loan.total
            totalBorrowed += loan.amount
            totalPaid += loan.paid
        })
        setNameDetails({
            loans: namedLoans,
            totalAmount,
            totalBorrowed,
            totalPaid,
        })
    }

    return (
        <div className="debt_details container py-5">
            <div className="heading mb-3">Lender Details</div>
            <DeleteModal />
            <EditModal />
            {loanData?.loans?.length > 0 ?
                <div className="row">
                    <div className="col-12">
                        <HorizontalBarGraph loans={loanData?.loans} />
                    </div>
                </div> : <></>}
            <div className="row my-4 debt_table">
                <div className="col-6 sub_heading mb-3">Active Lender Debt</div>
                <div className="col-6">
                    <div className="btn_cont" style={{ justifyContent: 'flex-end' }}><div className='btn_ btn_small' onClick={() => triggerEditModal(true, true)}><FontAwesomeIcon icon={faPlus} />Add</div></div>
                </div>
                {activeLoans?.loans?.length > 0 ?
                    <>
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
                                    <div className="col-1 heading">Total</div>
                                    <div className="col-1 heading"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 data_scroll">
                            <div className="container_fluid">
                                {activeLoans.loans.map((loan) =>
                                    <div className="row data_row" key={loan._id}>
                                        <div className="col-2 data name_sec" style={{ cursor: 'pointer' }}><div className="name" onClick={() => showNameDetails(loan.name)}>{loan.name}</div></div>
                                        <div className="col-1 data">{moment(loan.startDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-1 data">{moment(loan.endDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-2 data">₹ {loan.amount}</div>
                                        <div className="col-1 data">{loan.intrest}%</div>
                                        <div className="col-2 data">₹ {loan.paid} ( ₹ {(loan.total - loan.paid).toFixed(2)} )</div>
                                        <div className="col-1 data">{((loan.paid / loan.total) * 100).toFixed(2)}%</div>
                                        <div className="col-1 data">₹ {loan.total}</div>
                                        <div className="col-1 data">
                                            <div className="edit" onClick={() => triggerEditModal(false, true, loan)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                            <div className="delete" onClick={() => triggerDeleteModal(loan._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="total_sec col-12 pt-3">
                            <div>Borrowed: ₹ {activeLoans.activeAmount}</div>
                            <div>Total Repayment: ₹ {activeLoans.activeTotal}</div>
                            <div>Extra: ₹ {(activeLoans.activeTotal - activeLoans.activeAmount).toFixed(2)}</div>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>
                }
            </div>
            <div className="row my-4 debt_table">
                <div className="col-6 sub_heading mb-3">Completed Lender Debt</div>
                <div className="col-6">
                    <div className="btn_cont" style={{ justifyContent: 'flex-end' }}><div className='btn_ btn_small' onClick={() => triggerEditModal(true, false)}><FontAwesomeIcon icon={faPlus} />Add</div></div>
                </div>
                {completedLoans?.loans?.length > 0 ?
                    <>
                        <div className="col-12">
                            <div className="container_fluid">
                                <div className="row heading_row">
                                    <div className="col-3 heading">Name</div>
                                    <div className="col-1 heading">Start Date</div>
                                    <div className="col-1 heading">End Date</div>
                                    <div className="col-2 heading">Amount</div>
                                    <div className="col-1 heading">Intrest</div>
                                    <div className="col-3 heading">Total</div>
                                    <div className="col-1 heading"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 data_scroll">
                            <div className="container_fluid">
                                {completedLoans.loans.map((loan) =>
                                    <div className="row data_row" key={loan._id}>
                                        <div className="col-3 data name_sec" style={{ cursor: 'pointer' }}><div className="name" onClick={() => showNameDetails(loan.name)}>{loan.name}</div></div>
                                        <div className="col-1 data">{moment(loan.startDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-1 data">{moment(loan.endDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-2 data">₹ {loan.amount}</div>
                                        <div className="col-1 data">{loan.intrest}%</div>
                                        <div className="col-3 data">₹ {loan.total}</div>
                                        <div className="col-1 data">
                                            <div className="edit" onClick={() => triggerEditModal(false, false, loan)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                            <div className="delete" onClick={() => triggerDeleteModal(loan._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-12 total_sec pt-3">
                            <div>Borrowed: ₹ {completedLoans?.completedAmount}</div>
                            <div>Total Repayment: ₹ {completedLoans?.completedTotal}</div>
                            <div>Extra: ₹ {(completedLoans?.completedTotal - completedLoans?.completedAmount).toFixed(2)}</div>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>
                }
            </div>

            {nameDetails.loans.length > 0 ?
                <>
                    <div className="row">
                        <div className="col-6 sub_heading mb-3">Details About {nameDetails.loans[0].name}</div>
                        <div className="col-12">
                            <div className="details_cont container_fluid">
                                <div className="row">
                                    <div className="col-12 data_sec mt-2 mb-3">
                                        <div className="status_bar">
                                            <div className="progress_bar" style={{ width: nameDetails.totalPaid * 100 / nameDetails.totalAmount>100 ? '100%':`${nameDetails.totalPaid * 100 / nameDetails.totalAmount}%` }}>
                                                <div className={"percentage" + (((nameDetails.totalPaid) / nameDetails.totalAmount) * 100 < 10 ? ' outside' : '')}>{(((nameDetails.totalPaid) / nameDetails.totalAmount) * 100).toFixed(2)}%</div>
                                            </div>
                                        </div>
                                        <div className="amount">₹ {nameDetails.totalPaid} / ₹ {nameDetails.totalAmount}</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="detail my-2">
                                            <div className="title">Total Amount</div>
                                            <div className="value">₹ {nameDetails.totalAmount}</div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="detail my-2">
                                            <div className="title">Amount Paid</div>
                                            <div className="value">₹ {nameDetails.totalPaid}</div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="detail my-2">
                                            <div className="title">Amount Remaining</div>
                                            <div className="value">₹ {nameDetails.totalAmount - nameDetails.totalPaid}</div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="detail my-2">
                                            <div className="title">Number Of Times Borrowed</div>
                                            <div className="value">{nameDetails.loans.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4 debt_table">
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
                                    <div className="col-1 heading">Total</div>
                                    <div className="col-1 heading"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 data_scroll">
                            <div className="container_fluid">
                                {nameDetails.loans.map(loan =>
                                    <div className="row data_row" key={loan._id}>
                                        <div className="col-2 data name_sec no_line">{loan.name}</div>
                                        <div className="col-1 data">{moment(loan.startDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-1 data">{moment(loan.endDate).format('DD/MM/YYYY')}</div>
                                        <div className="col-2 data">₹ {loan.amount}</div>
                                        <div className="col-1 data">{loan.intrest}%</div>
                                        <div className="col-2 data">₹ {loan.paid} (₹ {(loan.total - loan.paid).toFixed(2)})</div>
                                        <div className="col-1 data">{((loan.paid / loan.total) * 100).toFixed(2)}%</div>
                                        <div className="col-1 data">₹ {loan.total}</div>
                                        <div className="col-1 data">
                                            <div className="edit" onClick={() => triggerEditModal(false, false, loan)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                            <div className="delete" onClick={() => triggerDeleteModal(loan._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-12 total_sec pt-3">
                            <div>Borrowed: ₹ {nameDetails.totalBorrowed}</div>
                            <div>Total Repayment: ₹ {nameDetails.totalAmount}</div>
                            <div>Extra: ₹ {(nameDetails.totalAmount - nameDetails.totalBorrowed).toFixed(2)}</div>
                        </div>
                    </div>
                </>
                : <></>}
        </div>
    )
}
