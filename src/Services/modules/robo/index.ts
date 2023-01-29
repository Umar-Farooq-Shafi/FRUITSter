import { api } from '@/Services/api'

import predict from './predict'

export const roboFlowApi = api.injectEndpoints({
    endpoints: build => ({
        predict: predict(build),
    }),
    overrideExisting: false,
})

export const { usePredictMutation } = roboFlowApi
