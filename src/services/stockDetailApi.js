import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const stockApiHeaders = {
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
}

const baseUrl = 'https://yh-finance.p.rapidapi.com'

const createStockDetailRequest = (url, symbol) => ({ url, headers: stockApiHeaders, params: {symbol: symbol, region: 'US'} })

export const stockDetailApi = createApi({
    reducerPath: 'stockDetailApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getStockDetail: builder.query({
            query: (symbol) => createStockDetailRequest('/stock/v2/get-profile', symbol)
        })
    })
})

export const {
    useGetStockDetailQuery
} = stockDetailApi;