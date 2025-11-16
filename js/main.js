import {CronJob} from 'cron';
import dotenv from 'dotenv';
dotenv.config();

// const runAPI = new CronJob('*/10 * * * * *', async () => {
// 	console.log('Cron Running') // true during callback execution
// 	try {
//         await dayOrNight();
//     } catch (err) {
//         console.error('[Cron] dayOrNight failed:', err.message);
//         if (err.cause) {
//             console.error('cause: ', err.cause);
//         }
//     }
// });

// runAPI.start()

// fetch(parkingUrl, {
//     method: 'GET',
//     // REQUEST HEADERS
//     headers: {
//         'Cache-Control': 'no-cache',
//         'Ocp-Apim-Subscription-Key': process.env.API_KEY}
//     })


//     .then(data => {
//         console.log(data)
//         console.log(data.text())
//     })
//     .catch(err => {
//         console.log(`error ${err}`)
//     })

let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY


const weatherUrl = 'https://api.weather.gov/gridpoints/OKX/35,34/forecast'
const clockUrl = 'https://worldtimeapi.org/api/timezone/America/New_York'

const WEATHER_USER_AGENT = 'parking-tool-v3 (contact: ddudak@gmail.com)';

let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${+month + 1}%2F${day}%2F${year}`  

const parkingRequest = new Request(parkingUrl, {
         method: 'GET',
//     // REQUEST HEADERS
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.API_KEY
        }
        }) 


async function getParking() {
    try{
        const parkingResponse = await fetch(parkingRequest)
        const parkingData = await parkingResponse.json()
        if (parkingResponse.status == 200) {
            return {
                parkingData
            }
            
        } else {
            console.log('Server Error', parkingResponse.error)
        }
    } catch(error) {
        console.log('Fetch Error', error)
    }
}

// async function getWeather() {
//     try {
//         const weatherData = await fetch(weatherUrl)
//         const result = await weatherData.json()
//         const timeData = await fetch(clockUrl)
//         const time = await timeData.json()
        
        
            
//             return {
//             current: result.properties.periods[0].name,
//             forecast: result.properties.periods[0].shortForecast,
//             time: time.datetime
//             }

    

//     } catch(error){
//         console.log('Fetch Error', error)
//     }
// }

// async function dayOrNight() {
//     const {current, forecast, time} = await getWeather();
//     const {parking} = await getParking();
//     console.log(`
//     ${current}, ${time} in NYC
//     Forecast: ${forecast}
//     Parking: ${parking}
//     `)
// }



    async function parkingData() {
           
        const response = await fetch(parkingRequest)
        const data = await response.json()
        return data
    }

parkingData()