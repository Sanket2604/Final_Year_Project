import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HorizontalBarGraph from './horizontal_bar';
import TransactionCard from '../cards/transaction_card';
import { TransactionModal } from './transaction_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { url } from '../../url'
import { Link } from 'react-router-dom'
import './transaction_dashboard.css'

export default function TransactionDashboard() {

    const [modalOpen, setModalOpen] = useState(false)
    const [editTransaction, setEditTransaction] = useState(false)
    const [categoryData, setCategoryData] = useState()
    const [barGraphData, setBarGraphData] = useState()
    const [newTransactions, setNewTransactions] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Transaction Tracker`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/transactions/getTransactionsDashboard', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setCategoryData(res.data.categoryData)
                        setNewTransactions(res.data.newTransactions)
                        setBarGraphData({
                            expenditure: res.data.expenditure,
                            catTotal: res.data.catTotal,
                            label: res.data.label
                        })
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

    function triggerEditModal(add) {
        setModalOpen(!modalOpen)
        setEditTransaction(add)
    }

    return (
        <div className="trans_dashboard container py-5">
            <TransactionModal modalOpen={modalOpen} editTransaction={editTransaction} setModalOpen={setModalOpen} />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Transaction</div>
            </div>
            <div className="row">
                <div className="col-12 heading_cont mb-4">
                    <div className="heading">Expenses by Category</div>
                    <Link to="/category_details" className="btn_cont"><div className='btn_ btn_small'>Show Details</div></Link>
                </div>
                <div className="col-12 col-lg-6">
                    {categoryData?.length > 0 ?
                        <HorizontalBarGraph barGraphData={barGraphData} aspect={false} /> :
                        <div className="no_data mt-3">No Data Available</div>}
                </div>
                <div className="col-12 col-lg-6">
                    {categoryData?.length > 0 ?
                        <>
                            <div className="container-fluid invest_list heading_sec ms-1 mt-4 mt-lg-0">
                                <div className="row invest heading">
                                    <div className="col-4 data name">Category Name</div>
                                    <div className="col-3 data name">Expenditure</div>
                                    <div className="col-3 data total_money">Total</div>
                                    <div className="col-2 data percentage">Percentage</div>
                                </div>
                            </div>
                            <div className="container-fluid invest_list ms-1">
                                {categoryData?.map(cat =>
                                    <Link to={'/category_details/' + cat.category.name} className="row invest my-2" key={cat.category._id}>
                                        <div className="col-4 data name">{cat.category.name}</div>
                                        <div className="col-3 data spent">₹ {customUnits(cat.total)}</div>
                                        <div className="col-3 data total_money">₹ {customUnits(cat.category.total)}</div>
                                        <div className="col-2 data percentage">{customUnits((cat.total * 100 / cat.category.total).toFixed(2))}%</div>
                                    </Link>
                                )}
                            </div>
                        </> : <div className="no_data mt-3">No Data Available</div>
                    }
                </div>
            </div>
            <div className="row transaction_sec mt-5">
                <div className="col-12 heading_cont my-4">
                    <div className="heading">Last 10 Transactions</div>
                    {newTransactions?.length > 0 ? <Link to="/transaction_details" className="btn_cont"><div className='btn_ btn_small'>View All</div></Link>:<></>}
                </div>
                {newTransactions?.length > 0 ?
                    <TransactionCard triggerEditModal={triggerEditModal} transactions={newTransactions} /> :
                    <div className="no_data mt-3">No Data Available</div>
                }
            </div>
        </div>
    )
}
