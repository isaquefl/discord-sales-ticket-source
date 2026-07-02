const { processOrder, approveOrder } = require("../../Functions/carrinho");
const { ActivityType } = require("discord.js");
const { General } = require("../../Database");

module.exports = {
    name: "ready",
    run: async (client) => {

        setInterval(() => { processOrder(client) }, 15000); 
        setInterval(() => { approveOrder(client) }, 10000); 

        let i = 0;
        let toggle = true; 
    
        setInterval(() => {
            let data = General.get("System.App.status");
            
            if (!data || !Array.isArray(data)) data = [];
            if (data.length === 0) return console.log("Nenhum status encontrado.");
        
            const activities = data.map(item => ({
                name: item,
                url: item.url || null
            }));
            if (i >= activities.length) i = 0;
            
            const activity = { ...activities[i] };
            activity.type = ActivityType.Custom
    
            client.user.setActivity(activity);
    
            i++;
        }, 5000);

    }
}