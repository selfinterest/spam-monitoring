import "reflect-metadata";
import { SpamServer } from "./server";
import {Injector} from "./decorators/service.decorator";

const server = Injector.resolve<SpamServer>(SpamServer);

server.start();