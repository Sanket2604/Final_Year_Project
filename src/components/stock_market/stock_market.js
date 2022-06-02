import React, { useState, useEffect } from 'react'
import StockCard from '../cards/stock_card'
import { stock_links } from './stock_links'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useGetStockListQuery } from '../../services/stockListApi';
import './stock_market.css'

export default function StockMarket() {

    const [searchTerm, setSearchTerm] = useState('')
    const { data: stockData, isFetching } = useGetStockListQuery()
    const [stockList, setStockList] = useState()

    useEffect(() => {
        document.title = `CDFYP | Stock Market`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
    }, [])

    useEffect(() => {
        if (!isFetching) {
            let newData = stockData?.data.map((item) => 
                Object.assign({}, item, {logo: stock_links[item.symbol]?.[0], altlogo: stock_links[item.symbol]?.[1]})
            )
            setStockList(newData)
        }
    }, [stockData])


    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtteredData = stockData?.data?.filter((stock) => {
                return (
                    stock.name?.toLowerCase().includes(searchTerm.toLowerCase()) || stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })
            setStockList(filtteredData)
        }
    }, [searchTerm])

    return (
        <div className="container stock_market pt-5 pb-5">
            <div className="row d-flex align-items-center">
                <div className="col-6 heading">All Available Stocks</div>
                <div className="col-2"></div>
                <div className="col-4 search_cont">
                    <input type="text" placeholder="Search Stock Name Or Ticker Name" name="search" onChange={(e) => setSearchTerm(e.target.value)} />
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
            </div>
            <StockCard stockList={stockList} searchTerm={searchTerm} />
        </div>
    )
}
