import React, {useEffect, useState} from 'react'
import CryptoNewsCard from '../cards/crypto_news';
import { Select } from 'antd';
import { useGetCryptosQuery } from '../../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../../services/cryptoNewsApi'
import 'antd/dist/antd.css'

export default function CryptoCurrenciesNews() {

    const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
    const { data } = useGetCryptosQuery(100);
    const { data: cryptoNews, isFetching: isNewsFetching } = useGetCryptoNewsQuery({ newsCategory, count: 50 });
    const { Option } = Select;

    useEffect(()=>{
        document.title = `CDFYP | Crypto News`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('4').classList.add('active')
    },[])

    return (
        <div className="container crypto_market pt-5 pb-5">
            <div className="row d-flex align-items-center">
                <div className="col-6 heading">Latest Cryptocurrency News</div>
                <div className="col-2"></div>
                <div className="col-4 mt-4">
                    <Select
                        showSearch
                        dropdownStyle={{ backgroundColor: 'var(--secondary)' }}
                        className="select-news"
                        placeholder="Select a Cryptocurrency"
                        optionFilterProp="children"
                        onChange={(value) => setNewsCategory(value)}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value="Cryptocurency">All Cryptocurrency</Option>
                        {data?.data?.coins?.map((currency,i) => <Option value={currency.name} key={i}>{currency.name}</Option>)}
                    </Select>
                </div>
            </div>
            <div className="row pt-4">
                <CryptoNewsCard isFetching={isNewsFetching} cryptoNews={cryptoNews} />
            </div>
        </div>
    )
}
