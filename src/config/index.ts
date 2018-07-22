import rc = require("rc");
import {Service} from "../decorators/service.decorator";
import {get} from "lodash";
/*export interface SpamConfig {

}*/


/*export const config: SpamConfig = rc("spamdemo", {

}*/

@Service()
export class SpamConfig {
    private readonly _config: any;

    PORT = "3002";

    constructor(){
        this._config = rc("spamdemo", this);
    }

    get(key: string){
        return get(this._config, key);
    }
}
