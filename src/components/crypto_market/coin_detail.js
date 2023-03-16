import React, { useState, useEffect } from 'react'
import HTMLReactParser from 'html-react-parser'
import LineChart from './line_chart';
import axios from 'axios'
import moment from 'moment'
import CryptoNewsCard from '../cards/crypto_news';
import PredictChart from './crypto_prediction_chart';
import { url } from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { Select } from 'antd';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useGetCryptoHistoryQuery, useGetCryptoDetailsQuery } from '../../services/cryptoApi'
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import './coin_detail.css'

const { Option } = Select;

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, coinName, coinId, coinLogo, editInvestment, currentPrice }) {

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
        status: ''
    })
    const [errors, setErrors] = useState(formData)

    useEffect(() => {
        setFormData({
            id: editInvestment?._id,
            logo: coinLogo,
            cryptoId: coinId,
            name: coinName,
            startDate: editInvestment?.startDate,
            endDate: editInvestment?.endDate,
            boughtAt: editInvestment?.boughtAt,
            quantity: editInvestment?.quantity,
            investment: editInvestment?.investment,
            closedAt: editInvestment?.closedAt,
            status: editInvestment?.status ? editInvestment?.status : 'active'
        })
    }, [editInvestment])

    function closeEditModal() {
        setEditModalOpen(false)
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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
        if (formData.boughtAt > 100000000 || formData.boughtAt < 1) {
            setErrors({ ...errors, boughtAt: 'Enter A Valid Stock Buy Price' })
            document.getElementById('error_boughtAt').classList.add('error')
            return false
        }
        if (formData.quantity === '') {
            setErrors({ ...errors, quantity: 'Enter The Number Of Stocks Bought' })
            document.getElementById('error_quantity').classList.add('error')
            return false
        }
        if (formData.quantity > 1000 || formData.quantity < 1) {
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
        if (duration > 0) {
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
            setErrors({ ...errors, closedAt: 'Enter Stock Sell Price' })
            document.getElementById('error_closedAt').classList.add('error')
            return false
        }
        if ((formData.closedAt > 100000000 || formData.closedAt < 1) && formData.status === 'completed') {
            setErrors({ ...errors, closedAt: 'Enter A Valid Stock Sell Price' })
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
            <ModalHeader toggle={closeEditModal}><img className='modal_logo me-2' src={formData.logo} />{newInvestment ? 'Add' : 'Edit'} Investment in {formData.name}</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col md={6} className='d-flex flex-column justify-content-center mb-3'>
                            <div className="details mt-1" style={{ fontSize: '18px' }}><span style={{ fontSize: '20px' }}>Selected Coin:</span> {formData.name}</div>
                            <div className="details mt-1" style={{ fontSize: '16px' }}><span style={{ fontSize: '18px' }}>Current Coin Price:</span> ₹ {currentPrice}</div>
                            <div id="error_name" className='form_error'></div>
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

function CurrentValue({ investments, currentPrice, customUnits }) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        let tempValue = 0
        investments?.map(invst => {
            tempValue += (invst.quantity * currentPrice)
        })
        setValue(tempValue.toFixed(2))
    }, [currentPrice])

    return <>{customUnits(value)}</>
}

function TotalChange({ activeInvestment, currentPrice, customUnits }) {
    const [percentageValue, setPercentageValue] = useState(0)
    const [currentValue, setCurrentValue] = useState(0)
    useEffect(() => {
        let tempValue = 0
        activeInvestment.investments?.map(invst => {
            tempValue += (invst.quantity * currentPrice)
        })
        setPercentageValue((tempValue - activeInvestment.investedAmount) * 100 / activeInvestment.investedAmount)
        setCurrentValue(tempValue)
    }, [currentPrice])

    return (
        <>
            Total {percentageValue > 0 ? 'Profit' : 'Loss'}: ₹
            <span className={percentageValue > 0 ? 'profit ms-1' : 'loss ms-1'}>
                {customUnits(Math.abs(currentValue - activeInvestment.investedAmount).toFixed(2))}
                <span className='changePercentage'><FontAwesomeIcon icon={percentageValue > 0 ? faCaretUp : faCaretDown} /> {customUnits(Math.abs(percentageValue).toFixed(2))} %</span>
            </span>
        </>
    )
}

export default function CryptoCoinDetail() {

    const [activeInvestment, setActiveInvestment] = useState([])
    const [completedInvestment, setCompletedInvestment] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newInvestment, setNewInvestment] = useState(false)
    const [editInvestment, setEditInvestment] = useState({})
    const [investmentDeleteId, setInvestmentDeleteId] = useState()
    const { coinId } = useParams()
    const [timeperiod, setTimeperiod] = useState('7d');
    const { data } = useGetCryptosQuery(100);
    const { data: coinDetails, isFetching } = useGetCryptoDetailsQuery(coinId)
    const { data: coinHistory, isFetching: isHistoryFetching } = useGetCryptoHistoryQuery({ coinId, timeperiod })
    const cryptoDetails = coinDetails?.data?.coin;
    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: cryptoDetails?.name, count: 9 });
    const [usdPrediction, setUSDPrediction] = useState()
    const [inrPrediction, setINRPrediction] = useState()
    const [inrValue, setInrValue] = useState(1)
    const time = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y'];
    let volume24h
    if (cryptoDetails) {
        volume24h = cryptoDetails['24hVolume']
    }
    const token = JSON.parse(localStorage.getItem("profile"))?.token

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

    function supplyUnits(num) {
        let unitNum = parseFloat(num)
        unitNum = unitNum?.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        return `${unitNum} ${cryptoDetails?.symbol}`
    }

    const stats = [
        { title: 'Price to USD', value: `₹ ${cryptoDetails?.price && customUnits(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `₹ ${volume24h && customUnits(volume24h)}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `₹ ${cryptoDetails?.marketCap && customUnits(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high', value: `₹ ${cryptoDetails?.allTimeHigh?.price && customUnits(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
    ];

    const genericStats = [
        { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: cryptoDetails?.supply?.total === null ? 'Unlimited Supply' : supplyUnits(cryptoDetails?.supply?.total), icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: supplyUnits(cryptoDetails?.supply?.circulating), icon: <ExclamationCircleOutlined /> },
    ];

    useEffect(() => {
        document.title = `CDFYP | Coin Detail`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/crypto/getCryptoSpecificInvestment/' + coinId, {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setActiveInvestment(res.data.activeInvestment)
                        setCompletedInvestment(res.data.completedInvestment)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    const options = {
                        method: 'GET',
                        url: 'https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency',
                        params: { have: 'USD', want: 'INR', amount: '1' },
                        headers: {
                            'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com',
                            'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
                        }
                    };
                    axios.request(options).then(function (response) {
                        setInrValue(response.data.new_amount);
                    }).catch(function (error) {
                        console.error(error);
                    });
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
        if(cryptoDetails){
        axios
            .get('https://stock-crypto-predicton.herokuapp.com/stocks_crypto/'+cryptoDetails.symbol+'-USD')
            .then((res) => {
                setUSDPrediction(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [cryptoDetails])


    useEffect(() => {
        let high = [], low = []
        if (usdPrediction) {
            for (let i = 0; i < 5; i++) {
                high.push(usdPrediction.High[i] * inrValue)
                low.push(usdPrediction.Low[i] * inrValue)
            }
            setINRPrediction({
                High: high,
                Low: low
            })
        }
    }, [usdPrediction, inrValue])

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
        <div className="container coin_details pt-5 pb-5">
            <EditModal editModalOpen={editModalOpen} token={token} coinLogo={cryptoDetails?.iconUrl} coinName={cryptoDetails?.name} coinId={cryptoDetails?.uuid} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} cryptoCoins={data} editInvestment={editInvestment} currentPrice={customUnits(cryptoDetails?.price)} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className={"heading_cont" + (isFetching ? ' loading' : '')}>
                <div className="image" style={{ backgroundImage: `url(${cryptoDetails?.iconUrl})` }}></div>
                <div className="heading ms-2">{isFetching ? '' : `${cryptoDetails?.name}`}</div>
            </div>
            <div className="mt-2 sub_heading">{isFetching ? '' : `${cryptoDetails?.name} live price in Indian Rupee (INR). View value statistics, market cap and supply.`}</div>
            <div className="timestamp_cont">
                <span className='me-2' style={{ fontSize: '18px' }}>Duration:</span>
                <Select defaultValue="7d" className="select-timeperiod" style={{ width: '100px' }} placeholder="Select Timeperiod" onChange={(value) => setTimeperiod(value)}>
                    {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>
            </div>
            <LineChart coinHistory={coinHistory} timeRange={timeperiod} coinColour={cryptoDetails?.color} currentPrice={customUnits(cryptoDetails?.price)} coinName={cryptoDetails?.name} timeperiod={timeperiod} isFetching={isFetching} isHistoryFetching={isHistoryFetching} />
            <div className="row mt-5">
                <div className="col-2"></div>
                <div className="col-8">
                    <PredictChart currentPrice={cryptoDetails?.price} coinColour={cryptoDetails?.color} inrValue={inrValue} prediction={inrPrediction} coinName={cryptoDetails?.name} isFetching={isFetching} />
                </div>
                <div className="col-2"></div>
            </div>
            <div className="row mt-5 user_investment py-4 px-2">
                <div className="col-12 heading mb-4">Active Investments in      {cryptoDetails?.name}</div>
                {activeInvestment.investments?.length > 0 ?
                    <>
                        <div className="col-12 container-fluid">
                            <div className="row title">
                                <div className="col-2 data">Crypto Name</div>
                                <div className="col-1 data">Buy Date</div>
                                <div className="col-2 data">Buy Price</div>
                                <div className="col-1 data">Quantity</div>
                                <div className="col-2 data">Invested</div>
                                <div className="col-2 data">Current Price</div>
                                <div className="col-2 data">Current Value</div>
                            </div>
                            {activeInvestment.investments.map((invst, i) =>
                                <div className="row invest_data py-2" key={invst._id}>
                                    <div className="col-2 data">
                                        <div className="symbol me-2" style={{ backgroundImage: `url(${invst.logo})` }} ></div>
                                        {invst.name}
                                    </div>
                                    <div className="col-1 data">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                    <div className="col-1 data">{invst.investedAmount > 100000 ? (invst.quantity).toFixed(4) : (invst.quantity).toFixed(2)}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                    <div className="col-2 data">₹ {customUnits(cryptoDetails?.price)}</div>
                                    <div className="col-2 data">
                                        <div className="value">₹ {customUnits(cryptoDetails?.price * invst.quantity)}</div>
                                        <div className={'status ms-2' + ((cryptoDetails?.price * invst.quantity) - invst.investment > 0 ? ' profit' : ' loss')}>
                                            <FontAwesomeIcon icon={(cryptoDetails?.price * invst.quantity) - invst.investment > 0 ? faCaretUp : faCaretDown} />
                                            {customUnits(Math.abs(((cryptoDetails?.price * invst.quantity) - invst.investment) * 100 / invst.investment).toFixed(2))}%
                                        </div>
                                    </div>
                                    <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                    <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                                </div>)}
                        </div>
                        <div className="bottom_footer pt-3">
                            <span className="total_investment">Total Invested: ₹ {customUnits(activeInvestment.investedAmount)}</span>
                            <span className="total_currentvalue mx-4">Total Current Value: ₹ <CurrentValue investments={activeInvestment.investments} currentPrice={cryptoDetails?.price} customUnits={customUnits} /></span>
                            <span className="change"><TotalChange activeInvestment={activeInvestment} currentPrice={cryptoDetails?.price} customUnits={customUnits} /></span>
                        </div>
                    </> : <div className="no_data mt-3">No Data Available</div>}
            </div>
            <div className="row mt-4 py-4 px-2 user_investment">
                <div className="col-12 heading mb-4">Completed Investments in {cryptoDetails?.name}</div>
                {completedInvestment?.investments?.length > 0 ?
                    <>
                        <div className="container-fluid">
                            <div className="row title">
                                <div className="col-2 data">Crypto Name</div>
                                <div className="col-1 data">Duration</div>
                                <div className="col-2 data">Buy Price</div>
                                <div className="col-1 data">Quantity</div>
                                <div className="col-2 data">Sell Price</div>
                                <div className="col-2 data">Invested</div>
                                <div className="col-2 data">Return Value</div>
                            </div>
                            {completedInvestment.investments.map((invst, i) =>
                                <div className="row invest_data py-2" key={invst._id}>
                                    <div className="col-2 data">
                                        <div className="symbol me-2" style={{ backgroundImage: `url(${invst.logo})` }} ></div>
                                        {invst.name}
                                    </div>
                                    <div className="col-1 data date">{moment(invst.startDate).format('DD/MM/YYYY')} <FontAwesomeIcon icon={faAngleDown} /> {moment(invst.endDate).format('DD/MM/YYYY')}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                    <div className="col-1 data">{invst.quantity.toFixed(2)}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.closedAt)}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                    <div className="col-2 data">
                                        <div className="value">₹ {customUnits((invst.quantity * invst.closedAt).toFixed(2))}</div>
                                        <div className={'status big ms-2' + ((invst.quantity * invst.closedAt) * 100 / invst.investment > 100 ? ' profit' : ' loss')}>
                                            <FontAwesomeIcon icon={(invst.quantity * invst.closedAt) * 100 / invst.investment > 100 ? faCaretUp : faCaretDown} />{Math.abs((100 - ((invst.quantity * invst.closedAt) * 100 / invst.investment)).toFixed(2))}%
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
                    </> : <div className="no_data mt-3">No Data Available</div>}
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-lg-6">
                    <div className={"details_cont" + (isFetching ? " loading" : "")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "" : `${cryptoDetails?.name} Value Statistics`}</div>
                            <div className="text">{isFetching ? "" : `An overview showing the statistics of ${cryptoDetails?.name}, such as the base and quote currency, the rank, and trading volume.`}</div>
                        </div>
                        {stats.map((stat, i) =>
                            <div className="row_details mt-2" key={i}>
                                {isFetching ?
                                    (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>) :
                                    (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                }
                                {isFetching ? (
                                    <div className="value"></div>
                                ) : (
                                    <div className="value">{stat.value}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className={"details_cont" + (isFetching ? " loading" : "")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "" : `Other Stats Info`}</div>
                            <div className="text">{isFetching ? "" : `An overview showing the statistics of ${cryptoDetails?.name}, such as the base and quote currency, the rank, and trading volume.`}</div>
                        </div>
                        {genericStats.map((stat, i) =>
                            <div className="row_details mt-2" key={i}>
                                {isFetching ?
                                    (<div className="title d-flex"><svg></svg><div className='ms-2'></div></div>) :
                                    (<div className="title d-flex">{stat.icon} <div className='ms-2'>{stat.title}</div></div>)
                                }
                                {isFetching ? (
                                    <div className="value"></div>
                                ) : (
                                    <div className="value">{stat.value}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-lg-6">
                    {isFetching ? (
                        <div className="about_crpto loading">
                            <div className="title"></div>
                            {[...Array(5)].map((j, i) =>
                                <div key={i}>
                                    <div className="heading"></div>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                    <div className="line half"></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="about_crpto">
                            <div className="title">What is {cryptoDetails?.name}?</div>
                            {isFetching ? (<></>) : HTMLReactParser(cryptoDetails.description)}
                        </div>
                    )
                    }
                </div>
                <div className="col-12 col-lg-6">
                    {isFetching ?
                        (
                            <div className="link_crpto loading">
                                <div className="title mb-3"></div>
                                {[...Array(5)].map((j, i) =>
                                    <div className="row_details" key={i}>
                                        <div className="title"></div>
                                        <div className="value"></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="link_crpto">
                                <div className="title mb-2">{cryptoDetails?.name} Links</div>
                                {cryptoDetails?.links?.map((link, i) =>
                                    <div className="row_details" key={i}>
                                        <div className="link_type">{link.type}</div>
                                        <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="row news_sec mt-4">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Latest {cryptoDetails?.name} News</div>
                </div>
                <CryptoNewsCard cryptoNews={cryptoNews} isFetching={isNewsFetching} />
            </div>
        </div>
    )
}
