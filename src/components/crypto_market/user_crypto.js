import React, { useEffect, useState } from 'react'
import StockDonutChart from './donut_chart'
import moment from 'moment'
import axios from 'axios'
import { url } from '../../url'
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { Select } from 'antd';
import 'antd/dist/antd.css'
import './user_crypto.css'

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, cryptoCoins }) {

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
        status: 'active'
    })
    const { Option } = Select;

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
                cryptoId: formData.cryptoId,
                logo: formData.logo,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                boughtAt: formData.boughtAt,
                quantity: (formData.investment / formData.boughtAt).toFixed(2),
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
                            <Label htmlFor="name">Bought At</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="boughtAt" placeholder="Crypto Coin Price (in rupees)" value={formData.boughtAt} onChange={handleChange} />
                            <div id="error_boughtAt" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Quantity</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="quantity" placeholder="Quantity" value={(formData.investment / formData.boughtAt).toFixed(2)} disabled />
                            <div id="error_quantity" className='form_error'></div>
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
                <button type="button" className="btn btn-success" onClick={postCryptoInvestment}>{newInvestment ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function UserStock() {

    const { data, isFetching } = useGetCryptosQuery(100);
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newInvestment, setNewInvestment] = useState(false)
    const [cryptoInvestment, setCryptoInvestment] = useState([])
    const [activeInvestment, setActiveInvestment] = useState([])
    const [completedInvestment, setCompletedInvestment] = useState([])
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
                        setCryptoInvestment(res.data.cryptoInvestment)
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

    function CryptoPrice({id}){
        
        return data?.data?.coins.map(coin=> 
            coin.uuid===id ? <>{parseFloat(coin.price).toFixed(2)}</>:<></>
        )
    }

    function CryptoChange({id, boughtAt, i}){
        const [priceChange, setPriceChange] = useState([])

        useEffect(()=>{
            let coinPrice=0
            data?.data?.coins.map(coin=>{
                if(id===coin.uuid){
                    coinPrice = coin.price
                }
            })
            setPriceChange((((coinPrice-boughtAt)/boughtAt)*100).toFixed(2))
        },[])
        
        return ( 
            <div className={'status ms-2'+(priceChange>0 ? ' profit':' loss')}>
                <FontAwesomeIcon icon={priceChange>0 ? faCaretUp : faCaretDown} />{Math.abs(priceChange)}%
            </div>
        )
    }

    function triggerEditModal(add) {
        setEditModalOpen(true)
        setNewInvestment(add)
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
            <EditModal editModalOpen={editModalOpen} token={token} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} cryptoCoins={data} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
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
            {activeInvestment.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-1">Logo</div>
                            <div className="col-2 data">Crypto Name</div>
                            <div className="col-2 data">Date</div>
                            <div className="col-2 data">Bought At</div>
                            <div className="col-1 data">Quantity</div>
                            <div className="col-2 data">Investment</div>
                            <div className="col-2 data">Current Value</div>
                        </div>
                        {activeInvestment.investments.map((invst, i) =>
                            <div className="row invest_data py-2" key={invst._id}>
                                <div className="col-1 data"><div className="symbol" style={{backgroundImage: `url(${invst.logo})`}} ></div></div>
                                <Link to={`/crypto_coin/${invst.cryptoId}`} className="col-2 data">{invst.name}</Link>
                                <div className="col-2 data">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                <div className="col-2 data">₹ {invst.boughtAt}</div>
                                <div className="col-1 data">{invst.quantity}</div>
                                <div className="col-2 data">₹ {invst.investment}</div>
                                <div className="col-2 data">
                                    <div className="value">₹ <CryptoPrice id={invst.cryptoId} /></div>
                                    <CryptoChange id={invst.cryptoId} boughtAt={invst.boughtAt} />
                                </div>
                                <div className="modify edit" onClick={() => triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="modify delete" onClick={() => triggerDeleteModal()}><FontAwesomeIcon icon={faTrashCan} /></div>
                            </div>)}
                    </div>
                    <div className="bottom_footer pt-3">
                        <span className="total_investment me-4">Total Invested: ₹{activeInvestment.investedAmount}</span>
                        <span className="total_currentcalue">Total Current Value: ₹2000</span>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
            <div className="row mt-5">
                <div className="col-12 heading">Completed Investments</div>
            </div>
            {completedInvestment?.investments?.length > 0 ?
                <div className="row mt-5 user_investment">
                    <div className="container-fluid">
                        <div className="row title">
                            <div className="col-1"></div>
                            <div className="col-2 data">Crypto Name</div>
                            <div className="col-2 data">Date</div>
                            <div className="col-2 data">Investment</div>
                            <div className="col-1 data">Quantity</div>
                            <div className="col-2 data">Closing Value</div>
                            <div className="col-2 data">Earning</div>
                        </div>
                        <div className="row invest_data py-2">
                            <div className="col-1 data"><div className="symbol" ></div></div>
                            <Link to='/stock_market/AAPL' className="col-2 data">Apple Inc.</Link>
                            <div className="col-2 data">16/05/2022</div>
                            <div className="col-2 data">₹1000</div>
                            <div className="col-1 data">1</div>
                            <div className="col-2 data">₹1100</div>
                            <div className="col-2 data"><span className='profit'>+ ₹100</span></div>
                            <div className="modify edit" onClick={() => triggerEditModal(false)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                            <div className="modify delete" onClick={() => triggerDeleteModal()}><FontAwesomeIcon icon={faTrashCan} /></div>
                        </div>
                    </div>
                    <div className="bottom_footer pt-3">
                        <span className="total_investment me-4">Total Invested: ₹2000</span>
                        <span className="total_currentcalue">Total Earned: ₹2000</span>
                    </div>
                </div> : <div className="no_data mt-3">No Data Available</div>}
        </div>
    )
}
