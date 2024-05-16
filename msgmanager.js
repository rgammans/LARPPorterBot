"use strict";

module.exports = class MSGManager {
    constructor(nameID, channel, utility, description, items, cash) {
        this.channel = channel;
        this.nameID = nameID;
        this.descriptionMsgs = [];
        this.itemsMsgs = [];
        this.utility = utility;
        this.setDescription(description);
        this.setItems(items, cash);
        setTimeout(this.deleteMsgs.bind(this), 60000);
    }
    async deleteMsgs() {
        if (this.channel) {
            try {
                // We used to check if the channel was deleted here, but that was removed in
                // Discord.js v14, and deprecated in vt13. So we just log an error, and we can 
                // monitor if anyone raises an issue
                var msgs = await this.channel.messages.fetch();
                msgs = msgs.filter(m => !this.descriptionMsgs.find(x => x === m) && !this.itemsMsgs.find(x => x === m) && (Date.now() - m.createdTimestamp > 300000));
                msgs.each(m => {
                    if (!m.pinned) {
                        this.utility.deleteMsg(m);
                    }
                });
                setTimeout(this.deleteMsgs.bind(this), 60000);
            } catch (e) {
                console.log(`Error: ${e}: if you see a log of these you should probably raise an issue on github and lets us now if there were any problem with message deletion`);
            } 
        }
    }

    async setDescription(description) {
        for (var i = 0; i < this.descriptionMsgs.length; i++) {
            await this.utility.deleteMsg(this.descriptionMsgs[i]);
        }
        this.descriptionMsgs = await this.utility.sendMsg(this.channel, "***" + description + "***");
    }
    async setItems(items, cash) {
        for (var i = 0; i < this.itemsMsgs.length; i++) {
            await this.utility.deleteMsg(this.itemsMsgs[i]);
        }
        if (items.length === 0) {
            this.itemsMsgs = await this.utility.sendMsg(this.channel, this.nameID + " contains no items");
        } else {
            this.itemsMsgs = await this.utility.sendMsg(this.channel, this.nameID + " contains the following items:");
            for (var i = 0; i < items.length; i++) {
                var msgContent = items[i].view(undefined, [], true, false, this.channel, true);
                this.itemsMsgs = this.itemsMsgs.concat(await this.utility.sendMsg(this.channel, msgContent));
            }
        }
        this.itemsMsgs = this.itemsMsgs.concat(await this.utility.sendMsg(this.channel, this.nameID + " contains " + cash + " in cash."));
    }
}