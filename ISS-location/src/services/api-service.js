export default async function getAPIJson(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if(!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}