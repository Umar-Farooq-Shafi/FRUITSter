import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Prediction, Partial<{ classes: string; imageUrl: string }>>({
    query: ({ classes, imageUrl }) => ({
      url: `?classes=${classes}&api_key=tW67WEmjEnSeRqdpKp8v&image=${imageUrl}`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
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
