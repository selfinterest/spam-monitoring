import rc = require("rc");
import { Service, Factory} from "../decorators/service.decorator";
import {get} from "lodash";

@Service()
export class SpamConfig {
    private readonly _config: any;


    PORT = "3002";

    constructor(_rc: any = rc){
        this._config = _rc("spamdemo", this);
    }

    @Factory()
    static init(){
        return new SpamConfig();
    }

    get(key: string | number | symbol){
        return get(this._config, key);
    }
}
