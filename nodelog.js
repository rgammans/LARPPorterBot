var fs = require('fs').promises;

module.exports = class Logger {

    constructor(fname) {
        var that = this;
        this.fh = null;
        this.last_operation = fs.open(fname,"w+")
            .then( fh => { that.fh =fh } );
    }

    log_message(channel,sender,msg) {
        var that = this;
        let message = `\x01${new Date()}\x02${sender.username}\x02${channel.name}\x02${msg}\x04`;
        var that = this;
        // Add this promise to the chain of 
        // promises, which forces serialisation
        // of the messages into the file.
        this.last_operation = this.last_operation.then(
            () => {
                fs.writeFile(that.fh, message);
            }
        )
    }

}
