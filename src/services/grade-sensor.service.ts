import request = require("request-promise");

import {Factory, Service} from "../decorators/service.decorator";
import {SpamConfig} from "../config";
import {RabbitMqBackend} from "../backends/queue/rabbit";
import {LazyAbstractBackend} from "../backends/lazy-abstract";

// Normally, this would be its own micro service, running on a separate server

export interface SensorConfig {
    api: {
        host: string;
        port: string;
    },
    backend: RabbitMqBackend
}

@Service()
export class GradeSensor {

    constructor(protected config: SensorConfig) {

    }

    @Factory()
    static init(config: SpamConfig, queueBackend: RabbitMqBackend){
        const sensorConfig = {
            api: {
                host: "localhost",
                port: config.PORT
            },
            backend: queueBackend
        };

        return new GradeSensor(sensorConfig);
    }

    start(){
        console.log("Starting sensor", this);
    }

    checkGrades(){

    }
}

