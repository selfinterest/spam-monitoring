import Koa = require("koa");
import {SpamConfig} from "./config";
import {Inject, Service} from "./decorators/service.decorator";
import {SpamRouter} from "./router";

export interface Thing {

}

@Service()
export class SpamServer extends Koa {
    private readonly port: string;

    constructor(protected config: SpamConfig, protected router: SpamRouter) {
        super();

        this.port = this.config.get("PORT");
    }


    start(){
        this.use(this.router.routes());
        this.listen(this.port, () => {
            console.log('SPAM server listening on ' + this.port);
        })
        // Instantiate dependencies

    }
}