import axios from 'axios'
import {
  IMapboxFeature,
  IMapboxResponse,
  IWeatherClean,
  IWeatherData,
} from 'src/interfaces'

export class Search {
  history = []

  constructor() {
    // TODO: read db if exists
  }

  get mapboxParams() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'en',
    }
  }

  get openWeatherParams() {
    return {
      appid: process.env.WEATHER_KEY,
      units: 'metric',
    }
  }

  async city(place: string): Promise<IMapboxFeature[]> {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.mapboxParams,
      })
      const res: IMapboxResponse = await instance.get('')
      return res.data.features.map(({ id, place_name, center }) => {
        return {
          id,
          place_name,
          center,
        }
      })
    } catch (error) {
      return []
    }
  }

  async weather(lat: string, lon: string): Promise<IWeatherClean> {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { ...this.openWeatherParams, lat, lon },
      })
      const res = await instance.get('')
      const { weather, main }: IWeatherData = res.data
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      }
    } catch (error) {
      return {
        desc: '',
        min: '',
        max: '',
        temp: '',
      }
    }
  }
}
