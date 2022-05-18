import React, {useEffect, useState} from 'react'
import CryptoCard from '../cards/crypto_card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useGetCryptosQuery } from '../../services/cryptoApi';

export default function CryptoCurrencies() {

    const [searchTerm, setSearchTerm] = useState('')
    const { data: cryptosList, isFetching } = useGetCryptosQuery(100)
    const [cryptoCoins, setCryptoCoins] = useState(cryptosList?.data?.coins)

    useEffect(()=>{
        document.title = `CDFYP | Crypto Market`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
    },[])

    useEffect(()=>{
        const filtteredData = cryptosList?.data?.coins.filter((coin)=>coin.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setCryptoCoins(filtteredData)
    },[cryptosList, searchTerm])

    return (
        <div className="container crypto_market pt-5 pb-5">
            <div className="row d-flex align-items-center">
                <div className="col-6 heading">All Major Cyptocurrency</div>
                <div className="col-2"></div>
                <div className="col-4 search_cont">
                    <input type="text" placeholder="Search Cryptocurrency" name="search" onChange={(e) => setSearchTerm(e.target.value)}/>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />    
                </div>
            </div>
            <div className="row pt-4">
                <CryptoCard isFetching={isFetching} cryptoCoins={cryptoCoins} />
            </div>
        </div>
    )
}
