// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ConfirmPrompt, TextPrompt, DateTimePrompt, ChoicePrompt, DialogTurnStatus, ChoiceFactory, WaterfallDialog, DialogSet, ComponentDialog } = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');

const RestaurantCard = require('../resources/adaptivecards/Restaurantcard')

const CARDS = [

    RestaurantCard
];
const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const NAME_PROMPT = 'NAME_PROMPT';
const DATETIME_PROMPT = 'Datetime';
class RrBot extends ComponentDialog {
    constructor(userstate) {
        super('Rrbot');
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new TextPrompt(NAME_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new DateTimePrompt(DATETIME_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.FirstStep.bind(this),
            this.LocationStep.bind(this),
            this.DatetimeStep.bind(this),
            this.BookStep.bind(this),
            this.SummaryStep.bind(this)
            // this.nameConfirmStep.bind(this),
            // this.ageStep.bind(this),
            // this.pictureStep.bind(this),
            // this.confirmStep.bind(this),
            // this.summaryStep.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        // this.onMessage(async (context, next) => {
        //     const replyText = `Echo: ${ context.activity.text }`;
        //     await context.sendActivity(MessageFactory.text(replyText, replyText));
        //     // By calling next() you ensure that the next BotHandler is run.
        //     await next();
        // });
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
    // await step.context.sendActivity({attachments: [CardFactory.adaptiveCard(CARDS[0])]
    // });


    async FirstStep(step) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
    await step.context.sendActivity({
        text: 'Enter details ',
        attachments: [CardFactory.adaptiveCard(CARDS[0])]
    });
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Hii, Thanks for Contacting CDD Bot \nPlease select anyone',
            choices: ChoiceFactory.toChoices(['Meeting Room Booking', 'Meeting Room Status'])
        });
    }
    async LocationStep(step) {
        step.values.transport = step.result.value;
        return await step.prompt(NAME_PROMPT, 'Enter a Location');
    }

    async DatetimeStep(step) {
        step.values.location = step.result;
        return await step.prompt(DATETIME_PROMPT, 'Enter a Date');
    }

    async BookStep(step) {
        step.values.Datetime = step.result.value;

        return await step.prompt(NAME_PROMPT, 'Enter Name of person');
    }

    async SummaryStep(step) {
        if (step.result) {
            // Get the current profile object from user state.
            const msg = `Your meeting scheduled in ${ step.values.location } and your name as ${ step.result }`;

            await step.context.sendActivity(msg);
        }

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await step.endDialog();
    }
}

module.exports.RrBot = RrBot;
