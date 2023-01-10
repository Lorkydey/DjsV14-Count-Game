
const countSchema = require("../../db_schemas/countSchema"); // path of the count schema

module.exports = {
   name: 'messageCreate',
   async execute(message, client) {

        const data = await countSchema.findOne({guildId: message.guild.id,});
        if (!data) {
            const countdbcreate = new countSchema({
            guildId: message.guild.id,
            currentnum: 0,
            topnum: 0,
            });
            await countdbcreate.save().catch((err) => console.log(err));
        }
        
        const user = message.author;
        
        const countingchannel = client.channels.cache.get('COUNT_CHANNEL_ID')
        
        if (message.channel === countingchannel) {
            if (user.bot) return
            if (Number(message.content) === data.currentnum + 1) {
                message.react('🟢')
                await countSchema.findOneAndUpdate({guildId: message.guild.id, currentnum: data.currentnum+1})
                if (data.currentnum === data.topnum) {
                    countingchannel.send(`**New record !**`).catch(console.error)
                }
            } else if (user.id !== client.user.id) {
                message.react('🔴')
                countingchannel.send(`${user} wrong number, game restarts from 0`).catch(console.error)
                await countSchema.findOneAndUpdate({guildId: message.guild.id, currentnum: 0})
                if (data.currentnum > data.topnum) {
                    await countSchema.findOneAndUpdate({guildId: message.guild.id, topnum: data.currentnum})
                    countingchannel.setTopic(`🔢 Current Record: ${data.topnum}`)
                }
                
            }
        }
    },
};
