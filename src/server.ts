import Koa = require("koa");
import {SpamConfig} from "./config";
import {Service} from "./decorators/service.decorator";

@Service()
export class SpamServer extends Koa {
    private readonly port: string;

    constructor(protected config: SpamConfig) {
        super();
        this.port = this.config.get("PORT");
    }
    start(){
        this.listen(this.port, () => {
            console.log('SPAM server listening on ' + this.port);
        })
        // Instantiate dependencies

    }
}