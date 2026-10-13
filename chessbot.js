
//setting up the bot----------------------------------------
const chessBot = {
  name: "Morphy",
  //knowledge base lives in knowledge.js and is attached here as a property
  knowledge: openingKnowledge,
  //the opening from the most recent answer (null if there isn't one)
  lastOpening: null,
  //the family from the most recent answer, used for follow-up questions
  lastFamily: null,

  //small talk topics------------------------------------------------
  smallTalk: [
    {
      topic: "greeting",
      keywords: ["hi", "hello", "hey", "hiya", "howdy", "yo", "good morning", "good evening"],
      replies: [
        "Hello! Ask me about any opening, from the Sicilian to the London.",
        "Hey there! Which opening are you working on?",
        "Hi! I'm {name}. Name an opening and I'll show you its main line."
      ]
    },
    {
      topic: "how are you",
      keywords: ["how are you", "hows it going", "how are things", "whats up"],
      replies: [
        "Ready to play! What opening shall we look at?",
        "I'm doing well, just reviewing some Ruy Lopez lines. You?",
        "Feeling sharp, like a Najdorf. What can I explain for you?"
      ]
    },
    {
      topic: "thanks",
      keywords: ["thanks", "thank", "thx", "ty", "cheers", "appreciate"],
      replies: [
        "Any time! Want to save that one to your wishlist?",
        "Happy to help. Good luck at the board!",
        "You're welcome. There are plenty more openings where that came from."
      ]
    },
    {
      topic: "who are you",
      keywords: ["who are you", "your name", "whats your name", "who is morphy", "who made you"],
      replies: [
        "I'm {name}, a chatbot that knows 106 chess openings. I'm named after Paul Morphy, a 19th-century American who played fast, attacking chess.",
        "I'm {name}! I explain chess openings: the moves, the ECO code and the big idea behind each one."
      ]
    },
    {
      topic: "help",
      keywords: ["help", "what can you do", "how does this work", "what do you know", "what should i ask"],
      replies: [
        "Name an opening (\"the French\") or a variation (\"the Najdorf\") and I'll give you the moves and the plan. You can ask for an opening's variations, open any line on Lichess, and save openings to your wishlist."
      ]
    },
    {
      topic: "players",
      keywords: ["magnus", "carlsen", "kasparov", "fischer", "best player", "world champion", "grandmaster"],
      replies: [
        "Great players, but I'm an openings specialist! Ask me what they play, like the Ruy Lopez or the Najdorf.",
        "I'll leave the players to the history books. I only know openings, but I know them well."
      ]
    },
    {
      topic: "goodbye",
      keywords: ["bye", "goodbye", "see you", "cya", "good night"],
      replies: [
        "Bye! Your wishlist will be here when you come back.",
        "See you! Go play some games with what you've learned."
      ]
    }
  ],

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
  //finding the best-scoring item in any list------------------------
  //items: any array of objects that each have a keywords array
  //(opening families, variations, small talk topics...)
  findBest(items, question) {
    //clean the question, then break it into an array of words
    const cleaned = this.normalize(question);
    const words = cleaned.split(" ");

    //tracking the winner, OUTSIDE the loop so it's remembered
    let best = null;  //nothing found yet
    let bestScore = 0;

    for (let item of items) {
      const score = this.scoreKeywords(item.keywords, cleaned, words);

      //uses > so on a tie, the earlier item stays the winner
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    //the winning item, or null if nothing scored above 0
    return best;
  },

  //finding the matching opening family (now just one line)
  findMatch(question) {
    return this.findBest(this.knowledge, question);
  },

  //finding the matching variation inside a family (also one line)
  findVariation(family, question) {
    return this.findBest(family.variations, question);
  },


  //working out exactly which opening a question is about------------
  //this is the family + variation + title logic that used to sit in
  //the middle of ask. it moves into its own method because TWO things
  //need it now: answering a question, and adding to the wishlist
  //(where "najdorf" has to become "Sicilian Defense: Najdorf Variation")
  //
  //returns an object with three properties, or null if nothing matched:
  //  family  - the family card
  //  opening - the card to talk about (the variation if one matched,
  //            otherwise the family itself)
  //  title   - the full display name
  lookup(question) {
    const family = this.findMatch(question);

    if (family === null) {
      return null; //not an opening morphy knows
    }

    const variation = this.findVariation(family, question);

    //no specific variation, so we're talking about the family
    if (variation === null) {
      return {
        family: family,
        opening: family,
        title: family.name
      };
    }

    //a variation matched
    return {
      family: family,
      opening: variation,
      title: family.name + ": " + variation.name
    };
  },
  //returning an object like { family: ..., opening: ..., title: ... }
  //is how a method hands back SEVERAL values at once. you build the
  //object right there in the return, the same way you write knowledge
  //cards, and whoever calls lookup reads found.title, found.opening etc.


  //picking a few random items from an array-------------------------
  //pickRandom(["a", "b", "c", "d"], 2) might give ["c", "a"]
  //used for small talk replies and for suggestion chips
  pickRandom(items, count) {
    const pool = items.slice(); //.slice() with nothing inside makes a COPY,
                                //so we never damage the original array
    const picked = [];

    //keep picking until we have enough, or the pool runs out
    while (picked.length < count && pool.length > 0) {
      //a random position in the pool: the same Math.random trick as
      //your random pattern homework, scaled up to the pool's length
      const index = Math.floor(Math.random() * pool.length);

      //.splice(index, 1) cuts ONE item out of the pool at that position
      //and hands it back inside an array, so [0] gets the item itself.
      //cutting it out means the same item can't be picked twice
      picked.push(pool.splice(index, 1)[0]);
    }

    return picked;
  },

  //finding the matching small talk topic----------------------------
  //uses findBest from piece 1, just with a different list
  findSmallTalk(question) {
    return this.findBest(this.smallTalk, question);
  },
  //a while loop is a for loop without the counting: it keeps going as
  //long as its condition is true. here: "fewer than count picked AND
  //something still left to pick from"
//-----------------------------------------------------------------


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
