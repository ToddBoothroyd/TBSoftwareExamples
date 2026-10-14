import getAPIJson from "./services/api-service.js";
import getApiKeys from "./data/iss-api-keys.js";
import getSatelliteEndpoints from "./data/iss-api-endpoints.js";
import packageJson from '../package.json' with {type: 'json'};
import extractValue from "./utilities/extract-information.js";
import Satellite from './models/satellite.js';
import getSatelliteOutput from './utilities/satellite-info-formatter.js';
import satelliteEvents from './utilities/satellite-events.js';

//Settings from package.json
//Boolean - Should we output log statements
const shouldLogDebug = packageJson.customAppSettings?.logExtractsToDebug;
satelliteEvents.emit("generate-log", {
    debug: shouldLogDebug,
    message: "Debugging extracted values are active"
});
const shouldLogAPIDebug = packageJson.customAppSettings?.logAPIResponseToDebug;
satelliteEvents.emit("generate-log", {
    debug: shouldLogAPIDebug,
    message: "Debugging API responses are active"
});
//String - username for geonames api
const geoNamesUsername = packageJson.customAppSettings?.geoNamesUsername;


//Discover ISS Satellite ID
const satelliteIDResponse = await getAPIJson(getSatelliteEndpoints.get("WHERETHEISS-SATELLITES"));
satelliteEvents.emit("generate-log", {
    debug: shouldLogAPIDebug,
    message: `satelliteIDResponse ${JSON.stringify(satelliteIDResponse)}`
});
const extractedSatelliteID = extractValue(satelliteIDResponse, getApiKeys.get("satellite-id"));
satelliteEvents.emit("generate-log", {
    debug: shouldLogDebug,
    message: `Satellite ID for international space station is ${extractedSatelliteID}`
});

//Discover the latitude and longitude of ISS
const satelliteLocationUrl = getSatelliteEndpoints.get("WHERETHEISS-ISS")
.replace(getApiKeys.get("satellite-replace-id"), extractedSatelliteID);
const satelliteLocationResponse = await getAPIJson(satelliteLocationUrl);
satelliteEvents.emit("generate-log", {
    debug: shouldLogAPIDebug,
    message: `satelliteLocationResponse ${JSON.stringify(satelliteLocationResponse)}`
});
const extractLatitude = extractValue(satelliteLocationResponse, getApiKeys.get("satellite-latitude"));
const extractLongitude = extractValue(satelliteLocationResponse, getApiKeys.get("satellite-longitude"));
//visibility can be daylight or eclipsed
const extractEclipsed = extractValue(satelliteLocationResponse, getApiKeys.get("satellite-visibility"));
satelliteEvents.emit("generate-log", {
    debug: shouldLogDebug,
    message: `Latitude: ${extractLatitude}; Longitude: ${extractLongitude}; Eclipsed/Daylight: ${extractEclipsed}`
});

//Discover over which country the ISS is presently (may be over ocean)
const assembledCoordinateEndpoint = getSatelliteEndpoints.get("WHERETHEISS-ISS-GEO")
.replace(getApiKeys.get("satellite-replace-latitude"),extractLatitude)
.replace(getApiKeys.get("satellite-replace-longitude"),extractLongitude);
const satelliteDetailedLocationResponse = await getAPIJson(assembledCoordinateEndpoint);
satelliteEvents.emit("generate-log", {
    debug: shouldLogAPIDebug,
    message: `satelliteDetailedLocationResponse ${JSON.stringify(satelliteDetailedLocationResponse)}`
});
let extractLocation = extractValue(satelliteDetailedLocationResponse, getApiKeys.get("satellite-country-code"));
const extractMapUrl = extractValue(satelliteDetailedLocationResponse, getApiKeys.get("satellite-map-url"));
satelliteEvents.emit("generate-log", {
    debug: shouldLogDebug,
    message: `WhereIsISS Location: ${extractLocation}; Map Url: ${extractMapUrl}`
});

//If ISS is over the ocean, we can go to another API to get the ocean name
if(extractLocation === '' || extractLocation === '??') {
    const assembledAdditionalDetailedRequest = getSatelliteEndpoints.get("GEONAMES-GEO")
    .replace(getApiKeys.get("satellite-replace-latitude"),extractLatitude)
    .replace(getApiKeys.get("satellite-replace-longitude"),extractLongitude)
    .replace(getApiKeys.get("satellite-replace-username"),geoNamesUsername);
    
    const satelliteAdditionalDetailedLocationResponse = await getAPIJson(assembledAdditionalDetailedRequest);
    satelliteEvents.emit("generate-log", {
    debug: shouldLogAPIDebug,
    message: `satelliteAdditionalDetailedLocationResponse ${JSON.stringify(satelliteAdditionalDetailedLocationResponse)}`
});
    extractLocation = extractValue(satelliteAdditionalDetailedLocationResponse, getApiKeys.get("satellite-map-name"));
    satelliteEvents.emit("generate-log", {
    debug: shouldLogDebug,
    message: `Ocean Location: ${extractLocation}`
});
}

const satellite = new Satellite("International Space Station", extractLatitude, extractLongitude, extractLocation, extractMapUrl, extractEclipsed);
console.log(getSatelliteOutput(satellite));
