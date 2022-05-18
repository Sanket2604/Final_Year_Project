import React from 'react'
import moment from 'moment'
import './crypto_news.css'

export default function CryptoNewsCard(props) {

    const demoImage="https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"

    if(props.isFetching){
        return [...Array(12)].map((j,i)=>
            <div className="col-12 col-lg-4 p-1"  key={i}>
                <div className="crypto_news_card loading m-1 p-2">
                    <div className="top_row mb-2">
                        <div style={{width: "100%"}}>
                            <div className="title"></div>
                            <div className="title mt-1 mb-1"></div>
                            <div className="title"></div>
                        </div>
                        <div className="image"></div>
                    </div>
                    <div className="news_detail"></div>
                    <div className="news_detail mt-1 mb-1"></div>
                    <div className="news_detail mb-3"></div>
                    <div className="bottom_row">
                        <div className="company">
                            <div className="img"></div>
                            <div className="text"></div>
                        </div>
                        <div className="time"></div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return props.cryptoNews?.value?.map((news,i)=>
            <div className="col-12 col-lg-4 p-1" key={i}>
                <a href={news.url} target="_blank" className="crypto_news_card m-1 p-2">
                    <div className="top_row mb-2">
                        <div className="title">{news.name}</div>
                        <div className="image" style={{backgroundImage: `url(${news?.image?.thumbnail?.contentUrl || demoImage})`}}></div>
                    </div>
                    <div className="news_detail mb-3">
                        {news.description.length > 180 ? 
                            `${news.description.substring(0, 180)}....` 
                            : news.description  
                        }
                    </div>
                    <div className="bottom_row">
                        <div className="company">
                            <div className="img" style={{backgroundImage: `url(${news.provider[0]?.image?.thumbnail?.contentUrl || demoImage})`}}></div>
                            <div className="text">{news.provider[0].name}</div>
                        </div>
                        <div className="time">{moment(news.datePublished).startOf('ss').fromNow()}</div>
                    </div>
                </a>
            </div>
        )
    }
}
