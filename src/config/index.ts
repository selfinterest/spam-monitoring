import rc = require("rc");
import { Service, Factory} from "../decorators/service.decorator";
import {get} from "lodash";

@Service()
export class SpamConfig {
    private readonly _config: any;


    PORT = "3002";

    alerts = {
        queue: {
            address: "http://localhost:5672",
            name: "alerts"
        }
    }

    constructor(_rc: any = rc){
        this._config = rc("spamdemo", this);
    }

    @Factory()
    static init(){
        return new SpamConfig();
    }

    get(key: string){
        return get(this._config, key);
    }

    toString(){
        const deserizlied = Object.keys(this._config).reduce ( (memo: any, key: string) => {
            memo[key] = this._config[key];
            return memo;
        }, {});

        return deserizlied;
    }
}
