import webhookEventSchema from "../DB/schema/webhookEventSchema";

export function isProcessed(webhook_id) {
    const webhook=webhookEventSchema.findById(webhook_id).lean();
     if(webhook._id===webhook_id) return true;
     
}

export async function markProcessed(webhook_id) {
     try {
         await webhookEventSchema.create({_id:webhook_id});
         return true;
     } catch (error) {
         if(error.code===11000) return false;
         throw error;
     }
}