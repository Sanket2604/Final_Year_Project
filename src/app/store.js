import { configureStore } from '@reduxjs/toolkit'
import { cryptoApi } from '../services/cryptoApi'
import { cryptoNewsApi } from '../services/cryptoNewsApi'
import { stockListApi } from '../services/stockListApi'
import { stockDetailApi } from '../services/stockDetailApi'
import { stockHistoryApi } from '../services/stockHistoryApi'

export default configureStore({
    reducer: {
        [cryptoApi.reducerPath]: cryptoApi.reducer,
        [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
        [stockListApi.reducerPath]: stockListApi.reducer,
        [stockDetailApi.reducerPath]: stockDetailApi.reducer,
        [stockHistoryApi.reducerPath]: stockHistoryApi.reducer,
    },
})