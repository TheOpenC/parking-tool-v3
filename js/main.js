import {CronJob} from 'cron';
import dotenv from 'dotenv';
dotenv.config();

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
            'Ocp-Apim-Subscription-Key': process.env.OCP_KEY
        }
        })

const weatherRequest = new Request(weatherUrl, {
        method: 'GET',
        headers: {
            'User-Agent': WEATHER_USER_AGENT
        }
})


async function getParking() {
    try {   
        const parkingResponse = await fetch(parkingRequest)
            console.log('parking request confirmed')
        const parkingData = await parkingResponse.json()
            console.log('parking response sent')
            return {
                details: parkingData.days[0].items[0].details,
                status: parkingData.days[0].items[0].status,
                type: parkingData.days[0].items[0].type,
                raw: parkingData
            }

        } catch(error) {
            console.log('Fetch Error', error)
        };
}


async function getWeather() {
    try {
        const   weatherData = await fetch(weatherRequest),
                result = await weatherData.json(),
                timeData = await fetch(clockUrl),
                rawTime = await timeData.json(),
                time = rawTime,
                weather = result.properties.periods[0].detailedForecast,
                weatherFormatted = weather.charAt(0).toLowerCase() + weather.slice(1)
                console.log('Weather Data recieved...')
            
            return {
            current: result.properties.periods[0].name,
            forecast: weatherFormatted,
            time: time.datetime
            }

    } catch(error){
        console.log('Fetch Error', error)
    }
}

async function formatTwoWeeksParking(){
        const   {raw} = await getParking(),
                twoWeeks = {}

                for (let i = 0; i < 14; i++) {
                    // this needs to be in the format of {day[i]: [details, status, type]} or {day[i]: {details: ,status: ,type: }}
                   ++Object.assign(twoWeeks, raw.days[i].items[0] )
                }
    }


async function combineAPIData() {
    const   {current, forecast, time} = await getWeather(),     // Get the weather data for 1 day
            {details, status, type}   = await getParking();     // Get the parking data for 1 day
                                                                // emoticons for weather
                                                                // emoticons for parking
        return `
        ${time} in NYC
        The ${type} Report

        Parking: ${details}
        Status: ${status}
        ${current}, ${forecast} 
        `
}

const runAPI = new CronJob('*/15 * * * * *', async () => {
	console.log('Cron initiated...') // true during callback execution
	try {
        const fullData = await combineAPIData();
        console.log(fullData)
    } catch (err) {
        console.error('[Cron], combineAPIData has failed:', err.message);
        if (err.cause) {
            console.error('cause: ', err.cause);
        }
    }
});


runAPI.start()


//     async function parkingData() {
           
//         const response = await fetch(parkingRequest)
//         const data = await response.json()
//         return data
//     }

// parkingData()