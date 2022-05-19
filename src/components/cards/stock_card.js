import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../loader/loader';
import { Link } from 'react-router-dom'
import './stock_card.css'


export default function StockCard(props) {

    const [stockInView, setStocksInView] = useState([])
    const [calc, setCalc] = useState(false)

    useEffect(() => {
        if (props.stockList?.length > 0 && props.searchTerm?.length===0) {
            let temp = []
            for (let i = 0; i < 100; i++) {
                temp.push(props.stockList[i])
            }
            setStocksInView(stockInView.concat(temp))
            setCalc(true)
        }
        if(props.searchTerm?.length>0) setCalc(false)
    }, [props.stockList])

    function getMoreData() {
        if (props.stockList.length <= stockInView.length) return
        let temp = []
        for (let i = stockInView.length - 1; i < stockInView.length + 49; i++) {
            temp.push(props.stockList[i])
        }
        setStocksInView(stockInView.concat(temp))
    }

    function reset(){
        setCalc(true)
    }

    if (!props.stockList) {
        return (
            <div className="row mt-4">
                {[...Array(16)].map((j, i) =>
                    <div className="col-12 col-lg-3 p-0" key={i}>
                        <div className="stock_card loading m-1">
                            <div className="logo"></div>
                            <div className="name"></div>
                            <div className="symbol"></div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    let count=0
    if(props.recommendation){
        return(
            <div className="row mt-4 d-inline-margin">
                {props.stockList?.map((stock, i) =>
                    stock?.shortName && !/^\d+$/.test(stock?.shortName) && stock?.symbol && !/[^a-zA-Z]/.test(stock?.symbol) && count<=9 ? (
                        <div className="col-12 col-lg-3 p-0" key={i}>
                            <Link to={`/stock_market/${stock.symbol}`} className="stock_card m-1">
                                <img src={stock.logo} alt="" />
                                <div className="name">{stock.shortName}</div>
                                <div className="symbol">Ticker: {stock.symbol}</div>
                                <div className="hidden" style={{display: 'none'}}>{count+=1}</div>
                            </Link>
                        </div>
                    ) : (<></>)
                )}
            </div>
        )
    }
    if (props.searchTerm.length > 0 && props.stockList?.length > 0) {
        return (
            <div className="row mt-4 d-inline-margin">
                {props.stockList?.map((stock, i) =>
                    stock?.name && !/^\d+$/.test(stock?.name) && stock?.symbol && !/[^a-zA-Z]/.test(stock?.symbol) ? (
                        <div className="col-12 col-lg-3 p-0" key={i}>
                            <Link to={`/stock_market/${stock.symbol}`} className="stock_card m-1">
                                <img src={stock.logo} alt="" />
                                <div className="name">{stock.name}</div>
                                <div className="symbol">Ticker: {stock.symbol}</div>
                            </Link>
                        </div>
                    ) : (<></>)
                )}
            </div>
        )
    }
    if (calc && stockInView.length > 0) {
        return (
            <InfiniteScroll
                dataLength={stockInView.length}
                next={getMoreData}
                hasMore={props.stockList.length >= stockInView.length}
                loader={<Loader />}
                endMessage={
                    <div className="col-12 no_stock mt-4 mb-5">
                        All {props.stockList.length} stocks are loaded
                    </div>
                }
            >
                <div className="row mt-4 d-inline-margin">
                    {stockInView?.map((stock, i) =>
                        stock?.name && !/^\d+$/.test(stock?.name) && stock?.symbol && !/[^a-zA-Z]/.test(stock?.symbol) ? (
                            <div className="col-12 col-lg-3 p-0" key={i}>
                                <Link to={`/stock_market/${stock.symbol}`} className="stock_card m-1">
                                    <img src={stock.logo} alt="" />
                                    <div className="name">{stock.name}</div>
                                    <div className="symbol">Ticker: {stock.symbol}</div>
                                </Link>
                            </div>
                        ) : (<></>)
                    )}
                </div>
            </InfiniteScroll>
        )
    }
    return(
        <div className="row mt-4">
            <div className="col-12 no_stock mt-4" onClick={reset}>
                Can not find the searched stock... Click To Refresh
            </div>
        </div>
    )
}
