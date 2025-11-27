import { getStore } from '@netlify/blobs';


export default async function handler(req, context) {
    try {
        const store = getStore('parking-reports');
        const reportText = await store.get("latest-report.txt");

    if (!reportText) {
        return new Response("No report is availble yet. Try again later.", {
            status: 503,
            headers: { "Content-Type": 'text/plain; charset=utf-8'},
        });
    }

    return new Response(reportText, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
} catch (err) {
    console.err("Error in report function:", err);

    return new Response('Error loading report', {
        status: 500,
        headers: { "Content-Type": "text/plain; charset = utf-8"},
    });
}
}



