import {EventEmitter} from "node:events";

const satelliteEvents = new EventEmitter();
satelliteEvents.on("generate-log", (logger) => {
    //could be repurposed to output to file, etc.
    if(logger.debug)
        console.debug(logger.message);
});

export default satelliteEvents;