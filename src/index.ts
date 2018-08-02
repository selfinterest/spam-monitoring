import "reflect-metadata";
import { SpamServer } from "./server";
import {Injector} from "./decorators/service.decorator";
import {GradeSensor} from "./services/grade-sensor.service";

const server = Injector.resolve<SpamServer>(SpamServer);
const sensor = Injector.resolve<GradeSensor>(GradeSensor);

server.start();

console.log(sensor);