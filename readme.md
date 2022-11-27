# alexgalax.com

Terminal style ai bot, based on openai.

## Requirements
- Account & api key at https://beta.openai.com
- Running mongodb instance
- node.js & npm installed

## Getting started

#### clone this repo
`git clone git@github.com:AlexGalax/alexgalax.com.git`

#### install dependencies
`npm install`

#### create environment variables
Create file
```bash
cp .env.example .env
```
and edit `.env` and set your openai key & model.

#### Run dev mode

Run
```shell
npm run dev
```
and open `localhost:3001`. Hot reload is configured in webpack, so any file changes in `/src` will reload the page.

#### Check production mode

Change port in `APP_URL` to 3000. Run
```shell
npm run build
```
and start server with
```shell
npm run start
```
The website is available at `localhost:3000`.

#### Run production mode

Clone repo onto your server. Change `APP_ENV=prod` and `APP_URL` to your websites url. Build all the files and run it
```shell
npm run build
npm run start
```
If you want the terminal detached, instead run 
```shell
npm run start > stdout.txt 2> stderr.txt &
```

## Setup ai part 1

The first step is to set up a basic description for the bot, followed by an example conversation. Give some answers to question, that contain some information and the way you want the bot to behave.
This is set up in `var/text/ai_bot_description.txt`. This text will be sent to any openai completion request.

It hasn't to be perfect. Its just used to have a very basic behaviour to collect some conversation data.

## DB records

When the user visits the website the first time, a random id is created and stored in a cookie. This id is sent with every request to check, if there is any previous conversation of that user.

Scheme of the userdata:

```json
{
  "_id": {
    "$oid": "6e63665f754a754372664373"
  },
  "conversations": [
    {
      "dialogs": [
        {
          "prompt": "",
          "completion": "{\"text\":\"\",\"mood\":\"\"}",
          "state": true || false,
          "choice": "",
          "_id": {
            "$oid": "6375174a7551bd469995a359"
          },
          "createdAt": {
            "$date": "2022-11-16T17:00:58.649Z"
          },
          "updatedAt": {
            "$date": "2022-11-16T17:00:58.649Z"
          }
        }
      ],
      "summary": "",
      "_id": {
        "$oid": "6375174a7551bd469995a358"
      },
      "createdAt": {
        "$date": "2022-11-16T17:00:58.649Z"
      },
      "updatedAt": {
        "$date": "2022-11-16T17:02:56.426Z"
      }
    }
  ],
  "__v": 5
}
```

Every user has a list of `conversations`, witch contains a list of `dialogs` and a `summary` of that conversation. Each `dialog` is a set of a `prompt` and the ai generated `completion`. `choice` contains the unformatted answer of the ai and state is either `true` if the completion could be parsed.

## Greetings, human!

Everytime a user loads the page, a database lookup is made, to check if there is a previous conversation without a summary of that conversation. If this is the case, a request to openai is made, to get a summary of that conversation, and it's stored in the database.

Now it's time to get a greeting. First thing that is added, is the text in `ai_bot_description.txt`. Second thing is the summary of the previous conversation, if there is one.

## Let's talk

Now everytime the user talks to the bot, a database lookup is made to see, if there is an ongoing conversation (last one without a summary). This conversation dialogs are formatted, appended to `ai_bot_description.txt` and send to openai to get a completion. This completion is stored as a new dialog in the current conversation.

That's a lot of text send to get a completion, but this way the bot not only "knows" the history of the current conversation, but also "remembers" the summary of last one.

## Setup ai part 2

After the bot talked to different people and has gathered optimally hundreds of dialogs, it's time to get these records.
```shell
mongoexport --collection=users --db=blex --out=bot-conversations.json
```

Hard part is, to review all the dialogs, and change the answers the way the bot should answer instead. After this is done, a very own openai model can be created by fine-tuning. There is a good tutorial how it's done: https://beta.openai.com/docs/guides/fine-tuning

Openai gives a name for the new model, witch has to be updated in `.env`. The content of `ai_bot_description.txt` is no longer needed and can be cleared (don't remove file). Also, the old records can be deleted from the database, to have a fresh set of conversations of the new model.

The bot now should behave like expected. More or less. This fine-tuning process can be done repeatedly, to get more and more properly generated answers.

## Todos
- add summary of previous conversation in `openaiGetDialogAnswer()`
- add environment variable that flags, if the openai model is custom. `ai_bot_description.txt` doesn't need to get read if it's a custom model and can be deleted. 

## Sources
- [OpenAI](https://beta.openai.com)
- [ascii bots](https://github.com/walsh9/asciibots)



## Author
[Alexander Schornberg](https://www.alexgalax.com)
