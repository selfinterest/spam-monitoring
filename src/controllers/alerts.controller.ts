import {SpamConfig} from "../config";
import {Factory, Service} from "../decorators/service.decorator";

@Service()
export class AlertsController    {

    constructor(protected config: SpamConfig){
        //super();

    }

    getAlerts(){
        return [];
    }

    @Factory()
    static init(config: SpamConfig){
        //return config;
        return new AlertsController(config);
    }
}