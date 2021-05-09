# Uncomment and set this if running localy, or in 'traditional'
# hosting.
# if you're running in 'the cloud' your provided might
# have a secrter stown like AWS Vauilt or Azure Keystore 
# which wuld give a more secrue way of setting this.

##--- Change the line Below ---
#export BOT_SECRET_ID=
NODE=/usr/bin/nodejs

if [ "x$BOT_SECRET_ID" == "x" ]; then
    echo -e "You must set the bot Id before running the script.\n\tSee Readme.md for instructions"
    exit 1;
fi

$NODE Index.js
