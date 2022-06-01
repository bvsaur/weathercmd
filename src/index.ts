import 'dotenv/config'

import { listPlaces, mainMenu, pause, readInput } from './helpers/inquirer'
import { Search } from './models/search'

const main = async () => {
  let option = ''
  const search = new Search()

  do {
    console.clear()
    option = await mainMenu()

    switch (option) {
      case '1':
        const placetoSearch = await readInput('Type a city: ')
        const results = await search.city(placetoSearch)

        const selectedPlace = await listPlaces(results)
        if (selectedPlace === '0') continue

        const { place_name, center } = results.filter(
          ({ id }) => id === selectedPlace
        )[0]

        search.addHistory(place_name)

        const { desc, max, min, temp } = await search.weather(
          center[1],
          center[0]
        )

        console.log("\nCity's information\n".green)
        console.log('City:', `${place_name}`.yellow)
        console.log('Lat:', `${center[1]}`.yellow)
        console.log('Lon:', `${center[0]}`.yellow)
        console.log('Temperature:', `${temp}`.yellow)
        console.log('Min:', `${min}`.yellow)
        console.log('Max:', `${max}`.yellow)
        console.log('Weather Description:', `${desc}`.green)
        break

      case '2':
        console.log('\n')
        search.capitalizedHistory.forEach((place, idx) => {
          console.log(`${idx + 1}`.green, place)
        })
        console.log('\n')
    }

    if (option !== '0') await pause()
  } while (option !== '0')
}

main()
