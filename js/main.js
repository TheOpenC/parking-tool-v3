import {CronJob} from 'cron';
import dotenv from 'dotenv';
dotenv.config();

let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY

let endMonth = String(today.getMonth()+3).padStart(2, '0');
    // if (endMonth == 10)
let endDay = String(today.getDate()).padStart(2, '0');
let endYear = String(today.getFullYear()); YYYY
const WEATHER_USER_AGENT = 'parking-tool-v3 (contact: ddudak@gmail.com)';

let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${+month + 1}%2F${day}%2F${year}` 
const weatherUrl = 'https://api.weather.gov/gridpoints/OKX/35,34/forecast'
// const timeUrl = 'https://worldtimeapi.org/api/timezone/America/New_York' 

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
            weatherJSON = await weatherResponse.json()
            return {weatherJSON};
}

async function fetchAllData() {
    const   parkingJSON = await getParking(),
            {weatherJSON} = await getWeather();

            console.log('parking received, weather received. Returning results to formatters')
            return {parkingJSON, weatherJSON};
}

// use this to format all the parking dates
function dateFormatter(date) {
    const   year = date.slice(0,4),
            month = date.slice(4,6),
            day = date.slice(6,8),
            result = `${year}-${month}-${day}`
            return new Date(result).toDateString()
}

function formatParking(parkingJSON) {                    

        let suspension = null;
        const  findSuspension = parkingJSON.days.find(day => day.items[0].status === 'SUSPENDED' );
            
            if (findSuspension) {
                const formatted = dateFormatter(findSuspension.today_id);
                // const   date = findSuspension.today_id,
                //         year = date.slice(0,4),
                //         month = date.slice(4,6),
                //         day = date.slice(6,8),

                //         result = `${year}-${month}-${day}`;
                //         // more readable date format 
                // const   formatted = new Date(result);
                        
                const suspension = {
                    day: formatted,
                    status: findSuspension.items[0].status,
                    reason: findSuspension.items[0].exceptionName,
                };
            }

    return {
            details: parkingJSON.days[0].items[0].details,
            status: parkingJSON.days[0].items[0].status,
            tomorrow: parkingJSON.days[1].items[0].status,
            type: parkingJSON.days[0].items[0].type,
            suspension: suspension
            }
    
    
}



function formatWeather(weatherJSON) {
    const   weather = weatherJSON,
            forecastUnformatted = weather.properties.periods[0].detailedForecast,
            forecast = forecastUnformatted.charAt(0).toLowerCase() + forecastUnformatted.slice(1);
            
    return {
            current: weather.properties.periods[0].name,
            forecast: forecast
            }
}





async function combineAPIData() {
    // Get all raw JSON
    const   {parkingJSON, weatherJSON} = await fetchAllData(),

    // JSON >> objects
            parking = formatParking(parkingJSON), 
            weather = formatWeather(weatherJSON),

            //divide fields from objects
            {details, status, type, tomorrow, suspension} = parking,
            {current, forecast} = weather
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']


        return `
        ${months[month - 1]} ${day}, ${year} in NYC
        Today: ${today}
        The ${type} Report

        Parking: ${details} 
        Status: ${status}
        
        ${current}, ${forecast}

        Tommorrow, parking rules are: ${tomorrow}

        Next Suspension Date:
                      
        ${suspension.day}
        Status: ${suspension.status}
        Reason: ${suspension.reason} 
        `
}

const job = new CronJob('*/5 * * * * *', async () => {
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


