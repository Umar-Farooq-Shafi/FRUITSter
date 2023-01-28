import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Prediction, string>({
        query: imageUrl => ({
            url: `?classes=Orange&api_key=tW67WEmjEnSeRqdpKp8v&image=${imageUrl}`,
            method: 'POST',
        }),
    })

export type Prediction = {
    time: number
    image: {
        width: number
        height: number
    }
    predictions: []
}
