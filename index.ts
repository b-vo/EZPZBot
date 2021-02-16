const config = require('./config');

import Logger from "js-tale/dist/logger";
import {Message} from "discord.js";
import { EZPZBot } from "./ezpz-bot-js";

const logger = new Logger('EZPZI');

class Main
{
    ezpzBot:EZPZBot = new EZPZBot(config);

    gimmeOptions = new Map();
    tpOptions = new Array();          

    init()
    {
        //
        this.gimmeOptions.set("copper","32850 30");
        this.gimmeOptions.set("iron","23012 30");
        this.gimmeOptions.set("gold","30092 30");
        this.gimmeOptions.set("silver","23528 30");
        this.gimmeOptions.set("mythril","24774 30");
        this.gimmeOptions.set("palladium","60869 30");
        this.gimmeOptions.set("electrum","13158 30");
        this.gimmeOptions.set("viridium","16464 30");
        this.gimmeOptions.set("valyan","32198 30");
            
        this.gimmeOptions.set("grass","57872 30");

        this.gimmeOptions.set("wood","47118 oak 30");
        this.gimmeOptions.set("oak","47118 oak 30");
        this.gimmeOptions.set("ash","47118 ash 30");
        this.gimmeOptions.set("walnut","47118 walnut 30");
        this.gimmeOptions.set("birch","47118 birch 30");
        this.gimmeOptions.set("redwood","47118 redwood 30");

        this.gimmeOptions.set("lightleather","47760 daisleather 30");
        this.gimmeOptions.set("redleather","47760 daisredleather 30");
        this.gimmeOptions.set("darkleather","47760 unknownleather 30");
        this.gimmeOptions.set("greenleather","47760 wyrmfaceleather 30");

        this.gimmeOptions.set("largelightleather","23206 daisleather");
        this.gimmeOptions.set("largeredleather","23206 daisredleather");
        this.gimmeOptions.set("largedarkleather","23206 unknownleather");
        this.gimmeOptions.set("largegreenleather","23206 wyrmfaceleather");

        this.gimmeOptions.set("katanahandle","53200");
        this.gimmeOptions.set("kunaihandle","18456");
        this.gimmeOptions.set("naginatahandle","24220");
        this.gimmeOptions.set("wakizashihandle","47662");
        
        this.gimmeOptions.set("katanablade","17266");
        this.gimmeOptions.set("naginatablade","17420");
        this.gimmeOptions.set("saiblade","1600");
        this.gimmeOptions.set("wakazashiblade","9018");

        this.gimmeOptions.set("hebiosmould","22498");

        this.gimmeOptions.set("cloth","34570 30");

        this.gimmeOptions.set("flint","39484 30");
        this.gimmeOptions.set("coal","19658 30");
        this.gimmeOptions.set("stone","61670 30");

        this.gimmeOptions.set("food","8440 30");
        this.gimmeOptions.set("sword","34994");


        //
        this.tpOptions.push({name: "tower",desc: "Tower Entrance",coords: "-868.2,578.1,-1730.1"});
        this.tpOptions.push({name: "cp1",desc: "Checkpoint #1",coords: "-873.6,528.4,-1761.2"});
        this.tpOptions.push({name: "cp2",desc: "Checkpoint #2",coords: "-871.4,578.1,-1759.2"});
        this.tpOptions.push({name: "cp2t",desc: "Checkpoint #2, tower portion",coords: "-910.2,588.1,-1765.7"});
        this.tpOptions.push({name: "cp3",desc: "Checkpoint #3",coords: "-892.9,613.2,-1761.9"});
        this.tpOptions.push({name: "cp3ac",desc: "Checkpoint #3, after hanging chains",coords: "-831.8,618.1,-1757.6"});
        this.tpOptions.push({name: "cp4",desc: "Checkpoint #4",coords: "-872.9,628.2,-1758.4"});
        this.tpOptions.push({name: "cp4b",desc: "Checkpoint #4, Bridge Portion",coords: "-857.4,678.1,-1762.4"});
        this.tpOptions.push({name: "cp4bu",desc: "Checkpoint #4, Bridge Portion, Under",coords: "-851.9,675.0,-1763.6"});
        this.tpOptions.push({name: "cs5chainz",desc: "Checkpoint #5, Chain Climb",coords: "-889.2,741,-1759.8"});
        this.tpOptions.push({name: "cp5final",desc: "The final mad dash to the end",coords: "-926.8,773.1,-1762.9"});

        this.tpOptions.push({name: "spawn",desc: "Spawn Area",coords: "-693.4,129.4,74.8"});

        // this.tpOptions.push({name: " ",desc: " ",coords: " "});

        
        //


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
        else if (msg.content === '!help') {
            msg.reply('Make sure your discord name is the same as your in game name. You can use the commands: !teleport, !gimme, !allxp, !day');
          }
        else if(msg.content.charAt(0) == "!" && !this.ezpzBot?.consoleOnline)
        {
            msg.reply('I hear you, but the server does not look like it is up right now.');   
        }
        else if (msg.content === '!gimme')
        {
            let options = "(" + this.gimmeOptions.size + "): ";
            let keys = this.gimmeOptions.keys();
            let key;
            
            while( !key?.done)
            {
                key = keys.next();
                options += <string>key.value + " ";
            }
            
            msg.reply("Syntax: !gimme <item>\nOptions include " + options);
        }
        else if (msg.content.substr(0,7) === '!gimme ') // when the player types !gimme, assuming his discord name is his game name, give him a stack of valyan
        {
            let argument = msg.content.split(" ")[1];
            

            let choice = this.gimmeOptions.get(argument);

            if(!choice)
            {
                msg.reply("You want what? '!gimme' for options.");
            }
            else
            {
                msg.reply('OK. Sending to user: ' + msg.author.username);
                let huh = this.ezpzBot.consoleCommand("spawn " + msg.author.username + " " + choice);
            }

        }
        else if (msg.content === '!tp')
        {
            let options = "(" + this.tpOptions.length + "): ";
            
            for(let i=0;i<this.tpOptions.length;i++)
            {
                options += this.tpOptions[i].name + ": " + this.tpOptions[i].desc + "\n\t";
            }
            
            msg.reply("Syntax: !tp <item>\nOptions include " + options + "\n");
        }
        else if (msg.content.substr(0,4) === '!tp ')
        {
            let argument = msg.content.split(" ")[1];
            
            let choice = null;

            for(let i=0;i<this.tpOptions.length;i++)
            {
                if(argument == this.tpOptions[i].name)
                {
                    choice = this.tpOptions[i].coords;
                }
            }

            if(!choice)
            {
                msg.reply("You want to go where? '!tp' for options.");
            }
            else
            {
                msg.reply('OK. TPing user: ' + msg.author.username);
                let huh = this.ezpzBot.consoleCommand("player set-home " + msg.author.username + " " + choice);
                huh = this.ezpzBot.consoleCommand("player teleport " + msg.author.username + " Home");
            }

        }
        else if (msg.content === '!allxp')
        {
            let huh = this.ezpzBot.consoleCommand("player progression allxp " + msg.author.username);
            
            msg.reply("XP granted");
        }
        else if (msg.content === '!day')
        {
            let huh = this.ezpzBot.consoleCommand("time set day");
            
            msg.reply("Let there be light.");
        }

        else if (msg.content === '!setup' && msg.author.username === 'b_vo')
        {
            // fill books
            let huh = this.ezpzBot.consoleCommand("progress finishboxes");
            // finish boxes
            huh = this.ezpzBot.consoleCommand("progress fill-books");
            // mould spawn offset -336.083,-28.472,378.93
        }

    }
  
}

var main = new Main();


main.init();



