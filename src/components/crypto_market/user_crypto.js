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

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, cryptoCoins, editInvestment }) {

    const [formData, setFormData] = useState({
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
        status: editInvestment?.status ? editInvestment.status : 'active'
    })
    const { Option } = Select;

    useEffect(()=>{
        setFormData({
            id: editInvestment?._id,
            logo: editInvestment?.logo,
            cryptoId: editInvestment?.cryptoId,
            name: editInvestment?.name,
            startDate: editInvestment?.startDate,
            endDate: editInvestment?.endDate,
            boughtAt: editInvestment?.boughtAt,
            quantity: editInvestment?.quantity,
            investment: editInvestment?.investment,
            closedAt: editInvestment?.closedAt,
            status: editInvestment?.status
        })
    },[editInvestment])

    function closeEditModal() {
        setEditModalOpen(false)
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function setCoinName(value) {
        let tempArray = value.split('+')
        setFormData({ ...formData, name: tempArray[0], cryptoId: tempArray[1], logo: tempArray[2] })
    }

    function investmentStatus(status) {
        if (status) {
            setFormData({ ...formData, status: 'active' })
        }
        else {
            setFormData({ ...formData, status: 'completed' })
        }
    }

    function postCryptoInvestment() {
        axios
            .post(url + '/crypto/postCryptoInvestment', {
                logo: formData.logo,
                cryptoId: formData.cryptoId,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status==='active' ? 0:formData.closedAt,
                quantity: formData.investment/formData.boughtAt,
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

    function putCryptoInvestment(){
        console.log(formData)
        axios
            .put(url + '/crypto/editCryptoInvestment', {
                id: formData.id,
                logo: formData.logo,
                cryptoId: formData.cryptoId,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                closedAt: formData.status==='active' ? 0:formData.closedAt,
                quantity: formData.investment/formData.boughtAt,
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
            <ModalHeader toggle={closeEditModal}>{newInvestment ? 'Add' : 'Edit'} Investment</ModalHeader>
            <ModalBody>
                <Form>
                    <Row form>
                        <Col md={6} className='mb-3'>
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
                                {cryptoCoins?.data?.coins?.map((currency, i) => <Option value={`${currency.name}+${currency.uuid}+${currency.iconUrl}`} key={i}>{currency.name}</Option>)}
                            </Select>
                            <div className="details mt-1"><span style={{ fontSize: '18px' }}>Selected Coin:</span> {formData.name}</div>
                            <div id="error_name" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Quantity</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="quantity" placeholder="Quantity" value={(formData.investment / formData.boughtAt).toFixed(2)} disabled />
                            <div id="error_quantity" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Bought At</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="boughtAt" placeholder="Crypto Coin Price (in rupees)" value={formData.boughtAt} onChange={handleChange} />
                            <div id="error_boughtAt" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Amount</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="investment" placeholder="Investment Amount (in rupees)" value={formData.investment} onChange={handleChange} />
                            <div id="error_investment" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Start Date</Label>
                            <Input type="date" id="name" name="startDate" value={moment(formData.startDate).format('YYYY-MM-DD')} onChange={handleChange} />
                            <div id="error_startDate" className='form_error'></div>
                        </Col>
                        {formData.status === 'active' ?
                            <></> :
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Investment End Date</Label>
                                <Input type="date" id="name" name="endDate" value={moment(formData.endDate).format('YYYY-MM-DD')} onChange={handleChange} />
                                <div id="error_endDate" className='form_error'></div>
                            </Col>
                        }
                        {formData.status === 'active' ? <></> :
                            <Col md={6} className='mb-3'>
                                <Label htmlFor="name">Closed At</Label>
                                <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="closedAt" placeholder="Closing Price (in rupees)" value={formData.closedAt} onChange={handleChange} />
                                <div id="error_closedAt" className='form_error'></div>
                            </Col>
                        }
                        {/* <Col md={6} className='d-flex justify-content-center align-items-center'>
                            <span className='col_heading'>Position:</span>
                            <span className='completed mx-3'>Buy</span>
                            <span className='active'>Sell</span>
                        </Col> */}
                        <Col md={12} className='d-flex justify-content-center align-items-center mt-2'>
                            <span className='col_heading'>Investment Status:</span>
                            <span className={'active mx-3' + (formData.status === 'active' ? ' highlight' : '')} onClick={() => investmentStatus(true)}>Active</span>
                            <span className={'completed ' + (formData.status === 'completed' ? ' highlight' : '')} onClick={() => investmentStatus(false)}>Completed</span>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={formData.id ? putCryptoInvestment:postCryptoInvestment}>{newInvestment ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function UserStock() {

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
                        console.log(res.data)
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
                <span className={change > 0 ? 'profit' : 'loss'}>
                    {Math.abs(currentTotal-activeInvestment.investedAmount).toFixed(2)}
                    <span className='changePercentage'><FontAwesomeIcon icon={change > 0 ? faCaretUp : faCaretDown} /> {Math.abs(change)} %</span>
                </span>
            )
        }

        return <>₹ {currentTotal}</>
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

        if (total) return <>₹ {totalActiveInvestment}</>

        return (
            <>₹ {((parseFloat(coinPrice)) * qty).toFixed(2)}</>
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
                <FontAwesomeIcon icon={priceChange > 0 ? faCaretUp : faCaretDown} />{Math.abs(priceChange)}%
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
    function deleteCryptoInvestment(){
        axios
            .delete(url + '/crypto/deleteCryptoInvestment/'+investmentDeleteId, {
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
            <EditModal editModalOpen={editModalOpen} token={token} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} cryptoCoins={data} editInvestment={editInvestment} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className="row mb-4">
                <div className="col-12 heading">Your Crypto Investments</div>
            </div>
            <div className="row">
                <div className="col-12">
                    <HorizontalBarGraph investments={activeInvestment.investments} coinData={data?.data?.coins} />
                </div>
            </div>
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
                                <div className="col-2 data">₹ {invst.boughtAt}</div>
                                <div className="col-2 data"><CryptoPrice id={invst.cryptoId} qty={1} /></div>
                                <div className="col-1 data">{invst.investedAmount>100000?(invst.quantity).toFixed(4):(invst.quantity).toFixed(2)}</div>
                                <div className="col-2 data">₹ {invst.investment}</div>
                                <div className="col-2 data">
                                    <div className="value"><CryptoPrice id={invst.cryptoId} qty={invst.quantity} /></div>
                                    <CryptoChange id={invst.cryptoId} boughtAt={invst.boughtAt} />
                                </div>
                                <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <span className="total_investment">Total Invested: ₹ {activeInvestment.investedAmount}</span>
                        <span className="total_currentvalue mx-4">Total Current Value: <CryptoTotalInvestment /></span>
                        <span className="change">Total Change: ₹ <CryptoTotalInvestment changeToken={true} /></span>
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
                                <div className="col-2 data">₹ {invst.boughtAt}</div>
                                <div className="col-1 data">{invst.quantity.toFixed(2)}</div>
                                <div className="col-2 data">₹ {invst.closedAt}</div>
                                <div className="col-2 data">₹ {invst.investment}</div>
                                <div className="col-2 data">
                                    <div className="value">₹ {(invst.quantity*invst.closedAt).toFixed(2)}</div>
                                    <div className={'status big ms-2' + ((invst.quantity*invst.closedAt)*100/invst.investment > 100 ? ' profit' : ' loss')}>
                                        <FontAwesomeIcon icon={(invst.quantity*invst.closedAt)*100/invst.investment > 100 ? faCaretUp : faCaretDown} />{Math.abs((100-((invst.quantity*invst.closedAt)*100/invst.investment)).toFixed(2))}%
                                    </div>
                                </div>
                                <div className="modify edit big" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete big" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <div className="total_investment">Total Invested: ₹ {completedInvestment.totalInvestment}</div>
                        <div className="total_return mx-4">Return Of Investment: ₹ {completedInvestment.totalReturn}</div>
                        <div className="change">
                            <span className='me-1'>Total Earned: ₹ </span>
                            <span className={completedInvestment.totalReturn-completedInvestment.totalInvestment > 0 ? 'profit' : 'loss'}>
                                {Math.abs((completedInvestment.totalReturn-completedInvestment.totalInvestment).toFixed(2))}
                                <span className='changePercentage'>
                                    <FontAwesomeIcon icon={completedInvestment.totalReturn-completedInvestment.totalInvestment > 0 ? faCaretUp : faCaretDown} /> {Math.abs(((completedInvestment.totalReturn-completedInvestment.totalInvestment)*100/completedInvestment.totalInvestment).toFixed(2))} %
                                </span>
                            </span>
                        </div>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
        </div>
    )
}
