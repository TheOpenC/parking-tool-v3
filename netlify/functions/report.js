export async function handler(event, context) {
    // fake report for testing
    const reportText = `
    NYC Parking & Weather Tool
--------------------------
This is a test report coming from a Netlify Function.
Soon this will be your real parking + weather data.
    `.trim();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain'},
        body: reportText,
    };
}

