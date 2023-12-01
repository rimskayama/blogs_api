import {Router} from "express"
import {devicesController} from "../composition-root";

export const devicesRouter = Router({})

devicesRouter.get('/', devicesController.getDevices.bind(devicesController))
devicesRouter.delete('/', devicesController.deleteSession.bind(devicesController))
devicesRouter.delete('/:deviceId', devicesController.deleteAllOthersSessions.bind(devicesController))
