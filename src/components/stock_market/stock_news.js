import React, {useEffect} from 'react'
import CryptoNewsCard from '../cards/crypto_news';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'

export default function StockNews() {

    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory: 'Stock Market', count: 50 });

    useEffect(()=>{
        document.title = `CDFYP | Stock Market News`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('3').classList.add('active')
    },[])

    return (
        <div className="container crypto_market pt-5 pb-5">
            <div className="row d-flex align-items-center">
                <div className="col-6 heading">Latest Stock Market News</div>
            </div>
            <div className="row pt-4">
                <CryptoNewsCard isFetching={isNewsFetching} cryptoNews={cryptoNews} />
            </div>
        </div>
    )
}
