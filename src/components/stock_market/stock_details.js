import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import CryptoNewsCard from '../cards/crypto_news';
import LineChart from './line_chart';
import BarChartVolume from './bar_chart_volume';
import { url } from '../../url'
import { Link } from 'react-router-dom'
import { useGetStockListQuery } from '../../services/stockListApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faPenToSquare, faTrashCan, faPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { stock_links } from './stock_links'
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
import { useGetStockDetailQuery } from '../../services/stockDetailApi';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import './stock_details.css'

const { Option } = Select;

function EditModal({ editModalOpen, setEditModalOpen, newInvestment, token, stockData, editInvestment }) {

    const [formData, setFormData] = useState({
        id: editInvestment?._id ? editInvestment._id : '',
        logo: editInvestment?.logo ? editInvestment.logo : '',
        symbol: editInvestment?.symbol ? editInvestment.symbol : '',
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

    useEffect(() => {
        setFormData({
            id: editInvestment?._id,
            logo: editInvestment?.logo,
            symbol: editInvestment?.symbol,
            name: editInvestment?.name,
            startDate: editInvestment?.startDate,
            endDate: editInvestment?.endDate,
            boughtAt: editInvestment?.boughtAt,
            quantity: editInvestment?.quantity,
            investment: editInvestment?.investment,
            closedAt: editInvestment?.closedAt,
            status: editInvestment?.status ? editInvestment.status : 'active'
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

    function postStockInvestment() {
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
        console.log(formData)
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
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Select Stock</Label>
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
                            <div className="details mt-1"><span style={{ fontSize: '18px' }}>Selected Stock:</span> {formData.name}</div>
                            <div id="error_name" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Investment Amount</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="investment" placeholder="Investment Amount (in rupees)" value={(formData.boughtAt * formData.quantity).toFixed(2)} disabled />
                            <div id="error_investment" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Buy Price</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="boughtAt" placeholder="Stock Price (in rupees)" value={formData.boughtAt} onChange={handleChange} />
                            <div id="error_boughtAt" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Quantity</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
                            <div id="error_quantity" className='form_error'></div>
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
                                <Label htmlFor="name">Sell Price</Label>
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
                <button type="button" className="btn btn-success" onClick={formData.id ? putStockInvestment : postStockInvestment}>{newInvestment ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function StockDetails() {

    const { data: stockData } = useGetStockListQuery()
    const { stockSymbol } = useParams()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newInvestment, setNewInvestment] = useState(false)
    const [activeInvestment, setActiveInvestment] = useState([])
    const [completedInvestment, setCompletedInvestment] = useState([])
    const [editInvestment, setEditInvestment] = useState({})
    const [investmentDeleteId, setInvestmentDeleteId] = useState()
    const [timeperiod, setTimeperiod] = useState('24h');
    const [inrValue, setInrValue] = useState(1)
    const [stockHistory, setStockHistory] = useState();
    const { data: stockDetail, isFetching } = useGetStockDetailQuery(stockSymbol)
    const { data: stockNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: stockSymbol + ' company', count: 9 })
    const [currentPrice, setCurrentPrice] = useState()
    const [render, setRender] = useState()

    const token = JSON.parse(localStorage.getItem("profile"))?.token

    const time = ['24h', '60d', '6m', '1y', '5y', '10y', 'Max'];

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
    const technicalPointers = [
        { title: 'Share Price', value: stockDetail?.price?.regularMarketPrice.raw * inrValue, icon: <FundOutlined /> },
        { title: 'Market Cap', value: stockDetail?.summaryDetail?.marketCap.raw ? ('₹ ' + customUnits(stockDetail?.summaryDetail?.marketCap.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: '52 Week High', value: stockDetail?.summaryDetail?.fiftyTwoWeekHigh.raw ? ('₹ ' + customUnits(stockDetail?.summaryDetail?.fiftyTwoWeekHigh.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: '52 Week Low', value: stockDetail?.summaryDetail?.fiftyTwoWeekLow.raw ? ('₹ ' + customUnits(stockDetail?.summaryDetail?.fiftyTwoWeekLow.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Total Volume', value: stockDetail?.summaryDetail?.volume.raw ? customUnits(stockDetail?.summaryDetail?.volume.raw) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Avg. 10 Day Daily Volume', value: stockDetail?.price?.averageDailyVolume10Day.raw ? customUnits(stockDetail?.price?.averageDailyVolume10Day.raw) : 'NA', icon: <MoneyCollectOutlined /> },
        { title: 'Avg. 3 Month Daily Volume', value: stockDetail?.price?.averageDailyVolume3Month.raw ? customUnits(stockDetail?.price?.averageDailyVolume3Month.raw) : 'NA', icon: <ExclamationCircleOutlined /> },
    ]

    const otherStats = [
        { title: 'Sector Type', value: stockDetail?.assetProfile?.sector ? stockDetail?.assetProfile?.sector : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Industry', value: stockDetail?.assetProfile?.industry ? stockDetail?.assetProfile?.industry : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Exchange Name', value: stockDetail?.price?.exchangeName ? stockDetail?.price?.exchangeName : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue High', value: stockDetail?.calendarEvents?.earnings?.revenueHigh.raw ? ('₹ ' + customUnits(stockDetail?.calendarEvents?.earnings?.revenueHigh.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue Low', value: stockDetail?.calendarEvents?.earnings?.revenueLow.raw ? ('₹ ' + customUnits(stockDetail?.calendarEvents?.earnings?.revenueLow.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Revenue Avg.', value: stockDetail?.calendarEvents?.earnings?.revenueAverage.raw ? ('₹ ' + customUnits(stockDetail?.calendarEvents?.earnings?.revenueAverage.raw * inrValue)) : 'NA', icon: <ExclamationCircleOutlined /> },
        { title: 'Dividend (Yield)', value: stockDetail?.summaryDetail?.dividendRate.raw ? (`${stockDetail?.summaryDetail?.dividendRate.raw} (${(stockDetail?.summaryDetail?.dividendYield.raw * 100).toFixed(2)}%)`) : 'NA', icon: <ExclamationCircleOutlined /> }
    ]

    useEffect(() => {
        document.title = `CDFYP | Stock Name Details`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
        getStockHistory('24h')
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
        setRender(0)
        if (token) {
            try {
                axios
                    .get(url + '/stock/getStockSpecificInvestment/'+stockSymbol, {
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

    function getStockHistory(timeperiod) {
        setTimeperiod(timeperiod)
        let dateStart, dateEnd
        let params
        let url
        if (timeperiod === '24h') {
            params = { symbol: stockSymbol, interval: '5min', maxreturn: '150' }
            url = '/intraday'
        }
        else if (timeperiod === '14d') {
            dateStart = moment().subtract(14, 'days').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '60d') {
            dateStart = moment().subtract(2, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '6m') {
            dateStart = moment().subtract(6, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '1y') {
            dateStart = moment().subtract(12, 'months').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/daily'
        }
        else if (timeperiod === '5y') {
            dateStart = moment().subtract(5, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/weekly'
        }
        else if (timeperiod === '10y') {
            dateStart = moment().subtract(10, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/monthly'
        }
        else if (timeperiod === 'Max') {
            dateStart = moment().subtract(100, 'years').format('YYYY-MM-DD')
            dateEnd = moment().format('YYYY-MM-DD')
            params = { symbol: stockSymbol, dateStart: dateStart, dateEnd: dateEnd }
            url = '/monthly'
        }
        const options = {
            method: 'GET',
            url: 'https://apistocks.p.rapidapi.com' + url,
            params,
            headers: {
                'X-RapidAPI-Host': 'apistocks.p.rapidapi.com',
                'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
            }
        };
        axios.request(options).then((response) => {
            if (!render) {
                setCurrentPrice(parseFloat(response.data?.Results[response.data?.Results.length - 1].Open).toFixed(2))
            }
            setRender(1)
            setStockHistory(response.data)
        }).catch(function (error) {
            console.error(error);
        });
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
        <div className="container stock_detail pt-5 pb-5">
            <EditModal editModalOpen={editModalOpen} token={token} newInvestment={newInvestment} setEditModalOpen={setEditModalOpen} stockData={stockData} editInvestment={editInvestment} />
            <DeleteModal />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Investment</div>
            </div>
            <div className={"heading_cont" + (isFetching ? ' loading' : '')}>
                {isFetching ?
                    <div className="image"></div> :
                    <img src={stock_links[stockDetail?.symbol][0]} alt='Error'></img>
                }
                <div className="heading ms-2">{isFetching ? '' : `${stockDetail?.quoteType?.shortName}`}</div>
            </div>
            <div className="symbol"></div>
            <div className="mt-2 sub_heading">{isFetching ? '' : `Symbol: ${stockDetail?.symbol}`}</div>
            <div className="timestamp_cont d-flex justify-content-end align-items-center">
                <span className='me-2' style={{ fontSize: '18px' }}>Timestamp:</span>
                <Select defaultValue="24h" className="select-timeperiod" style={{ width: '100px' }} placeholder="Select Timeperiod" onChange={(value) => getStockHistory(value)}>
                    {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>
            </div>
            <LineChart stockHistory={stockHistory} stockName={stockDetail?.quoteType?.shortName} timeperiod={timeperiod} isFetching={isFetching} inrValue={inrValue} />
            <BarChartVolume stockHistory={stockHistory} stockName={stockDetail?.quoteType?.shortName} timeperiod={timeperiod} isFetching={isFetching} />
            <div className="row mt-5 user_investment py-3">
                <div className="col-12 heading mb-4">Active Investments in {stockDetail?.quoteType?.shortName}</div>
                {activeInvestment?.investments?.length > 0 ?
                    <>
                        <div className="col-12 container-fluid">
                            <div className="row title">
                                <div className="col-2 data">Stock Name</div>
                                <div className="col-1 data">Date</div>
                                <div className="col-2 data">Buying Price</div>
                                <div className="col-1 data">Quantity</div>
                                <div className="col-2 data">Current Price</div>
                                <div className="col-2 data">Investment</div>
                                <div className="col-2 data">Cuurent Value</div>
                            </div>
                            {activeInvestment.investments.map((invst, i) =>
                                <div className="row invest_data py-2" key={invst._id}>
                                    <div className="col-2 data name_sec" style={{ fontSize: '16px' }}>
                                        <div className="name">{invst.name}</div>
                                        <div className="ticker" style={{ fontSize: '12px' }}>{invst.symbol}</div>
                                    </div>
                                    <div className="col-1 data">{moment(invst.startDate).format('DD/MM/YYYY')}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.boughtAt)}</div>
                                    <div className="col-1 data">{invst.quantity}</div>
                                    <div className="col-2 data">₹ {customUnits(currentPrice * inrValue)}</div>
                                    <div className="col-2 data">₹ {customUnits(invst.investment)}</div>
                                    <div className="col-2 data">
                                        <div className="value">₹ {customUnits((currentPrice * inrValue * invst.quantity).toFixed(2))}</div>
                                        <div className={'status big ms-2' + ((currentPrice * inrValue * invst.quantity) / invst.investment > 1 ? ' profit' : ' loss')}>
                                            <FontAwesomeIcon icon={(currentPrice * inrValue * invst.quantity) / invst.investment > 1 ? faCaretUp : faCaretDown} />{Math.abs((100 - ((currentPrice * inrValue * invst.quantity) * 100 / invst.investment)).toFixed(2))}%
                                        </div>
                                    </div>
                                    <div className="modify edit" onClick={() => triggerEditModal(false, invst)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                    <div className="modify delete" onClick={() => triggerDeleteModal(invst._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                                </div>)}
                        </div>
                        <div className="bottom_footer pt-3">
                            <div className="total_investment">Total Invested: ₹ {customUnits(activeInvestment.investedAmount)}</div>
                            <div className="total_return mx-4">Return Of Investment: ₹ {customUnits((activeInvestment.totalQuantity*currentPrice*inrValue).toFixed(2))}</div>
                            <div className="change">
                                <span className='me-1'>Total Earned: ₹ </span>
                                <span className={(activeInvestment.totalQuantity*currentPrice*inrValue) - activeInvestment.investedAmount > 0 ? 'profit' : 'loss'}>
                                    {customUnits(Math.abs((activeInvestment.totalQuantity*currentPrice*inrValue) - activeInvestment.investedAmount).toFixed(2))}
                                    <span className='changePercentage'>
                                        <FontAwesomeIcon icon={(activeInvestment.totalQuantity*currentPrice*inrValue) - activeInvestment.investedAmount > 0 ? faCaretUp : faCaretDown} /> {customUnits(Math.abs((((activeInvestment.totalQuantity*currentPrice*inrValue) - activeInvestment.investedAmount) * 100 / activeInvestment.investedAmount).toFixed(2)))} %
                                    </span>
                                </span>
                            </div>
                        </div>
                    </>
                    : <div className="no_data mt-3">No Data Available</div>}
            </div>
            <div className="row mt-5 user_investment py-3">
                <div className="col-12 heading mb-4">Completed Investments in {stockDetail?.quoteType?.shortName}</div>
                {completedInvestment?.investments?.length > 0 ?
                    <>
                        <div className="col-12 container-fluid">
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
                            {completedInvestment.investments.map((invst, i) =>
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
                    </>
                    : <div className="no_data mt-3">No Data Available</div>}
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-lg-6">
                    <div className={"details_cont" + (isFetching ? " loading" : "")}>
                        <div className="row_heading">
                            <div className="title">{isFetching ? "" : `${stockDetail?.quoteType?.shortName} Value Statistics`}</div>
                        </div>
                        {technicalPointers.map((stat, i) =>
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
                        </div>
                        {otherStats.map((stat, i) =>
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
            <div className="row stock_info mt-5">
                <div className="heading">About {stockDetail?.quoteType?.shortName}</div>
                <div className="company_details">
                    <div className="detail mt-3"><span>Summary:</span><br />{stockDetail?.assetProfile?.longBusinessSummary}</div>
                    <div className="detail mt-2"><span>Address: </span>{stockDetail?.assetProfile?.address1}, {stockDetail?.assetProfile?.address2 ? stockDetail?.assetProfile?.address2 + ', ' : ''}{stockDetail?.assetProfile?.city} - {stockDetail?.assetProfile?.zip}, {stockDetail?.assetProfile?.state}, {stockDetail?.assetProfile?.country} </div>
                    <div className="detail mt-2"><span>Phone: </span>{stockDetail?.assetProfile?.phone}</div>
                    <div className="detail mt-2"><span>Website: </span><a href={stockDetail?.assetProfile?.website} target='_blank'>{stockDetail?.assetProfile?.website}</a></div>
                    <div className="detail mt-2"><span>Number Of Full Time Employee: </span>{stockDetail?.assetProfile?.fullTimeEmployees ? stockDetail?.assetProfile?.fullTimeEmployees : 'Data Not Available'}</div>
                </div>
            </div>
            {stockDetail?.assetProfile?.companyOfficers?.length > 0 ?
                (
                    <div className="row stock_info mt-5">
                        <div className="heading">Top Executives of {stockDetail?.quoteType?.shortName}</div>
                        <div className="company_details container-fluid my-4">
                            <div className="row">
                                <div className="col-2"></div>
                                <div className="col-3 title noboder">Name</div>
                                <div className="col-5 title">Title</div>
                            </div>
                            {stockDetail?.assetProfile?.companyOfficers?.map((person, i) =>
                                <div className="row" key={i}>
                                    <div className="col-2"></div>
                                    <div className="col-3 details noboder">{person?.name}</div>
                                    <div className="col-5 details">{person?.title}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (<></>)
            }
            {stockNews?.value?.length > 0 ?
                (<div className="row stock_info mt-5">
                    <div className="heading mb-4">Recent News of {stockDetail?.quoteType?.shortName}</div>
                    <CryptoNewsCard isFetching={isNewsFetching} cryptoNews={stockNews} />
                </div>) : (<></>)
            }
            <div className="source_name">Source: {stockDetail?.price?.quoteSourceName}</div>
        </div>
    )
}
