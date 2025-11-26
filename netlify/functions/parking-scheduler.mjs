import { getStore } from "@netlify/blobs";

export default async (req) => {
    const { next_run } = await req.json()

    // 1) get reference to a blob store
    const store = getStore('parking-reports')

    // 2) build a simple test report
    const now = new Date().toISOString();
    const reportText = [
        'ASipP test report',
        `Generated at: ${now}`,
        `Next scheduled run: ${next_run}`,
        "", 
    ].join("\n");

    // 3) write to the 'latest' key
    await store.set('latest', reportText);

    console.log(`Parking-scheduler: wrote report at time: ${now}. Next run @ `, next_run)
}

// tell netlify when to run 
export const config = {
    schedule: "@hourly", 
}