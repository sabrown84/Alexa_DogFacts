/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID =
'amzn1.ask.skill.19ff7512-e46d-406c-bc00-5f677c5e94d4'; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var FACTS = [
    "There are 150 dog breeds, divided into 8 classes: sporting, hound, working, terrier, toy, non-sporting, herding, miscellaneous.",
    "Dogs sweat through the pads of their feet, not from salivating.",
    "An adult dog has 42 teeth, while a puppy has 28 teeth.",
    "A recent study discovered that dogs do see in color, just not as vividly as we see.",
    "The Basenji is the only barkless dog in the world.",
    "Greyhounds can reach a speed of up to 45 miles per hour.",
    "Three dogs survived the sinking of the Titanic, two Pomeranians and one Pekingese.",
    "Dogs' eyes have a special membrane, called the tapetum lucidum, that allows them to see in the dark.",
    "62 percent of U.S. households own a pet, which equates to 72 point 9 million homes.",
    "Dogs have about one thousand seven hundred taste buds. Humans have about nine thousand and cats have about four hundred sevety-three.",
    "Dogs curl up into a ball when they sleep to keep themselves warm and protect their vital organs from predators.",
    "You can lower your blood pressure just by petting a dog.",
    "Corgi is welsh for 'dwarf dog'.",
    "Dogs have wet noses because it helps them absorb scent chemicals.",
    "If you leave your dog a piece of clothing that smells like you, the scent will comfort them and help with separation anxiety.",
    "If a guy has a dog with him, he's three times more likely to get a girl's phone number.",
    "The Norwegian Lundehund is the only dog that has six toes on each foot.",
    "Labradors are the most popular breed in the United States.",
    "Bloodhounds are able to trace scents that are over three hundred hours old.",
    "When your dog spins in a circle before settling down to snuggle, it's because he's making himself at home! It's a nesting trait.",
    "Dalmation puppies are born completely white and develop their spots over time!",
    "A service dog named Kirsch received an honorary master's degree in mental health for attending all of his owner's classes.",
    "Dogs have at least 18 muscles in each ear.",
    "Dogs can hear about 4 times the distance of a human.",
    "Dogs can recognize more than 150 words.",
    "George Lucas modeled the E woks from Star Wars after his family dog.",
    "Spaying or neutering a dog can help prevent certain types of cancer.",
    "The average dog can run about nineteen miles per hour at full speed.",
    "With an average lifespan of just over 11 years, the typical dog costs thirteen thousand five hundred dollars.",
    "Dogs will be submissive to anyone they feel is higher up in the pack.",
    "People have been keeping dogs for pets for twelve thousand years.",
    "A female dog carries her puppies for about sixty days before they are born.",
    "Obesity is the number one health problem in dogs.",
    "Seventy percent of people sign their pets name on gretting and holiday cards.",
    "Dogs do have a sense of time and do miss you when you're gone.",
    "On average, a dog's mouth exerts three hundred twenty pounds of pressure.",
    "Dogs don't like rain because the sound is amplified and hurts their sensitive ears.",
    "94 percent of owners say their dog makes them smile more than once a day.",
    "A dog's shoulder blades are not attached to the rest of the skeleton to allow greater flexibility for running.",
    "During the Middle Ages, Great Danes and Mastiffs were suited with armour an spiked collars to enter a battle or to defend supply caravans.",
    "Those born under the sign of the dog in Chinese astrology are considered to be loyal and discreet, though slightly temperamental.",
    "A dog most likely interprets a smile as a baring their teeth, which is a sign of aggression.",
    "There are an estimated four hundred million dogs in the world.",
    "It is much easier for dogs to learn spoken commands if they are given in conjuction with hand signals or gestures.",
    "Dogs can count up to five and can perform simple mathematical calculations.",
    "Dogs sleep for an average of ten hours a day."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a dog fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your fact: " + randomFact;
    var cardTitle = "Your Fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};
