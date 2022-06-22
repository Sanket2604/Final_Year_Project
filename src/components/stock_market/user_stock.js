import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import HorizontalBarGraph from './horizontal_bar'
import { stock_links } from './stock_links'
import { url } from '../../url'
import { useGetStockListQuery } from '../../services/stockListApi';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { Select } from 'antd'
import 'antd/dist/antd.css'
import './user_stock.css'
import StockDonutChart from './donut_chart'

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, stockData, editInvestment }) {

    const [formData, setFormData] = useState({
        id: '',
        symbol: '',
        name: '',
        startDate: '',
        endDate: '',
        boughtAt: '',
        quantity: '',
        investment: '',
        closedAt: '',
        status: ''
    })
    const [errors, setErrors] = useState(formData)
    const { Option } = Select;

    useEffect(() => {
        setFormData({
            id: editInvestment?._id ? editInvestment?._id : '',
            symbol: editInvestment?.symbol ? editInvestment?.symbol : '',
            name: editInvestment?.name ? editInvestment?.name : '',
            startDate: editInvestment?.startDate ? editInvestment?.startDate : '',
            endDate: editInvestment?.endDate ? editInvestment?.endDate : '',
            boughtAt: editInvestment?.boughtAt ? editInvestment?.boughtAt : '',
            quantity: editInvestment?.quantity ? editInvestment?.quantity : '',
            investment: editInvestment?.investment ? editInvestment?.investment : '',
            closedAt: editInvestment?.closedAt ? editInvestment?.closedAt : '',
            status: editInvestment?.status ? editInvestment?.status : 'active'
        })
    }, [editInvestment])

    function closeEditModal() {
        setEditModalOpen(false)
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function setCoinName(value) {
        let tempArray = value.split('+')
        setFormData({ ...formData, name: tempArray[0], symbol: tempArray[1] })
    }

    function investmentStatus(status) {
        if (status) {
            setFormData({ ...formData, status: 'active' })
        }
        else {
            setFormData({ ...formData, status: 'completed' })
        }
    }

    
    function validateForm() {
        let duration
        const nodeList = document.querySelectorAll('.form_error')
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].classList.remove('error')
        }
        if (formData.name === '') {
            setErrors({ ...errors, name: 'Select A Stock' })
            document.getElementById('error_name').classList.add('error')
            return false
        }
        if (formData.boughtAt === '') {
            setErrors({ ...errors, boughtAt: 'Enter Stock Buy Price' })
            document.getElementById('error_boughtAt').classList.add('error')
            return false
        }
        if (formData.boughtAt>100000000 || formData.boughtAt<1) {
            setErrors({ ...errors, boughtAt: 'Enter A Valid Stock Buy Price' })
            document.getElementById('error_boughtAt').classList.add('error')
            return false
        }
        if (formData.quantity === '') {
            setErrors({ ...errors, quantity: 'Enter The Number Of Stocks Bought' })
            document.getElementById('error_quantity').classList.add('error')
            return false
        }
        if (formData.quantity >1000 || formData.quantity<1) {
            setErrors({ ...errors, quantity: 'Enter Quantity Between 1 and 1000' })
            document.getElementById('error_quantity').classList.add('error')
            return false
        }
        if (formData.startDate === '') {
            document.getElementById('error_startDate').classList.add('error')
            setErrors({ ...errors, startDate: 'Select A Start Date' })
            return false
        }
        duration = moment(formData.startDate).diff(moment(), 'days')
        if (duration>0) {
            document.getElementById('error_startDate').classList.add('error')
            setErrors({ ...errors, startDate: 'Start Date Can Not Be In Future' })
            return false
        }
        if (formData.endDate === '' && formData.status === 'completed') {
            setErrors({ ...errors, endDate: 'Select An End Date' })
            document.getElementById('error_endDate').classList.add('error')
            return false
        }
        duration = moment(formData.endDate).diff(moment(), 'days')
        if (duration>0) {
            document.getElementById('error_endDate').classList.add('error')
            setErrors({ ...errors, endDate: 'End Date Can Not Be In Future' })
            return false
        }
        duration = moment(formData.endDate).diff(moment(formData.startDate), 'days')
        if (duration < 1) {
            setErrors({ ...errors, startDate: 'Start Date Can Not be After End Date' })
            document.getElementById('error_startDate').classList.add('error')
            return false
        }
        if (formData.closedAt === '' && formData.status === 'completed') {
            setErrors({ ...errors, closedAt: 'Enter Stock Sell Price' })
            document.getElementById('error_closedAt').classList.add('error')
            return false
        }
        if ((formData.closedAt>100000000 || formData.closedAt<1) && formData.status === 'completed') {
            setErrors({ ...errors, closedAt: 'Enter A Valid Stock Sell Price' })
            document.getElementById('error_closedAt').classList.add('error')
            return false
        }
        return true;
    }

    function postStockInvestment() {
        if(!validateForm()) return
        axios
            .post(url + '/stock/postStockInvestment', {
                logo: formData.logo,
                symbol: formData.symbol,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status === 'active' ? 0 : formData.closedAt,
                quantity: formData.quantity,
                investment: formData.quantity * formData.boughtAt,
                status: formData.status
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Stock Investment Added')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function putStockInvestment() {
        if(!validateForm()) return
        axios
            .put(url + '/stock/editStockInvestment', {
                id: formData.id,
                logo: formData.logo,
                symbol: formData.symbol,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status === 'active' ? 0 : formData.closedAt,
                quantity: formData.quantity,
                investment: formData.quantity * formData.boughtAt,
                status: formData.status
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Stock Investment Edited')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Modal size="xl" isOpen={editModalOpen} toggle={closeEditModal}>
            <ModalHeader toggle={closeEditModal}>{newInvestment ? 'Add' : 'Edit'} Investment</ModalHeader>
            <ModalBody>
                <Form>
                    <Row form>
                        <Col md={6} className='mb-3 d-flex flex-column justify-content-center'>
                            <div>
                            <Label htmlFor="name">Select A Stock</Label>
                            <Select
                                showSearch
                                dropdownStyle={{ backgroundColor: 'var(--secondary)' }}
                                className="select-news"
                                placeholder="Select a Cryptocurrency"
                                optionFilterProp="children"
                                onChange={(value) => setCoinName(value)}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {stockData?.data?.map((stock, i) => <Option value={`${stock.name}+${stock.symbol}`} key={i}>{stock.name}</Option>)}
                            </Select>
                            </div>
                            {formData.name ? <>
                                <div className="details mt-1"><span style={{ fontSize: '16px' }}>Selected Stock:</span> {formData.name}</div>
                                <div className="details mt-1"><span style={{ fontSize: '16px' }}>Stock Symbol:</span> {formData.symbol}</div>
                            </>:<></>}
                            <div id="error_name" className='form_error'>{errors.name}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Amount</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="investment" placeholder="Investment Amount (in rupees)" value={(formData.boughtAt * formData.quantity).toFixed(2)} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Buy Price</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="boughtAt" placeholder="Stock Price (in rupees)" value={formData.boughtAt} onChange={handleChange} />
                            <div id="error_boughtAt" className='form_error'>{errors.boughtAt}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Quantity</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
                            <div id="error_quantity" className='form_error'>{errors.quantity}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Start Date</Label>
                            <Input type="date" id="name" name="startDate" value={moment(formData.startDate).format('YYYY-MM-DD')} onChange={handleChange} />
                            <div id="error_startDate" className='form_error'>{errors.startDate}</div>
                        </Col>
                        {formData.status === 'active' ?
                            <></> :
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Investment End Date</Label>
                                <Input type="date" id="name" name="endDate" value={moment(formData.endDate).format('YYYY-MM-DD')} onChange={handleChange} />
                                <div id="error_endDate" className='form_error'>{errors.endDate}</div>
                            </Col>
                        }
                        {formData.status === 'active' ? <></> :
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Sell Price</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="closedAt" placeholder="Closing Price (in rupees)" value={formData.closedAt} onChange={handleChange} />
                                <div id="error_closedAt" className='form_error'>{errors.closedAt}</div>
                            </Col>
                        }
                        <Col md={12} className='d-flex flex-coloumn justify-content-center align-items-center mt-2'>
                            <div className='d-flex justify-content-center align-items-center'>
                            <span className='col_heading'>Investment Status:</span>
                            <span className={'active mx-3' + (formData.status === 'active' ? ' highlight' : '')} onClick={() => investmentStatus(true)}>Active</span>
                            <span className={'completed ' + (formData.status === 'completed' ? ' highlight' : '')} onClick={() => investmentStatus(false)}>Completed</span>
                            </div>
                            <div id="error_status" className='form_error'>{errors.closedAt}</div>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={formData.id ? putStockInvestment : postStockInvestment}>{newInvestment ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function UserStock() {

    const { data: stockData } = useGetStockListQuery()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newInvestment, setNewInvestment] = useState(false)
    const [activeInvestment, setActiveInvestment] = useState([])
    const [completedInvestment, setCompletedInvestment] = useState([])
    const [editInvestment, setEditInvestment] = useState({})
    const [investmentDeleteId, setInvestmentDeleteId] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Stock Investment`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')

        if (token) {
            try {
                axios
                    .get(url + '/stock/getStockInvestment', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setActiveInvestment(res.data.activeInvestment)
                        setCompletedInvestment(res.data.completedInvestment)
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

    function triggerEditModal(add, invst) {
        setEditModalOpen(true)
        setNewInvestment(add)
        setEditInvestment(invst)
    }

    function triggerDeleteModal(id) {
        setDeleteModalOpen(true)
        setInvestmentDeleteId(id)
    }
    function closeDeleteModal() {
        setDeleteModalOpen(false)
    }
    function deleteCryptoInvestment() {
        axios
            .delete(url + '/stock/deleteStockInvestment/' + investmentDeleteId, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Stock Investment Deleted')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function DeleteModal() {
        return (
            <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>Delete Investment?</ModalHeader>
                <ModalBody>Delete Investment</ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" onClick={deleteCryptoInvestment}>Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }
    return (
        <div className='container crypto_stock py-5'>
            <EditModal editModalOpen={editModalOpen} token={token} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} stockData={stockData} editInvestment={editInvestment} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className="row mb-4">
                <div className="col-12 heading">Your Stock Investments</div>
            </div>
            {activeInvestment?.investments?.length > 0 ?
                <div className="row mb-5">
                    <div className="col-12">
                        <HorizontalBarGraph investments={activeInvestment?.investments} />
                    </div>
                </div>
                : <></>}
            <div className="row">
                <div className="col-12 heading">Active Investments</div>
            </div>
            {activeInvestment?.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-1 data">Logo</div>
                            <div className="col-3 data">Stock Name</div>
                            <div className="col-2 data">Date</div>
                            <div className="col-2 data">Buying Price</div>
                            <div className="col-2 data">Quantity</div>
                            <div className="col-2 data">Investment</div>
                        </div>
                        {activeInvestment.investments.map((invst, i) =>
                            <div className="row invest_data py-2" key={invst._id}>
                                <div className="col-1 data">
                                    <div className="symbol stock me-2" style={{ backgroundImage: `url(${stock_links[invst?.symbol] ? stock_links[invst?.symbol][0] : ''})` }} ></div>
                                </div>
                                <Link to={`/stock_market/${invst.symbol}`} className="col-3 data name_sec">
                                    <div className="name">{invst.name}</div>
                                    <div className="ticker">{invst.symbol}</div>
                                </Link>
                                <div className="col-2 data">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                <div className="col-2 data">{invst.quantity}</div>
                                <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <span className="total_investment">Total Invested: ₹ {customUnits(activeInvestment.investedAmount)}</span>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
            <div className="row mt-5">
                <div className="col-12 heading">Completed Investments</div>
            </div>
            {completedInvestment?.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-1 data">Logo</div>
                            <div className="col-2 data">Stock Name</div>
                            <div className="col-1 data">Duration</div>
                            <div className="col-2 data">Buy Price</div>
                            <div className="col-1 data">Quantity</div>
                            <div className="col-2 data">Sell Price</div>
                            <div className="col-1 data">Investment</div>
                            <div className="col-2 data">Total Return</div>
                        </div>
                        {completedInvestment.investments.map(invst =>
                            <div className="row invest_data py-2" key={invst._id}>
                                <div className="col-1 data">
                                    <div className="symbol stock me-2" style={{ backgroundImage: `url(${stock_links[invst.symbol][0]})` }} ></div>
                                </div>
                                <Link to={`/stock_market/${invst.symbol}`} className="col-2 data name_sec">
                                    <div className="name">{invst.name}</div>
                                    <div className="ticker">{invst.symbol}</div>
                                </Link>
                                <div className="col-1 data date">{moment(invst.startDate).format('DD/MM/YYYY')} <FontAwesomeIcon icon={faAngleDown} /> {moment(invst.endDate).format('DD/MM/YYYY')}</div>
                                <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                <div className="col-1 data">{invst.quantity.toFixed(2)}</div>
                                <div className="col-2 data">₹ {customUnits(invst.closedAt)}</div>
                                <div className="col-1 data">₹ {customUnits(invst.investment)}</div>
                                <div className="col-2 data">
                                    <div className="value">₹ {customUnits((invst.closedAt * invst.quantity).toFixed(2))}</div>
                                    <div className={'status big ms-2' + ((invst.closedAt * invst.quantity) / invst.investment > 1 ? ' profit' : ' loss')}>
                                        <FontAwesomeIcon icon={(invst.closedAt * invst.quantity) / invst.investment > 1 ? faCaretUp : faCaretDown} />{Math.abs((100 - ((invst.closedAt * invst.quantity) * 100 / invst.investment)).toFixed(2))}%
                                    </div>
                                </div>
                                <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <div className="total_investment">Total Invested: ₹ {customUnits(completedInvestment.totalInvestment)}</div>
                        <div className="total_return mx-4">Return Of Investment: ₹ {customUnits(completedInvestment.totalReturn)}</div>
                        <div className="change">
                            <span className='me-1'>Total Earned: ₹ </span>
                            <span className={completedInvestment.totalReturn - completedInvestment.totalInvestment > 0 ? 'profit' : 'loss'}>
                                {customUnits(Math.abs((completedInvestment.totalReturn - completedInvestment.totalInvestment).toFixed(2)))}
                                <span className='changePercentage'>
                                    <FontAwesomeIcon icon={completedInvestment.totalReturn - completedInvestment.totalInvestment > 0 ? faCaretUp : faCaretDown} /> {customUnits(Math.abs(((completedInvestment.totalReturn - completedInvestment.totalInvestment) * 100 / completedInvestment.totalInvestment).toFixed(2)))} %
                                </span>
                            </span>
                        </div>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
        </div>
    )
}
