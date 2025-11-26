import { getStore } from '@netlify/blobs';


export default async () => {
    const store = getStore('parking-reports');

    //try to get the cached text report
    const cached = await store.get('latest', { type: 'text'});

    if (!cached) {
        //this happens if the scheduler hasn't successfully written yet
        return new Response(
            'ASipP report is not availble yet. Try again after the next scheduled run.',
            { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
    }
    
    return new Response(cached, {
        status: 200,
        headers: {"Content-Type": "text/plain; charset=utf-8" },
    });
}



