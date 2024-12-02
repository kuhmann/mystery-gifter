# mystery-gifter
Very simple (hopefully) Discord bot for relaying mystery gift messages

# Setup

clone the repo. Copy config.json.sample to config.json:
- token and clientId are from the discord developer portal. token on the bot panel
  - bot needs to be added with "send messages", "attach files", and "use application commands" (I think)
- guildId is the single server the bot will be stalking
- channelId is the secret channel for the mystery gifting elf admins to work within - assignments get dumped here
  - Make sure the bot role is added to this channel with send messages and attach files!

You'll need node.js - version 20.10 was last used and worked. nodejs for Ubuntu.

`npm install` to get the dependencies. It's likely ok to update packages.

You will need to add the bot to your server. You can generate a join URL from the discord developer portal on the OAuth2 url generator. Check the box marked "bot" then the permissions from above will be available to check. Discord is constantly changing permissions things so you might have to fiddle. Do note that the main code registers all the commands from the commands sub-directory as part of its execution.

`node mystery.js` runs the bot... logs go into STDOUT.
