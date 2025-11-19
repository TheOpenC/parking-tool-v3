import {CronJob} from 'cron';
import dotenv from 'dotenv';
dotenv.config();

let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY
const WEATHER_USER_AGENT = 'parking-tool-v3 (contact: ddudak@gmail.com)';

let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${+month + 1}%2F${day}%2F${year}` 
const weatherUrl = 'https://api.weather.gov/gridpoints/OKX/35,34/forecast'
const timeUrl = 'https://worldtimeapi.org/api/timezone/America/New_York' 

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
    const   parkingResponse = await fetch(parkingRequest),
            parkingJSON = await parkingResponse.json();
        
            return parkingJSON;    
}

async function getWeather() {
    const   weatherResponse = await fetch(weatherRequest),
            timeResponse = await fetch(timeUrl),
            weatherJSON = await weatherResponse.json(),
            timeJSON = await timeResponse.json()

            return {weatherJSON, timeJSON};
}

async function fetchAllData() {
    const   parkingJSON = await getParking(),
            {weatherJSON, timeJSON} = await getWeather();

            console.log('parking received, weather received. Returning results to formatters')
            return {parkingJSON, weatherJSON, timeJSON };
}

function formatParking(parkingJSON) {                    

                // twoWeeks = {}
                // console.log(`Parking: ${parking}`)

                // for (let i = 0; i < 14; i++) {
                //     // this needs to be in the format of {day[i]: [details, status, type]} or {day[i]: {details: ,status: ,type: }}
                //    ++Object.assign(twoWeeks, raw.days[i].items[0] )
                // }
        const   findSuspension = parkingJSON.days.find(day => day.items[0].status === 'SUSPENDED' ),
                nextSuspension = `${findSuspension.items[0].exceptionName} (${findSuspension.today_id})`

    return {
            details: parkingJSON.days[0].items[0].details,
            status: parkingJSON.days[0].items[0].status,
            tomorrow: parkingJSON.days[1].items[0].status,
            type: parkingJSON.days[0].items[0].type,
            raw: parkingJSON,
            nextSuspension: nextSuspension
            }
    }

function formatWeather(weatherJSON, timeJSON) {
    const   weather = weatherJSON,
            forecastUnformatted = weather.properties.periods[0].detailedForecast,
            forecast = forecastUnformatted.charAt(0).toLowerCase() + forecastUnformatted.slice(1);
            
    return {
            current: weather.properties.periods[0].name,
            forecast: forecast,
            time: timeJSON.datetime
            }
}





async function combineAPIData() {
    // Get all raw JSON
    const   {parkingJSON, weatherJSON, timeJSON} = await fetchAllData(),

    // JSON >> objects
            parking = formatParking(parkingJSON), 
            weather = formatWeather(weatherJSON, timeJSON),

            //divide fields from objects
            {details, status, type, tomorrow, nextSuspension, raw} = parking,
            {current, forecast, time} = weather
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']


        return `
        ${months[month - 1]} ${day}, ${year} in NYC
        The ${type} Report

        Parking: ${details} 
        Status: ${status}
        
        ${current}, ${forecast}

        Tommorrow, parking rules are: ${tomorrow}
        Next Suspension: ${nextSuspension} 
        `
}

const job = new CronJob('*/15 * * * * *', async () => {
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


job.start()


