import React, { useEffect, useState } from 'react'
import TransactionCard from '../cards/transaction_card'
import axios from 'axios'
import { url } from '../../url'
import { TransactionModal } from './transaction_modal';
import { Form, Row, Label, Input, Col } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './transaction_details.css'

export default function TransactionDetails() {

    const [modalOpen, setModalOpen] = useState(false)
    const [editTransaction, setEditTransaction] = useState(false)
    const [transactionHistory, setTransactionHistory] = useState()

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
                    .get(url + '/transactions/getTransactionHistory', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setTransactionHistory(res.data)
                        if(res.data.length<1){
                            window.location.replace("/transaction_dashboard")
                        }
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

    function triggerEditModal(add) {
        setModalOpen(!modalOpen)
        setEditTransaction(add)
    }


    return (
        <div className="container trans_details py-5">
            <TransactionModal modalOpen={modalOpen} editTransaction={editTransaction} setModalOpen={setModalOpen} />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Transaction</div>
            </div>
            {transactionHistory?.map(data =>
                <div className="row mt-4">
                    <div className="col-12 heading mb-2">All Transactions on {data.date}</div>
                    <TransactionCard transactions={data.transactions} triggerEditModal={triggerEditModal} />
                </div>
            )}

        </div>
    )
}
