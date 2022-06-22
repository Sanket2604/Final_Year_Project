import React, { useEffect, useState } from 'react'
import TransactionCard from '../cards/transaction_card'
import axios from 'axios'
import { TransactionModal } from './transaction_modal';
import { url } from '../../url'
import { useParams } from 'react-router-dom'
import './specific_category.css'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SpecificCategory() {

    const params = useParams()
    const [transactionList, setTransactionList] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [expenditure, setExpenditure] = useState(0)
    const [category, setCategory] = useState(0)
    const [editTransaction, setEditTransaction] = useState(false)


    const token = JSON.parse(localStorage.getItem("profile"))?.token

    function triggerEditModal(add) {
        setModalOpen(!modalOpen)
        setEditTransaction(add)
    }

    useEffect(() => {
        document.title = `CDFYP | ${params.catName} Category`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/transactions/getCategoryTransaction/' + params.catName, {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setTransactionList(res.data.specificTransaction)
                        setExpenditure(res.data.expenditure)
                        setCategory(res.data.specificCategory)
                        console.log(res.data)
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

    return (
        <div className="container specific_cat py-5">
            <TransactionModal modalOpen={modalOpen} editTransaction={editTransaction} setModalOpen={setModalOpen} />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Transaction</div>
            </div>
            <div className="row">
                <div className="heading col-12">{params.catName} Category Details</div>
            </div>
            <div className="row">
                <div className="col-12 data_sec mt-4 mb-3">
                    <div className="status_bar">
                        <div className="progress_bar" style={{ width: `${expenditure*100/category?.total}%` }}>
                            <div className={"percentage"+(expenditure*100/category?.total < 15 ? ' outside' : '')}>{(expenditure*100/category?.total).toFixed(2)}%</div>
                        </div>
                    </div>
                    <div className="amount">₹{expenditure} / ₹{category?.total}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 heading mb-2">All Transactions of {params.catName} Category</div>
                {transactionList?.length > 0 ?
                    <TransactionCard triggerEditModal={triggerEditModal} transactions={transactionList} /> :
                    <div className="no_data mt-3">No Data Available</div>
                }
            </div>
        </div>
    )
}
