const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

const {ConfirmPrompt , ChoicePrompt , DateTimePrompt , NumberPrompt, TextPrompt} = require('botbuilder-dialogs');

const { DialogSet , DialogTurnStatus } = require('botbuilder-dialogs');


const CHOICE_PROMPT    = 'CHOICE_PROMPT';
const CONFIRM_PROMPT   = 'CONFIRM_PROMPT';
const TEXT_PROMPT      = 'TEXT_PROMPT';
const NUMBER_PROMPT    = 'NUMBER_PROMPT';
const DATETIME_PROMPT  = 'DATETIME_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog ='';


class MeetingroomDialog extends ComponentDialog{

    constructor() {
        super('meetingroomDialog');



this.addDialog(new TextPrompt(TEXT_PROMPT));
this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT,this.noOfParticipantsValidator));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));


this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
    this.firstStep.bind(this),  // Ask confirmation if user wants to make reservation?
    this.getName.bind(this),    // Get name from user
    this.getNumberOfParticipants.bind(this),  // Number of participants for reservation
    this.getDate.bind(this), // Date of reservation
    this.getTime.bind(this),  // Time of reservation
    this.confirmStep.bind(this), // Show summary of values entered by user and ask confirmation to make reservation
    this.summaryStep.bind(this)
           
]));




this.initialDialogId = WATERFALL_DIALOG;


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

async firstStep(step) {
endDialog = false;
// Running a prompt here means the next WaterfallStep will be run when the users response is received.
return await step.prompt(CONFIRM_PROMPT, 'Would you like to make a reservation?', ['yes', 'no']);
      
}   
}