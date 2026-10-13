
//setting up the bot----------------------------------------
const chessBot = {
  name: "Morphy",
  //knowledge base lives in knowledge.js and is attached here as a property
  knowledge: openingKnowledge,
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
  //opening line when the page loads (only the wording changed)
  introduce() {
    return "Hi! I'm " + this.name + ". Ask me about any of 106 chess openings, or tap a suggestion below.";
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


  //working out a reply-------------------------------------------
  //the checks run in this order, and the order matters:
  //  1. empty            - nothing to work with
  //  2. variations       - "what are the variations?" (needs memory)
  //  3. opening          - the main job
  //  4. small talk       - only if it wasn't about an opening
  //  5. unknown          - nothing matched
  respond(question) {
    //1. empty: a cancelled prompt() gives null, and normalize(null)
    //would crash, so null is checked FIRST. || means "or", and if the
    //left side is true javascript doesn't even look at the right side
    if (question === null || this.normalize(question) === "") {
      return {
        kind: "empty",
        text: "Try asking about a chess opening!"
      };
    }

    //2. a follow-up asking for a list of variations (same logic as
    //your current ask, just returning an object)
    if (this.wantsVariations(question)) {
      //use the family named in this question, or else the one from before
      let target = this.findMatch(question);
      if (target === null) {
        target = this.lastFamily;
      }

      if (target === null) {
        return {
          kind: "unknown",
          text: "Which opening? Ask me about one first, like the Sicilian, and then ask about its variations."
        };
      }

      this.lastFamily = target; //this family is now the one being discussed
      return {
        kind: "variations",
        text: this.listVariations(target),
        title: target.name,
        opening: target,
        family: target
      };
    }

    //3. an opening (lookup is in piece 1)
    const found = this.lookup(question);

    if (found !== null) {
      this.lastFamily = found.family; //remember it for follow-up questions
      return {
        kind: "opening",
        text: found.title + " (" + found.opening.eco + ")\n" +
              found.opening.moves + "\n\n" + found.opening.idea,
        title: found.title,
        opening: found.opening,
        family: found.family
      };
    }

    //4. small talk. this comes AFTER openings on purpose:
    //"hi morphy, what's the sicilian?" contains "hi", but it's really
    //an opening question, so the opening check gets the first chance
    const chat = this.findSmallTalk(question);

    if (chat !== null) {
      //pickRandom gives back an array, so [0] takes the one reply out of it
      const reply = this.pickRandom(chat.replies, 1)[0];
      return {
        kind: "smalltalk",
        text: reply.replace("{name}", this.name)
      };
    }

    //5. nothing matched. the page adds suggestion chips under this,
    //so the user isn't left at a dead end
    return {
      kind: "unknown",
      text: "Hmm, I don't know that one. I only know chess openings. Try one of these:"
    };
  },


  //the console version: just the text of the reply-----------------
  //so chessBot.ask("explain the najdorf") still works exactly as before
  ask(question) {
    return this.respond(question).text;
  },


  //suggestion chips: what could the user ask next?----------------
  //reply: an object from respond (or { kind: "start" } on page load)
  //returns an array of { label, question } objects:
  //  label    - the short text shown on the chip
  //  question - what gets asked when the chip is clicked
  //the bot only DECIDES the suggestions. drawing them is the page's job
  suggestions(reply) {
    const chips = [];

    //after an answer about an opening, or a list of its variations
    if (reply.kind === "opening" || reply.kind === "variations") {
      const family = reply.family;

      //answering about a variation: offer the family overview
      if (reply.opening !== family) {
        chips.push({ label: "Back to the " + family.name, question: "what is the " + family.name });
      }

      //offer the variations list, unless that's what we just showed
      if (reply.kind === "opening" && family.variations.length > 0) {
        chips.push({ label: "Its variations", question: "what are the variations of the " + family.name });
      }

      //a few variations to try, leaving out the one we're already on
      const others = [];
      for (let variation of family.variations) {
        if (variation !== reply.opening) {
          others.push(variation);
        }
      }

      for (let variation of this.pickRandom(others, 2)) {
        //family name + variation name, so the question finds the right
        //family first ("French Defense Exchange Variation", not just
        //"Exchange Variation", which exists in five families)
        chips.push({ label: variation.name, question: family.name + " " + variation.name });
      }

      //a family with no variations (like the london): suggest elsewhere
      if (family.variations.length === 0) {
        for (let other of this.pickRandom(this.knowledge, 2)) {
          if (other !== family) {
            chips.push({ label: other.name, question: "what is the " + other.name });
          }
        }
      }

      return chips;
    }

    //everything else (page load, small talk, unknown, empty):
    //a few popular openings to get started. the first 12 families in
    //knowledge.js are the most popular ones
    if (reply.kind === "start") {
      chips.push({ label: "What can you do?", question: "what can you do" });
    }

    for (let family of this.pickRandom(this.knowledge.slice(0, 12), 3)) {
      chips.push({ label: family.name, question: "what is the " + family.name });
    }

    return chips;
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
