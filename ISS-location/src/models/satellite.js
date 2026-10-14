class Satellite {
    constructor(name, latitude, longitude, location, mapLocation, visible) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = location;
        this.mapLocation = mapLocation;
        this.visible = visible;
    }

    isVisible() {
        if(this.visible === 'daylight')
            return true;
        else
            return false;
    }

    getVisibilityAsString() {
        return this.isVisible() ? "The station is visible to the naked eye" :
        "The station is not visible to the naked eye"
    }
}

export default Satellite;