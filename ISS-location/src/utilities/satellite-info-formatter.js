import Satellite from '../models/satellite.js';

function getSatelliteOutput(satellite) {
    return `The international space station is currently at latitude ${satellite.latitude} and longitude ${satellite.longitude}. This location is over ${satellite.location}. ${satellite.getVisibilityAsString()}. One can navigate to ${satellite.mapLocation} to see location on global map.`;
}

export default getSatelliteOutput;