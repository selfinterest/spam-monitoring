import {SpamController} from "./spam.controller";
import {SpamConfig} from "../config";
import {Factory, Service} from "../decorators/service.decorator";

@Service()
export class AlertsController extends SpamController   {

    constructor(protected config: SpamConfig){
        super();

        console.log("Register alerts controller");
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