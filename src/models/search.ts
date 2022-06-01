import axios from 'axios'
import fs from 'fs'
import path from 'path'
import {
  IMapboxFeature,
  IMapboxResponse,
  IWeatherClean,
  IWeatherData,
} from 'src/interfaces'

export class Search {
  history: Array<string>
  dbPath = path.join(__dirname, '../db/history.json')

  constructor() {
    this.readDB()
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

  get capitalizedHistory() {
    return this.history.map((place) =>
      place.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    )
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

  addHistory(place: string) {
    if (this.history.includes(place.toLocaleLowerCase())) return
    this.history.unshift(place.toLocaleLowerCase())
    this.history.splice(0, 4)
    this.saveDB()
  }

  saveDB() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.history))
  }

  readDB() {
    if (fs.existsSync(this.dbPath)) {
      let historyDB = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
      this.history = JSON.parse(historyDB)
      return
    }
    this.history = []
  }
}
