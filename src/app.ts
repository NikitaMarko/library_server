import {launchServer} from "./server.ts";
import * as mongoose from "mongoose";
import {db} from "./config/libConfig.js";

mongoose.connect(db).then(()=> {
    console.log("MongoDB successfully connected")
    launchServer();
})
    .catch(()=>{
        console.log("Something went wrong");
    })

