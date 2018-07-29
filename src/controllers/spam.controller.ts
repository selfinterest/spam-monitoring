import {AlertsController} from "./alerts.controller";
import {Injector, Service} from "../decorators/service.decorator";
import {Type} from "../decorators/service.decorator";
import {SpamConfig} from "../config";
import {SpamServer} from "../server";

//Injector.resolve<SpamServer>(SpamServer);

@Service()
export class SpamController {

    //private static _controllers: WeakMap<Type<SpamController>, SpamController> = new WeakMap<Type<SpamController>, SpamController>();

    constructor() {

    }

    get(){

    }
    static registerControllerClass(controllerClass: Type<SpamController>){
        /*const ctrl = SpamController._controllers.get(controllerClass);
        if(!ctrl) {
            SpamController._controllers.
        }*/

        /*let ctrl = SpamController._controllers.get(controllerClass);

        if(!ctrl) {
            ctrl = Injector.resolve<SpamController>(controllerClass);
            SpamController._controllers.set(controllerClass, ctrl )
        }

        return SpamController;*/

    }
}