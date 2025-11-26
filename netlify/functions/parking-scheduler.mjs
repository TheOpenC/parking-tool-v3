import { getStore } from "@netlify/blobs";

export default async (req) => {
    const { next_run } = await req.json()

    console.log("Received event! Next invocation at:", next_run)
}

// tell netlify when to run 
export const config = {
    shedule: "0 6 * * *", 
}