const config = require('./config');

import Logger from "js-tale/dist/logger";
import {Message} from "discord.js";
import { EZPZBot } from "./ezpz-bot-js";

const logger = new Logger('EZPZI');

class Main
{
    ezpzBot:EZPZBot = new EZPZBot(config);

    init()
    {
        this.whenDiscordIsReady();
        this.whenATTIsReady();
    }

    private async whenDiscordIsReady()
    {
        if(!(this.ezpzBot?.discordBot?.uptime))
        {
            setTimeout(() => {this.whenDiscordIsReady()},10000);
        }
        else
        {
            // When discord is up and ready, tell it what to do with messages
            this.ezpzBot.discordBot.on('message', msg => {this.discordCommands(msg);});
        }
    }

    private whenATTIsReady()
    {
        if(!this.ezpzBot?.consoleOnline)
        {
            logger.error("loop and wait for console.");
            setTimeout(() => {this.whenATTIsReady()},10000);
            
        }
        else
        {
            // When ATT is ready, set up the subscription events
            logger.success("ATT ready");
            this.ezpzBot.dashboard?.subscribe('PlayerMovedChunk', (data:any) => this.playerMoved(data));
        }
    }

    playerMoved(data: any)
    {
        logger.log("player moved chunk");        
    }

    discordCommands(msg: Message)
    {
        if (msg.content === '!ping') {
            msg.reply('pong');
          }
        else if (msg.content === '!gimme') // when the player types !gimme, assuming his discord name is his game name, give him a stack of valyan
        {
            msg.reply('OK. Sending to user: ' + msg.author.username);
            let huh = this.ezpzBot.consoleCommand("spawn " + msg.author.username + " 32198 30");
        }
    }
  
}

var main = new Main();


main.init();



