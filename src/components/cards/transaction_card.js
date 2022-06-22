import React, { useState } from 'react'
import moment from 'moment'
import { TransactionDeleteModal } from '../transaction/transaction_modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faIndianRupeeSign, faLayerGroup, faMagnifyingGlassChart, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import './transaction_card.css'

export default function TransactionCard(props) {

    const [modalOpen, setModalOpen] = useState(false)
    const [transDelete, setTransDelete] = useState()
    function triggerDeleteModal() {
        setModalOpen(!modalOpen)
        setTransDelete()
    }



    return (
        <>
            <TransactionDeleteModal modalOpen={modalOpen} setModalOpen={setModalOpen} transDelete={transDelete} />
            {props.transactions?.map(trans=>
                <div className="col-12 my-2" key={trans._id}>
                    <div className="transaction_card">
                        <div className="box d-flex align-items-center">
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <div className="content ms-2">
                                <div className="subtext">Category Name</div>
                                <div className="text">{trans.categoryName}</div>
                            </div>
                        </div>
                        <div className="box d-flex align-items-center">
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <div className="content ms-2">
                                <div className="subtext">Category Detail</div>
                                <div className="text">{trans.categoryDetail}</div>
                            </div>
                        </div>
                        <div className="box d-flex align-items-center">
                            <FontAwesomeIcon icon={faCalendarDay} />
                            <div className="content ms-2">
                                <div className="subtext">Transaction Date and Time</div>
                                <div className="text">{moment(trans.createdAt).format('DD/MM/YYYY hh:mm A')}</div>
                            </div>
                        </div>
                        <div className="box d-flex align-items-center">
                            <FontAwesomeIcon icon={faIndianRupeeSign} />
                            <div className="content ms-2">
                                <div className="subtext">Amount</div>
                                <div className="text">{trans.amount}</div>
                            </div>
                        </div>
                        <div className="box d-flex align-items-center">
                            <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            <div className="content ms-2">
                                <div className="subtext">Analysis</div>
                                <div className="text">{trans.analysis}</div>
                            </div>
                        </div>
                        <div className="modify edit" onClick={() => props.triggerEditModal(trans)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                        <div className="modify delete" onClick={() => triggerDeleteModal(trans._id)}><FontAwesomeIcon icon={faTrashCan} /></div>
                    </div>
                </div>
            )}
        </>
    )
}
