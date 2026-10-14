const getSatelliteEndpoints = new Map();
getSatelliteEndpoints.set("WHERETHEISS-SATELLITES", "https://api.wheretheiss.at/v1/satellites");
getSatelliteEndpoints.set("WHERETHEISS-ISS", "https://api.wheretheiss.at/v1/satellites/{ID}");
getSatelliteEndpoints.set("WHERETHEISS-ISS-GEO", "https://api.wheretheiss.at/v1/coordinates/{LATITUDE},{LONGITUDE}");
getSatelliteEndpoints.set("GEONAMES-GEO", "http://api.geonames.org/oceanJSON?lat={LATITUDE}&lng={LONGITUDE}&username={USERNAME}");

export default getSatelliteEndpoints;
