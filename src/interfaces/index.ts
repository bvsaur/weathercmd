export interface IMapboxFeature {
  id: string
  place_name: string
  center: Array<string>
}

export interface IMapboxResponse {
  data: {
    query: Array<string>
    features: Array<IMapboxFeature>
  }
}

export interface IWeatherData {
  weather: [{ description: string }]
  main: {
    temp_min: string
    temp_max: string
    temp: string
  }
}

export interface IWeatherClean {
  desc: string
  min: string
  max: string
  temp: string
}
