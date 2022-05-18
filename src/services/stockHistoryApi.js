import moment from 'moment'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const stockApiHeaders = {
    'X-RapidAPI-Host': 'apistocks.p.rapidapi.com',
    'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
}

const baseUrl = 'https://apistocks.p.rapidapi.com'

const createStockHistoryInterdayRequest = (url, symbol) => ({ url: url, headers: stockApiHeaders, params: {symbol: symbol,  interval: '5min', maxreturn: '150'}})

const createStockHistoryRequest = (url, symbol, dateStart, dateEnd) => ({ url: url, headers: stockApiHeaders, params: {symbol: symbol, dateStart, dateEnd} })

export const stockHistoryApi = createApi({
    reducerPath: 'stockHistoryApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getStockHistory: builder.query({
            query: (symbol, timeperiod) => {
                let dateStart, dateEnd
                if(timeperiod==='24h'){
                    createStockHistoryInterdayRequest('/intraday', symbol)
                }
                else if(timeperiod==='14d'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(14, 'days').format('YYYY-MM-DD')
                    createStockHistoryRequest('/daily', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='30d'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(30, 'days').format('YYYY-MM-DD')
                    createStockHistoryRequest('/daily', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='6m'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(6, 'months').format('YYYY-MM-DD')
                    createStockHistoryRequest('/daily', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='1y'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(12, 'months').format('YYYY-MM-DD')
                    createStockHistoryRequest('/daily', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='5y'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(5, 'years').format('YYYY-MM-DD')
                    createStockHistoryRequest('/weekly', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='10y'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(10, 'years').format('YYYY-MM-DD')
                    createStockHistoryRequest('/monthly', symbol, dateStart, dateEnd)
                }
                else if(timeperiod==='alt'){
                    dateEnd=moment().format('YYYY-MM-DD')
                    dateStart=moment().subtract(100, 'years').format('YYYY-MM-DD')
                    createStockHistoryRequest('/monthly', symbol, dateStart, dateEnd)
                }
                else{
                    createStockHistoryInterdayRequest('/intraday', symbol)
                }
            }
        })
    })
})

export const {
    useGetStockHistoryQuery
} = stockHistoryApi;