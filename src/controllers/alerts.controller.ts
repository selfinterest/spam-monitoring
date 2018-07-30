import {SpamConfig} from "../config";
import {Factory, Service} from "../decorators/service.decorator";
import {RabbitMqBackend} from "../backends/rabbit";

@Service()
export class AlertsController    {

    constructor(protected config: SpamConfig, protected backend: RabbitMqBackend){
        //super();

    }

    async getAlerts(){
        const message = await this.backend.pull();
        /*if(message) {
            return message.content;
        } else {
            return [];
        }*/

        if(message) {
            return JSON.parse(message.content.toString());
        } else {
            return {};
        }
    }




    pushAlert(e: any){
        return this.backend.push(JSON.stringify({...e, date: Date.now()}));
    }

    @Factory()
    static init(config: SpamConfig, backend: RabbitMqBackend){
        //return config;
        return new AlertsController(config, backend);
    }
}