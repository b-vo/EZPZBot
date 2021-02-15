# EZPZBot
An easy starting place to make a bot based on js-tale (https://github.com/alta-vr/js-tale).

## Setup

### Dependencies
Firstly, setup a project and install required dependencies as per the js-tale project (https://github.com/alta-vr/js-tale).

`npm init`

`npm i js-tale`

`npm i typescript --save-dev`

`npm i ts-node --save-dev`

`npm i discord.js`

`tsc --init`

In `package.json`, add a script called `start`:
`"start": "ts-node ."`

Setup your discord bot and get the token. See: https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js

### Config
You will need to configure client id and secret somewhere that won't be checked into git.
For instance, create a file called `config.js`, and add `config.js` to the `.gitignore`.

This file should contain:
```
module.exports = {
    "client_id": "<insert id here>",
    "client_secret": "<insert secret here>",
    "scope" : "<insert scopes here>",
    "discord_bot_token" : "<setup your discord bot and get the token>",
    "att_group_id" : "[optional group ID]",
    "att_server_id" : "[optional server ID]"
}
```
att_group_id and att_server_id are optional, in the case you only have 1 group and 1 server, the code will just grab the first one.

At this stage, scopes should be:
`ws.group ws.group_members ws.group_servers ws.group_bans ws.group_invites group.join group.leave group.view group.members group.invite server.view server.console`

Once all of this is done, `npm start`
