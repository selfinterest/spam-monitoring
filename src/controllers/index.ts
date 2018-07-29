import {AlertsController} from "./alerts.controller";
import {SpamController} from "./spam.controller";

SpamController.registerControllerClass(AlertsController);

export {SpamController, AlertsController};