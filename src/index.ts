import {runDB} from "./repositories/db";
import { app} from "./app-config";

export const port = process.env.PORT || 5000

app.set('trust proxy', true)

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

startApp();
