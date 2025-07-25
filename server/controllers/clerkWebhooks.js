import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async(req,res)=>{
    try {
        //created a svix with instance with clerk webhook secret
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //geting headers
        const headers = {
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        };

        //verify header
        await webhook.verify(JSON.stringify(req.body),headers);

        //get data from req body

        const {data ,type} = req.body
<<<<<<< HEAD
       
        //switch case for diff events

        switch (type) {
            case "user.created":{
                 const userData = {
=======
        const userData = {
>>>>>>> origin/main
            _id : data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image : data.image_url

        }

<<<<<<< HEAD
=======
        //switch case for diff events

        switch (type) {
            case "user.created":{
>>>>>>> origin/main
                await User.create(userData)
                 break;
            }

            case "user.updated":{
<<<<<<< HEAD
                 const userData = {
            _id : data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image : data.image_url

        }

=======
>>>>>>> origin/main
                await User.findByIdAndUpdate(data.id ,userData)
                 break;
            }

            case "user.deleted":{
                await User.findByIdAndDelete(data.id)
                 break;
            }    
        
            default:
                break;
        }

        res.json({success:true ,message:"webhook recive"})
    } catch (error) {
         console.log(error.message)
         res.json({success:false, message:error.message})
    }
}


export default clerkWebhooks



