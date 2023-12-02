import {Router} from "express"
import {container} from "../composition-root";
import {DevicesController} from "../controllers/devices-controller";

const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/', devicesController.getDevices.bind(devicesController))
devicesRouter.delete('/', devicesController.deleteSession.bind(devicesController))
devicesRouter.delete('/:deviceId', devicesController.deleteAllOthersSessions.bind(devicesController))
