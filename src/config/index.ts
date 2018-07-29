import rc = require("rc");
import {Inject, Service, Factory} from "../decorators/service.decorator";
import {get} from "lodash";
/*export interface SpamConfig {

}*/


/*export const config: SpamConfig = rc("spamdemo", {

}*/

@Service()
export class SpamConfig {
    private readonly _config: any;


    PORT = "3002";

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
