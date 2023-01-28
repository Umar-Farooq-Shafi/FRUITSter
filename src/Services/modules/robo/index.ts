import { api } from '@/Services/api'

import predictApple from './predictApple'
import predictOrange from './predictOrange'

export const roboFlowApi = api.injectEndpoints({
    endpoints: build => ({
        predictApple: predictApple(build),
        predictOrange: predictOrange(build),
    }),
    overrideExisting: false,
})

export const { usePredictAppleMutation, usePredictOrangeMutation } = roboFlowApi
