
//setting up the bot----------------------------------------
const chessBot = {
  name: "Morphy",
  //knowledge base lives in knowledge.js and is attached here as a property
  knowledge: openingKnowledge,
  //the opening from the most recent answer (null if there isn't one)
  lastOpening: null,
  //the family from the most recent answer, used for follow-up questions
  lastFamily: null,

  //methods----------------------------------------------
  introduce() {
    return "Hi! I'm " + this.name + ", here to answer your questions about chess openings!";
  },

  //normalize text
  normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  },

  //scoring a list of keywords against a question--------------------
  //phrases (with a space) are checked against the whole sentence,
  //single words are checked against the word list
  scoreKeywords(keywords, cleaned, words) {
    let score = 0;

    for (let keyword of keywords) {
      if (keyword.includes(" ")) {
        //phrase: look for it anywhere in the cleaned sentence
        if (cleaned.includes(keyword)) {
          score = score + 1;
        }
      } else {
        //single word: must be one of the words exactly
        if (words.includes(keyword)) {
          score = score + 1;
        }
      }
    }
    return score;
  },

  //-----------------------------------------------------------
  //finding the match based on keywords----------------------
  findMatch(question) {
    //clean the question, then break it into an array of words
    const cleaned = this.normalize(question);
    const words = cleaned.split(" ");

    //tracking the winner---------------------------------------
    //these live OUTSIDE the loop so they remember across all cards
    let bestEntry = null; //no best card yet
    let bestScore = 0;    //nothing has scored yet

    //going through each card-----------------------------------
    for (let entry of this.knowledge) {
      //the helper does all the keyword checking now
      const score = this.scoreKeywords(entry.keywords, cleaned, words);

      //checking if this card beats the best so far
      //uses > so on a tie, the earlier card stays the winner
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }

    //hand back the winning card (or null if nothing matched)
    return bestEntry;
  },
  //-----------------------------------------------------------



  //finding the matching variation inside a family------------------
  findVariation(family, question) {
    //clean the question, then break it into an array of words
    const cleaned = this.normalize(question);
    const words = cleaned.split(" ");

    //tracking the winner---------------------------------------
    let bestVariation = null; //no best card yet
    let bestScore = 0;    //nothing has scored yet

    //going through each variation-----------------------------------
    for (let variation of family.variations) {
      //the helper does all the keyword checking now
      const score = this.scoreKeywords(variation.keywords, cleaned, words);

      //checking if this variation beats the best so far
      //uses > so on a tie, the earlier card stays the winner
      if (score > bestScore) {
        bestScore = score;
        bestVariation = variation;
      }
    }
    //hand back the winning variation (or null if nothing matched)
    return bestVariation;
  },


  //answering the user-------------------------------------------
  ask(question) {
    //catching empty input: blank, only spaces, or only punctuation
    if (this.normalize(question) === "") {
      this.lastOpening = null;
      return "Try asking about a chess opening!";
    }

    //stage 1: find the opening family
    const family = this.findMatch(question);

    //follow-up: the user wants a list of variations---------------
    if (this.wantsVariations(question)) {
      //use the family in this question, or else the one from before
      let target = family;
      if (target === null) {
        target = this.lastFamily;
      }

      //no family in this question and none from before
      if (target === null) {
        this.lastOpening = null;
        return "Which opening? Ask me about one first, like the Sicilian, and then ask about its variations.";
      }

      this.lastFamily = target;  //this family is now the one being discussed
      this.lastOpening = target; //so the lichess link shows the family's position
      return this.listVariations(target);
    }

    //no family scored above 0, so give a fallback instead of crashing
    if (family === null) {
      this.lastOpening = null;
      return "Hmm, I don't know that one.";
    }
    this.lastFamily = family; //remember for follow up questions

    //stage 2: look for a specific variation inside that family
    const variation = this.findVariation(family, question);

    //deciding what to talk about: the family, or a specific variation
    let opening = family;          //start by assuming the family
    let title = family.name;

    if (variation !== null) {      //a variation matched, so use it instead
      opening = variation;
      title = family.name + ": " + variation.name;
    }

    this.lastOpening = opening; //memory
    return title + " (" + opening.eco + ")" + "\n" + opening.moves + "\n\n" + opening.idea;
  },
  //building a lichess analysis board link from a move string
  lichessLink(moves) {
    return "https://lichess.org/analysis/pgn/" + encodeURIComponent(moves);
  },
  //checking if the user is asking for a list of variations
  wantsVariations(question) {
    const cleaned = this.normalize(question);
    const words = cleaned.split(" ");
    const score = this.scoreKeywords(["variations", "lines", "options", "systems"], cleaned, words);
    return score > 0;
  },
  //listing the variations of a family as a sentence
    listVariations(family) {
    //some families (like the london) have no variations
    if (family.variations.length === 0) {
      return "I don't have any specific variations of the " + family.name + " yet.";
    }

    //collecting the names into an array
    const names = [];
    for (let variation of family.variations) {
      // blank 1: add this variation's name to the names array
      names.push(variation.name);
    }

    // blank 2: return the sentence, joining the names with ", "
    return "The " + family.name + " has these variations: " + names.join(", ") + ".";
    },
};
//chessBot--------------------------------------------------

//connecting to the html----------------------------------------
//grabbing the three elements we need from the page
const messageList = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question");


//adding a message bubble to the chat
//sender is either "bot" or "user", matching the css classes
//link is optional: if given, a lichess link is added under the text
function addMessage(text, sender, link) {
  const bubble = document.createElement("li"); //make a new <li>
  bubble.textContent = text;                   //put the text inside it
  bubble.classList.add("message", sender);     //give it the css classes

  //only add a link if one was passed in
  if (link !== undefined) {
    const anchor = document.createElement("a"); //make a new <a> (a link)
    anchor.href = link;                         //where the link goes
    anchor.textContent = "Open this position on Lichess";
    anchor.target = "_blank";                   //open in a new tab
    anchor.rel = "noopener";                    //safety habit for new-tab links
    bubble.appendChild(anchor);                 //put the link inside the bubble
  }

  messageList.appendChild(bubble);             //add it to the list on the page
  messageList.scrollTop = messageList.scrollHeight; //scroll to the newest message
}

//listening for the user sending a message-----------------------
chatForm.addEventListener("submit", function (event) {
  event.preventDefault(); //stop the page from reloading
  //console.log("sent!");
  const question = questionInput.value; //whatever the user typed
  addMessage(question, "user");         //show it as a user bubble
  const reply = chessBot.ask(question); //morphy works out the answer

  //if morphy found an opening, build a lichess link for it
  let link; //starts as undefined
  if (chessBot.lastOpening !== null) {
    link = chessBot.lichessLink(chessBot.lastOpening.moves);
  }

  addMessage(reply, "bot", link);       //show the answer (and link, if any)

  questionInput.value = "";             //clear the box for the next question
});

//morphy says hello when the page loads
addMessage(chessBot.introduce(), "bot");
