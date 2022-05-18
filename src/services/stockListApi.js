import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const stockApiHeaders = {
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
    'X-RapidAPI-Key': '5ad5ec7c2dmsh0d498e7c9955227p159b35jsnbe88c2f296c1'
}

const params = { exchange: 'NASDAQ', format: 'json' }

const baseUrl = 'https://twelve-data1.p.rapidapi.com'

const createStockListRequest = (url) => ({ url, headers: stockApiHeaders, params })

export const stockListApi = createApi({
    reducerPath: 'stockListApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getStockList: builder.query({
            query: () => createStockListRequest('/stocks')
        })
    })
})

export const {
    useGetStockListQuery,
} = stockListApi;