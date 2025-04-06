import {v} from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args : {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
    },
    handler : async(convexToJson,args) => {
        // if user argslready exist
        const user = await convexToJson.db.query('users').filter((q) => q.eq(q.field("email"),args.email)).collect();

        console.log(user)
    
        if(user?.length == 0){
            // create user
            const newUser = await convexToJson.db.insert('users',{
                name: args.name,
                email: args.email,
                picture: args.picture,
                uid: args.uid
            });

            console.log(newUser);
        }
    }
})


export const GetUser = query({
    args : {
        email: v.string(),
    },
    handler: async(convexToJson,args) => {
        const user = await convexToJson.db.query('users').filter((q) => q.eq(q.field("email"),args.email)).collect();

        return user[0];
    }
})