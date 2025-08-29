import {launchServer} from "./server.ts";
import * as mongoose from "mongoose";
import {configuration} from "./config/libConfig.js";

mongoose.connect(configuration.db)
    .then(() => {
        console.log("MongoDB successfully connected")
        launchServer();
    })
    .catch(() => {
        console.log("Something went wrong")
    })
