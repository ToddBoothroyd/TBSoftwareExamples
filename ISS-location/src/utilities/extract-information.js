export default function extractValue(inputData, targetKey) {
    // Check if it's an array
    if (Array.isArray(inputData)) {
        for (const item of inputData) {
            // Recursively search each item inside the array
            const found = extractValue(item, targetKey);
            if (found !== undefined) return found;
        }
    } 
    // Check if it's a valid object
    else if (typeof inputData === 'object' && inputData !== null) {
        if (inputData.hasOwnProperty(targetKey)) {
            return inputData[targetKey];
        }
        // If the key isn't on the surface, search deeper
        for (const value of Object.values(inputData)) {
            const found = extractValue(value, targetKey);
            if (found !== undefined) return found;
        }
    }
    return undefined;
}