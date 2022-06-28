import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import HorizontalBarGraph from './horizontal_bar'
import { url } from '../../url'
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { Select } from 'antd';
import 'antd/dist/antd.css'
import './user_crypto.css'

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, cryptoCoins, editInvestment, customUnits }) {

    const [formData, setFormData] = useState({
        id: '',
        logo: '',
        cryptoId: '',
        name: '',
        startDate: '',
        endDate: '',
        boughtAt: '',
        quantity: '',
        investment: '',
        closedAt: '',
        status: '',
        price: 0
    })
    const [errors, setErrors] = useState(formData)
    const { Option } = Select;

    useEffect(() => {
        setFormData({
            id: editInvestment?._id ? editInvestment._id : '',
            logo: editInvestment?.logo ? editInvestment.logo : '',
            cryptoId: editInvestment?.cryptoId ? editInvestment.cryptoId : '',
            name: editInvestment?.name ? editInvestment.name : '',
            startDate: editInvestment?.startDate ? editInvestment.startDate : '',
            endDate: editInvestment?.endDate ? editInvestment.endDate : '',
            boughtAt: editInvestment?.boughtAt ? editInvestment.boughtAt : '',
            quantity: editInvestment?.quantity ? editInvestment.quantity : '',
            investment: editInvestment?.investment ? editInvestment.investment : '',
            closedAt: editInvestment?.closedAt ? editInvestment.closedAt : '',
            status: editInvestment?.status ? editInvestment.status : 'active',
            price: 0
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
        setFormData({ ...formData, name: tempArray[0], cryptoId: tempArray[1], logo: tempArray[2], price: tempArray[3] })
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
            setErrors({ ...errors, name: 'Select A Crypto Coin' })
            document.getElementById('error_name').classList.add('error')
            return false
        }
        if (formData.boughtAt === '') {
            setErrors({ ...errors, boughtAt: 'Enter Crypto Buy Price' })
            document.getElementById('error_boughtAt').classList.add('error')
            return false
        }
        if (formData.boughtAt > 100000000 || formData.boughtAt < 1) {
            setErrors({ ...errors, boughtAt: 'Enter A Valid Crypto Buy Price' })
            document.getElementById('error_boughtAt').classList.add('error')
            return false
        }
        if (formData.investment === '') {
            setErrors({ ...errors, investment: 'Enter The Amout Invested' })
            document.getElementById('error_investment').classList.add('error')
            return false
        }
        if (formData.investment > 100000000 || formData.investment < 1) {
            setErrors({ ...errors, investment: 'Enter Investment Between 1 and 10,00,00,000' })
            document.getElementById('error_investment').classList.add('error')
            return false
        }
        if (formData.startDate === '') {
            document.getElementById('error_startDate').classList.add('error')
            setErrors({ ...errors, startDate: 'Select A Buy Date' })
            return false
        }
        duration = moment(formData.startDate).diff(moment(), 'days')
        if (duration > 0) {
            document.getElementById('error_startDate').classList.add('error')
            setErrors({ ...errors, startDate: 'Start Date Can Not Be In Future' })
            return false
        }
        if (formData.endDate === '' && formData.status === 'completed') {
            setErrors({ ...errors, endDate: 'Select An Sell Date' })
            document.getElementById('error_endDate').classList.add('error')
            return false
        }
        duration = moment(formData.endDate).diff(moment(), 'days')
        if (duration > 0) {
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
            setErrors({ ...errors, closedAt: 'Enter Crypto Sell Price' })
            document.getElementById('error_closedAt').classList.add('error')
            return false
        }
        if ((formData.closedAt > 100000000 || formData.closedAt < 1) && formData.status === 'completed') {
            setErrors({ ...errors, closedAt: 'Enter A Valid Crypto Sell Price' })
            document.getElementById('error_closedAt').classList.add('error')
            return false
        }
        return true;
    }

    function postCryptoInvestment() {
        if (!validateForm()) return
        axios
            .post(url + '/crypto/postCryptoInvestment', {
                logo: formData.logo,
                cryptoId: formData.cryptoId,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status === 'active' ? 0 : formData.closedAt,
                quantity: formData.investment / formData.boughtAt,
                investment: formData.investment,
                status: formData.status
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Crypto Investment Added')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function putCryptoInvestment() {
        if (!validateForm()) return
        axios
            .put(url + '/crypto/editCryptoInvestment', {
                id: formData.id,
                logo: formData.logo,
                cryptoId: formData.cryptoId,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status === 'active' ? 0 : formData.closedAt,
                quantity: formData.investment / formData.boughtAt,
                investment: formData.investment,
                status: formData.status
            }, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Crypto Investment Edited')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Modal size="xl" isOpen={editModalOpen} toggle={closeEditModal}>
            <ModalHeader toggle={closeEditModal}><img className='modal_logo me-2' src={formData.logo ? formData.logo : 'https://icons.veryicon.com/png/o/miscellaneous/color-work-icon/blockchain-2.png'} />{newInvestment ? 'Add' : 'Edit'} Investment {formData.name ? `in ${formData.name}` : ''}</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col md={6} className='mb-3 d-flex flex-column justify-content-center'>
                            <div>
                                <Label htmlFor="name">Select Crypto Coin</Label>
                                <Select
                                    showSearch
                                    dropdownStyle={{ backgroundColor: 'var(--secondary)' }}
                                    className="select-news"
                                    placeholder="Select a Cryptocurrency"
                                    optionFilterProp="children"
                                    onChange={(value) => setCoinName(value)}
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="Cryptocurency">All Cryptocurrency</Option>
                                    {cryptoCoins?.data?.coins?.map((currency, i) => <Option value={`${currency.name}+${currency.uuid}+${currency.iconUrl}+${parseFloat(currency.price)}`} key={i}>{currency.name}</Option>)}
                                </Select>
                            </div>
                            {formData.name ? <>
                                <div className="details mt-1"><span style={{ fontSize: '16px' }}>Selected Coin:</span> {formData.name}</div>
                                <div className="details mt-1"><span style={{ fontSize: '16px' }}>Current Coin Price:</span> ₹ {customUnits(formData.price)}</div>
                            </> : <></>}
                            <div id="error_name" className='form_error'>{errors.name}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Quantity</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="quantity" placeholder="Quantity" value={(formData.investment / formData.boughtAt).toFixed(2)} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Bought At</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="boughtAt" placeholder="Crypto Coin Price (in rupees)" value={formData.boughtAt} onChange={handleChange} />
                            <div id="error_boughtAt" className='form_error'>{errors.boughtAt}</div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Amount</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="investment" placeholder="Investment Amount (in rupees)" value={formData.investment} onChange={handleChange} />
                            <div id="error_investment" className='form_error'>{errors.investment}</div>
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
                                <Label htmlFor="name">Closed At</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="closedAt" placeholder="Closing Price (in rupees)" value={formData.closedAt} onChange={handleChange} />
                                <div id="error_closedAt" className='form_error'>{errors.closedAt}</div>
                            </Col>
                        }
                        <Col md={12} className='d-flex justify-content-center align-items-center mt-2'>
                            <span className='col_heading'>Investment Status:</span>
                            <span className={'active mx-3' + (formData.status === 'active' ? ' highlight' : '')} onClick={() => investmentStatus(true)}>Active</span>
                            <span className={'completed ' + (formData.status === 'completed' ? ' highlight' : '')} onClick={() => investmentStatus(false)}>Completed</span>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={formData.id ? putCryptoInvestment : postCryptoInvestment}>{newInvestment ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function UserCrypto() {

    const { data } = useGetCryptosQuery(100);
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newInvestment, setNewInvestment] = useState(false)
    const [activeInvestment, setActiveInvestment] = useState([])
    const [completedInvestment, setCompletedInvestment] = useState([])
    const [editInvestment, setEditInvestment] = useState({})
    const [investmentDeleteId, setInvestmentDeleteId] = useState()
    let totalActiveInvestment = 0
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Crypto Investment`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')

        if (token) {
            try {
                axios
                    .get(url + '/crypto/getCryptoInvestment', {
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

    function CryptoTotalInvestment({ changeToken }) {
        const [currentTotal, setCurrentTotal] = useState(0)
        const [change, setChange] = useState(0)

        useEffect(() => {
            let coins = [], total = 0
            activeInvestment.investments.map(invst => {
                coins.push({
                    coinId: invst.cryptoId,
                    qty: invst.quantity,
                    price: 0
                })
            })
            data?.data?.coins.map(coin => {
                coins.map(invst => {
                    if (coin.uuid === invst.coinId) {
                        invst.price = coin.price
                    }
                })
            })
            coins.map(invst => {
                total += (parseFloat(invst.price) * parseFloat(invst.qty))
            })
            setCurrentTotal(total.toFixed(2))
            if (changeToken) {
                setChange((((total - activeInvestment.investedAmount) / activeInvestment.investedAmount) * 100).toFixed(2))
            }
        })
        if (changeToken) {
            return (
                <>
                    Total {change > 0 ? 'Profit' : 'Loss'}: ₹
                    <span className={change > 0 ? 'profit ms-1' : 'loss ms-1'}>
                        {customUnits(Math.abs(currentTotal - activeInvestment.investedAmount).toFixed(2))}
                        <span className='changePercentage'><FontAwesomeIcon icon={change > 0 ? faCaretUp : faCaretDown} /> {customUnits(Math.abs(change))} %</span>
                    </span>
                </>
            )
        }

        return <>₹ {customUnits(currentTotal)}</>
    }

    function CryptoPrice({ id, qty, total }) {
        const [coinPrice, setCoinPrice] = useState([])

        useEffect(() => {
            data?.data?.coins.map(coin => {
                if (coin.uuid === id) {
                    setCoinPrice(coin.price)
                    if (total) totalActiveInvestment += (parseFloat(coin.price)) * qty
                }
            })
        }, [])

        if (total) return <>₹ {customUnits(totalActiveInvestment)}</>

        return (
            <>₹ {customUnits(((parseFloat(coinPrice)) * qty).toFixed(2))}</>
        )
    }

    function CryptoChange({ id, boughtAt, i }) {
        const [priceChange, setPriceChange] = useState([])

        useEffect(() => {
            let coinPrice = 0
            data?.data?.coins.map(coin => {
                if (id === coin.uuid) {
                    coinPrice = coin.price
                }
            })
            setPriceChange((((coinPrice - boughtAt) / boughtAt) * 100).toFixed(2))
        }, [])

        return (
            <div className={'status ms-2' + (priceChange > 0 ? ' profit' : ' loss')}>
                <FontAwesomeIcon icon={priceChange > 0 ? faCaretUp : faCaretDown} />{customUnits(Math.abs(priceChange))}%
            </div>
        )
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
            .delete(url + '/crypto/deleteCryptoInvestment/' + investmentDeleteId, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then(() => {
                alert('Crypto Investment Deleted')
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
            <EditModal editModalOpen={editModalOpen} token={token} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} cryptoCoins={data} editInvestment={editInvestment} customUnits={customUnits} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className="row mb-4">
                <div className="col-12 heading">Your Crypto Investments</div>
            </div>
            {activeInvestment.investments?.length > 0 ?
                <div className="row">
                    <div className="col-12">
                        <HorizontalBarGraph investments={activeInvestment.investments} coinData={data?.data?.coins} />
                    </div>
                </div> : <></>}
            <div className="row mt-5">
                <div className="col-12 heading">Active Investments</div>
            </div>
            {activeInvestment.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-2 data">Crypto Name</div>
                            <div className="col-1 data">Buy Date</div>
                            <div className="col-2 data">Bought At</div>
                            <div className="col-2 data">Current Price</div>
                            <div className="col-1 data">Quantity</div>
                            <div className="col-2 data">Investment</div>
                            <div className="col-2 data">Current Value</div>
                        </div>
                        {activeInvestment.investments.map((invst, i) =>
                            <div className="row invest_data py-2" key={invst._id}>
                                <Link to={`/crypto_coin/${invst.cryptoId}`} className="col-2 data">
                                    <div className="symbol me-2" style={{ backgroundImage: `url(${invst.logo})` }} ></div>
                                    {invst.name}
                                </Link>
                                <div className="col-1 data">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                <div className="col-2 data"><CryptoPrice id={invst.cryptoId} qty={1} /></div>
                                <div className="col-1 data">{invst.investedAmount > 100000 ? customUnits((invst.quantity).toFixed(4)) : customUnits((invst.quantity).toFixed(2))}</div>
                                <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                <div className="col-2 data">
                                    <div className="value"><CryptoPrice id={invst.cryptoId} qty={invst.quantity} /></div>
                                    <CryptoChange id={invst.cryptoId} boughtAt={invst.boughtAt} />
                                </div>
                                <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <span className="total_investment">Total Invested: ₹ {customUnits(activeInvestment.investedAmount)}</span>
                        <span className="total_currentvalue mx-4">Total Current Value: <CryptoTotalInvestment /></span>
                        <span className="change"><CryptoTotalInvestment changeToken={true} /></span>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
            <div className="row mt-5">
                <div className="col-12 heading">Completed Investments</div>
            </div>
            {completedInvestment?.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-2 data">Crypto Name</div>
                            <div className="col-1 data">Duration</div>
                            <div className="col-2 data">Bought At</div>
                            <div className="col-1 data">Quantity</div>
                            <div className="col-2 data">Closed At</div>
                            <div className="col-2 data">Investment</div>
                            <div className="col-2 data">Return Value</div>
                        </div>
                        {completedInvestment.investments.map((invst, i) =>
                            <div className="row invest_data py-2" key={invst._id}>
                                <Link to={`/crypto_coin/${invst.cryptoId}`} className="col-2 data">
                                    <div className="symbol me-2" style={{ backgroundImage: `url(${invst.logo})` }} ></div>
                                    {invst.name}
                                </Link>
                                <div className="col-1 data date">{moment(invst.startDate).format('DD/MM/YYYY')} <FontAwesomeIcon icon={faAngleDown} /> {moment(invst.endDate).format('DD/MM/YYYY')}</div>
                                <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                <div className="col-1 data">{invst.quantity.toFixed(2)}</div>
                                <div className="col-2 data">₹ {customUnits(invst.closedAt)}</div>
                                <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                <div className="col-2 data">
                                    <div className="value">₹ {customUnits((invst.quantity * invst.closedAt).toFixed(2))}</div>
                                    <div className={'status big ms-2' + ((invst.quantity * invst.closedAt) * 100 / invst.investment > 100 ? ' profit' : ' loss')}>
                                        <FontAwesomeIcon icon={(invst.quantity * invst.closedAt) * 100 / invst.investment > 100 ? faCaretUp : faCaretDown} />{customUnits(Math.abs((100 - ((invst.quantity * invst.closedAt) * 100 / invst.investment)).toFixed(2)))}%
                                    </div>
                                </div>
                                <div className="modify edit big" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete big" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <div className="total_investment">Total Invested: ₹ {customUnits(completedInvestment.totalInvestment)}</div>
                        <div className="total_return mx-4">Return Of Investment: ₹ {customUnits(completedInvestment.totalReturn)}</div>
                        <div className="change">
                            <span className='me-1'>Total {completedInvestment.totalReturn - completedInvestment.totalInvestment > 0 ? 'Profit' : 'Loss'}: ₹ </span>
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
