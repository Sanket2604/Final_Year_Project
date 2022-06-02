import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faIndianRupeeSign, faLayerGroup, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons'
import './transaction_card.css'

export default function TransactionCard() {
    return (
        <div className="col-12 my-2">
            <div className="transaction_card">
                <div className="box d-flex align-items-center">
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <div className="content ms-2">
                        <div className="subtext">Category Name</div>
                        <div className="text">Category 1</div>
                    </div>
                </div>
                <div className="box d-flex align-items-center">
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <div className="content ms-2">
                        <div className="subtext">Category Detail</div>
                        <div className="text">Type of Category</div>
                    </div>
                </div>
                <div className="box d-flex align-items-center">
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <div className="content ms-2">
                        <div className="subtext">Transaction Date and Time</div>
                        <div className="text">2nd Jan 2022 20:38</div>
                    </div>
                </div>
                <div className="box d-flex align-items-center">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                    <div className="content ms-2">
                        <div className="subtext">Amount</div>
                        <div className="text">1000</div>
                    </div>
                </div>
                <div className="box d-flex align-items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                    <div className="content ms-2">
                        <div className="subtext">Analysis</div>
                        <div className="text">Over Spent / In Budget</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
