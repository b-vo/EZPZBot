import { ApiConnection } from 'js-tale/dist/Core/ApiConnection';
import { SubscriptionManager } from 'js-tale/dist/Core/SubscriptionManager';
import { GroupManager } from 'js-tale/dist/Groups/GroupManager';

import Logger, { initLogger } from 'js-tale/dist/logger';
//import { Console } from 'js-tale/dist/Groups/Console';
import {ServerConnection} from 'js-tale/dist/Groups/ServerConnection'
import { Config } from 'js-tale/dist/Core/Config';

// Discord stuff
import { Client, Message, TextChannel } from 'discord.js';
import { Server } from 'js-tale/dist/Groups/Server';
import { Group } from 'js-tale/dist/Groups/Group';

const logger = new Logger('EZPZ');

// Take the ATT Config interface and add on some extra config
// stuff.
interface EZPZConfig extends Config
{
    discord_bot_token: string;
    att_group_id?: string; // "AKA Invite Code"
    att_server_id?: string; // Server ID from dashboard
} 

export class EZPZBot
{
    // ATT Stuff
    private api:ApiConnection = new ApiConnection();
    private subscriptions:SubscriptionManager = new SubscriptionManager(this.api);
    private groupManager:GroupManager = new GroupManager(this.subscriptions);
    private group:Group|undefined;
    private server:Server|undefined;
    dashboard:ServerConnection|undefined;

    consoleOnline:boolean = false;

    // discord bot
    public discordBot:Client = new Client();
    commandChannel:TextChannel|undefined;

    // config
    private config:EZPZConfig;

    public constructor(config:EZPZConfig)
    {
        this.config = config;
        this.attInit();
        this.discordInit();
        // this.testFunction = this.console?.subscribe;
    }
  
    public consoleCommand(commandString:string)  
    {   
        if(!this.consoleOnline)
        {
            logger.error(commandString + " sent but console offline. Failed.");
            // fail
        }
        else{
            logger.success(commandString + " sent.");
            let commandResponse = "";
            this.dashboard?.send(commandString).then((response:any)=>{
                        commandResponse = response;logger.info(commandResponse);});
            return commandResponse;

        }

    }

    private async attInit()
    {
        await this.api.login(this.config);
        await this.subscriptions.init();
        await this.groupManager.groups.refresh(true);
        await this.groupManager.acceptAllInvites(true);

        this.group = (!!this.config.att_group_id) ? this.groupManager.groups.get(Number(this.config.att_group_id)) : 
            this.groupManager.groups.items[0];

        this.group.automaticConsole(this.connectionOpened.bind(this));

        this.server = (!!this.config.att_server_id) ? this.group.servers.get(Number(this.config.att_server_id)) : 
            this.group.servers.items[0]; 

    }

    private connectionOpened(connection:ServerConnection)
    {
        logger.success(`Connected to ${connection.server.info.name}`);
        this.consoleOnline = true;
        this.commandChannel?.send(connection.server.info.name + " is up and ready for commands.").catch((err) => console.error(err));

        connection.on('closed', this.connectionClosed.bind(this));

        //connection.subscribe('PlayerJoined', data => connection.send('player kill joel'));

        this.dashboard = connection;
    }

    private connectionClosed(connection:ServerConnection)
    {
        logger.warn(`Disconnected from ${connection.server.info.name}`);
        this.consoleOnline = false;
        this.commandChannel?.send(connection.server.info.name + "  stopped running.").catch((err) => console.error(err));
    }

    private discordInit()
    {
        this.discordBot.login(this.config.discord_bot_token);
        this.discordBot.once("ready", () => {
            this.commandChannel = <TextChannel>this.discordBot.channels.cache.find(ch => (<TextChannel>ch).name === 'commands');
            if(!this.commandChannel) logger.error("Are you missing the 'commands' channel in your Discord?");
        });  

    }

    
    
}