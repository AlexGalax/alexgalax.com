# alexgalax.com

Terminal style ai bot, based on openai.

## Requirements
- Account & api key at https://beta.openai.com
- Running mongodb instance
- node.js & npm installed

## Getting started

#### Clone this repo
```bash
$ git clone git@github.com:AlexGalax/alexgalax.com.git
```

#### Install dependencies
```bash
$ npm install
```

#### Create environment variables
```bash
$ cp .env.example .env
```
Create file, edit `.env` and set your openai key, model and database name.

#### Run dev mode

```shell
$ npm run dev
```
The website is available at `localhost:3001`. Hot reload is configured in webpack, so any file changes in `/src` will reload the full page. This is good for changes in html or css. If a full reload of the page is not needed, set parameter `hot=true` in `server-de.js` config entry and restart. Now only the js modules are reloading in the background.

#### Check production mode

Change port in `APP_URL` to 3000, build files and start server:
```shell
$ npm run build
$ npm run start
```

The website is available at `localhost:3000`.

#### Run production mode

Clone repo onto the server. Change `APP_ENV=prod` and `APP_URL` to the website url. Build all the files and start the server
```shell
$ npm run build
$ npm run start
```
If you want the terminal detached, instead run 
```shell
$ npm run start > stdout.txt 2> stderr.txt &
```
If the server crashes, error will be logged in `stderr.txt`.

## Setup ai part 1

The first step is to set up a basic description for the bot, followed by an example conversation. Give some answers to question, that contain some information and the way you want the bot to behave.
The description will be taken from the file in `OPEN_AI_DESC_FILE`. The text in this file will be sent to any openai completion request.

The dialog partner is always defined by _human_ and _me_. This should make it easier for openai to understand the dialog.
```text
Human: How are you?
Me: I'm good, thank you.
```
As an additional feature, a mood for the bot on every dialog is also given, so openai should also complete with a mood every time:
```text
Human: How are you?
Me (happy): I'm good, thank you.
```
The naming and delimiters are configured in `utils/openai.js`. The mood is parsed from the answer and the little ascii bot changes its expression based on the mood in the completion. Ascii bot expressions can be extended in `src/modules/terminal/utils/asciibots.js`.

The overall description hasn't to be perfect. Its just used to have a very basic behaviour to collect some conversation data.

## Db records

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
          "state": true,
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

Every user has a list of `conversations`, witch contains a list of `dialogs` and a `summary` of that conversation. Each `dialog` is a set of a `prompt` and the ai generated `completion`. `choice` contains the unformatted answer of the ai and `state` is `true`, if the completion could be parsed.

## Greetings, human!

Everytime a user loads the page, a database lookup is made, to check if there is a previous conversation without a summary. If this is the case, a request to openai is made, to get a summary of that conversation, and it's stored in the database.

Now it's time to get a greeting. First thing that is added, is the text from `OPEN_AI_DESC_FILE`. Second thing is the summary of the previous conversation, if there is one.

## Let's talk

Now everytime the user talks to the bot, a database lookup is made to see, if there is an ongoing conversation (last one without a summary). This conversation dialogs are formatted, appended to `OPEN_AI_DESC_FILE` and send to openai to get a completion. This completion is stored as a new dialog in the current conversation.

That's a lot of text send to get a completion, but this way the bot not only "knows" the history of the current conversation, but also "remembers" the summary of last one.

## Setup ai part 2

After the bot talked to different people and has gathered optimally hundreds of dialogs, it's time to get these records.
```shell
$ mongoexport --collection=users --db=blex --out=bot-conversations.json
```

Hard part is, to review all the dialogs, and change the answers the way the bot should answer instead. After this is done, a very own openai model can be created by fine-tuning. There is a good tutorial how it's done: https://beta.openai.com/docs/guides/fine-tuning

Openai gives a name for the new model, witch has to be updated in `OPENAI_MODEL`. The content of `OPEN_AI_DESC_FILE` is no longer needed and can be removed. Also, the old records can be deleted from the database, to have a fresh set of conversations of the new model.

The bot now should behave like expected, more or less. This fine-tuning process can be done repeatedly, to get more and more properly generated answers.

## Todo
- left/right arrow keys, moving cursor

## Sources
- [OpenAI](https://beta.openai.com)
- [asciibots.js](https://github.com/walsh9/asciibots)

## Author
[Alexander Schornberg](https://www.alexgalax.com)
