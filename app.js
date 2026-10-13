//page code for morphy: forms, validation, cards, chips, wishlist
//the chat---------------------------------------------------------
const messageList = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question");
const sendButton = document.getElementById("send-button");

//the wishlist-----------------------------------------------------
const wishlistPanel = document.getElementById("wishlist");
const wishlistToggle = document.getElementById("wishlist-toggle"); //header button (phones)
const wishlistClose = document.getElementById("wishlist-close");   //x inside the panel (phones)
const wishlistForm = document.getElementById("wishlist-form");
const wishlistInput = document.getElementById("wishlist-input");
const wishlistItems = document.getElementById("wishlist-items");   //the <ul>
const wishlistCount = document.getElementById("wishlist-count");   //the number badge


//scrolling the chat to the newest message---------------------------
//addMessage used to do this in its last line. now four different
//things add to the chat (bubbles, cards, chips, the typing dots), so
//the line moves into its own function and they all call it
function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}
//-----------------------------------------------------------------


//checking the text before morphy ever sees it-----------------------
//returns an error message, or "" (empty string) if the text is fine.
//each rule is an early return: the first rule that fails exits with
//its message, and if we reach the bottom, every rule passed
function validateQuestion(text) {
  const trimmed = text.trim();

  //rule 1: nothing typed, or only spaces
  if (trimmed === "") {
    return "Type a question first.";
  }

  //rule 2: too short to mean anything
  //the limit is 2, not 3: with small talk, "hi" is now a real message
  if (trimmed.length < 2) {
    return "That's a bit short. Try something like \"what is the french?\"";
  }

  //rule 3: no letters at all, like "???" or "123"
  //  /[a-z]/i  means "any letter", and the i means ignore case
  //  .test() gives true if the text contains a match
  //  the ! in front flips it: "if it does NOT contain a letter"
  if (!/[a-z]/i.test(trimmed)) {
    return "I need some words to work with. Try an opening name, like \"Najdorf\".";
  }

  //rule 4: way too long, probably pasted by accident
  if (trimmed.length > 200) {
    return "That's a long one! Keep it under 200 characters.";
  }

  return ""; //passed every check
}
//the \" inside the strings is an ESCAPED quote: the backslash tells
//javascript "this quote is part of the text, not the end of the string"


//showing an error under a form------------------------------------
//input: the <input> element with the problem.
//the error <p> is created the first time it's needed (a dynamically
//created element, like the class 6 exercise asks for), and reused after
function showError(input, message) {
  const errorId = input.id + "-error"; //e.g. "question-error"
  let error = document.getElementById(errorId);

  //no error element yet, so make one
  if (error === null) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "error";
    error.setAttribute("role", "alert"); //screen readers announce it
    input.form.after(error); //every input knows its form through .form,
                             //and .after() puts the error right below it
  }

  error.textContent = message;

  //aria attributes tell assistive tech the field is invalid, and which
  //element explains why. the css also uses aria-invalid for the red border
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", errorId);

  //shake the input. adding the class starts a css animation; when the
  //animation ends we remove the class, so it can run again next time.
  //{ once: true } makes this listener remove itself after running once
  input.classList.add("shake");
  input.addEventListener("animationend", function () {
    input.classList.remove("shake");
  }, { once: true });

  input.focus(); //cursor back in the box so they can fix it
}


//removing the error once it's fixed---------------------------------
function clearError(input) {
  const error = document.getElementById(input.id + "-error");

  if (error !== null) {
    error.remove(); //takes the element off the page entirely
  }

  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
}
//-----------------------------------------------------------------
//
//why not the html "required" attribute? it would show the BROWSER'S
//own little popup instead of our message, and the assignment wants
//the errors in the page. the same goes for maxlength: it would stop
//typing at 200, so rule 4 could never show its friendly message.


//a small helper for making elements----------------------------------
//making a card means doing "createElement, set the class, set the text"
//about ten times, so that pattern gets its own function.
//makeElement("p", "card-idea", "hello") gives <p class="card-idea">hello</p>
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}
//always textContent, never innerHTML. innerHTML would treat the text
//as html, so if someone typed <img src=x onerror=...> into the chat,
//the browser would RUN it. textContent always treats it as plain text.


//the user's bubble--------------------------------------------------
function addUserMessage(text) {
  messageList.appendChild(makeElement("li", "message user", text));
  scrollToBottom();
}


//a plain text bubble from morphy--------------------------------------
function addBotText(text) {
  messageList.appendChild(makeElement("li", "message bot", text));
  scrollToBottom();
}


//an answer card for an opening--------------------------------------
//reply: an "opening" reply object from chessBot.respond (piece 3)
function addAnswerCard(reply) {
  const opening = reply.opening; //the card we're talking about

  const card = makeElement("li", "message bot card", "");

  //title line, with the ECO code as a little badge inside it
  const title = makeElement("p", "card-title", reply.title + " ");
  title.appendChild(makeElement("span", "eco", opening.eco));
  card.appendChild(title);

  //the moves, then the idea
  card.appendChild(makeElement("p", "card-moves", opening.moves));
  card.appendChild(makeElement("p", "card-idea", opening.idea));

  //a row for the two actions
  const actions = makeElement("div", "card-actions", "");

  //the lichess link: same as before, now a proper part of the card
  const link = makeElement("a", "lichess-link", "Open on Lichess ↗");
  link.href = chessBot.lichessLink(opening.moves);
  link.target = "_blank";  //new tab, so the chat isn't lost
  link.rel = "noopener";   //safety habit for new-tab links
  actions.appendChild(link);

  //the save button. the title and moves are stored ON the button as
  //data attributes, so when it's clicked (piece 9) we know what to save
  const save = makeElement("button", "save-button", "");
  save.type = "button"; //a plain button, not a form submit
  save.dataset.title = reply.title;   //becomes data-title="..." in the html
  save.dataset.moves = opening.moves; //becomes data-moves="..."
  actions.appendChild(save);

  card.appendChild(actions);
  messageList.appendChild(card);

  updateSaveButtons(); //sets this button's text: saved or not (piece 8)
  scrollToBottom();
}
//dataset: any attribute written data-something="..." in html shows up
//in javascript as element.dataset.something. it's a way to attach your
//own information to an element. here: "this button saves THIS opening"


//picking how to show a reply----------------------------------------
//openings get a card, everything else gets a plain bubble
function addBotReply(reply) {
  if (reply.kind === "opening") {
    addAnswerCard(reply);
  } else {
    addBotText(reply.text);
  }
}


//suggestion chips under morphy's reply------------------------------
//chips: an array of { label, question } from chessBot.suggestions
//each chip is a <button> whose question is stored in data-question
function addChips(chips) {
  if (chips.length === 0) {
    return; //nothing to suggest
  }

  const row = makeElement("li", "chips", "");
  row.setAttribute("aria-label", "Suggestions");

  for (let chip of chips) {
    const button = makeElement("button", "chip", chip.label);
    button.type = "button";
    button.dataset.question = chip.question;
    row.appendChild(button);
  }

  messageList.appendChild(row);
  scrollToBottom();
}


//removing old chips before a new question---------------------------
//so only the latest suggestions are ever on screen.
//querySelectorAll finds EVERY element matching a css selector
//and gives back a list we can loop through
function removeChips() {
  for (let row of document.querySelectorAll(".chips")) {
    row.remove();
  }
}
//-----------------------------------------------------------------
//
//notice addAnswerCard calls updateSaveButtons, which lives in piece 8,
//further down the file. that's fine: functions written with the
//"function" keyword are available to the whole file from the start
//(this is called hoisting). const variables are NOT, which is why the
//getElementById lines in piece 4 have to come first.


//showing the dots---------------------------------------------------
//returns the element, so whoever called this can remove it later
function showTyping() {
  const bubble = makeElement("li", "message bot typing", "");
  bubble.setAttribute("aria-label", chessBot.name + " is typing");

  //three empty spans: the css turns each one into a bouncing dot
  for (let i = 0; i < 3; i++) {
    bubble.appendChild(makeElement("span", "dot", ""));
  }

  messageList.appendChild(bubble);
  scrollToBottom();
  return bubble;
}


//how long morphy "thinks" before answering----------------------------
//longer answers take a little longer, like a person typing more,
//but never under 0.4 seconds or over 1.2 seconds
function thinkingTime(reply) {
  const time = 400 + reply.text.length * 2; //in milliseconds
  return Math.min(time, 1200);              //Math.min picks the smaller number
}
//-----------------------------------------------------------------
//
//milliseconds: 1000 of them make a second. setTimeout (piece 9) and
//most javascript timing works in milliseconds.


//saving and loading-------------------------------------------------
//localStorage is a small storage area the browser keeps for each
//website. it survives refreshes and closing the tab. it can only hold
//TEXT, so the array is turned into text to save it, and back to load it:
//  JSON.stringify([{ title: "x" }])   gives   '[{"title":"x"}]'
//  JSON.parse('[{"title":"x"}]')      gives   [{ title: "x" }]
const storageKey = "morphy-wishlist";

function loadWishlist() {
  //try/catch: if anything inside "try" throws an error (private
  //browsing can block storage, or the saved text could be broken),
  //javascript jumps to "catch" instead of crashing the whole page
  try {
    const saved = localStorage.getItem(storageKey); //null if nothing saved yet
    if (saved === null) {
      return [];
    }
    return JSON.parse(saved);
  } catch (error) {
    return []; //start with an empty list rather than breaking
  }
}

function saveWishlist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  } catch (error) {
    //storage blocked: the list still works until the page is refreshed
  }
}

//the wishlist itself, loaded once when the page starts.
//let, not const, because removing an item replaces the whole array
let wishlist = loadWishlist();


//checking whether an opening is already saved-----------------------
function isSaved(title) {
  for (let item of wishlist) {
    if (item.title === title) {
      return true; //found it, no need to keep looking
    }
  }
  return false;
}


//adding and removing------------------------------------------------
function addToWishlist(title, moves) {
  if (isSaved(title)) {
    return; //already there, nothing to do
  }

  wishlist.push({ title: title, moves: moves });
  saveWishlist();
  renderWishlist(title); //pass the title so the new item gets highlighted

  //a little "bump" animation on the count, same trick as the error shake
  wishlistCount.classList.add("bump");
  wishlistCount.addEventListener("animationend", function () {
    wishlistCount.classList.remove("bump");
  }, { once: true });
}

function removeFromWishlist(title) {
  //build a new array of everything EXCEPT the one being removed
  const kept = [];
  for (let item of wishlist) {
    if (item.title !== title) {
      kept.push(item);
    }
  }

  wishlist = kept;
  saveWishlist();
  renderWishlist();
}


//drawing the panel from the array-----------------------------------
//newTitle is optional: if given, that item gets a highlight class
function renderWishlist(newTitle) {
  wishlistItems.textContent = ""; //empty the <ul>: clearing its text
                                  //removes every element inside it too

  //nothing saved: show a hint instead of an empty box
  if (wishlist.length === 0) {
    wishlistItems.appendChild(makeElement("li", "wishlist-empty",
      "Nothing saved yet. Tap \"Save to wishlist\" on any answer, or add one above."));
  }

  for (let item of wishlist) {
    const row = makeElement("li", "wishlist-item", "");
    if (item.title === newTitle) {
      row.classList.add("just-added");
    }

    //the name is a button: clicking it asks morphy about the opening again
    const name = makeElement("button", "wishlist-ask", item.title);
    name.type = "button";
    name.dataset.title = item.title;
    row.appendChild(name);

    const link = makeElement("a", "wishlist-board", "Board ↗");
    link.href = chessBot.lichessLink(item.moves);
    link.target = "_blank";
    link.rel = "noopener";
    row.appendChild(link);

    const remove = makeElement("button", "wishlist-remove", "×");
    remove.type = "button";
    remove.dataset.title = item.title;
    remove.setAttribute("aria-label", "Remove " + item.title); //"×" alone means nothing to a screen reader
    row.appendChild(remove);

    wishlistItems.appendChild(row);
  }

  wishlistCount.textContent = wishlist.length;
  updateSaveButtons();
}


//keeping the chat's save buttons honest-----------------------------
//if you remove the najdorf from the panel, the najdorf card in the chat
//should go back to "Save to wishlist". so every change rechecks every button
function updateSaveButtons() {
  for (let button of document.querySelectorAll(".save-button")) {
    if (isSaved(button.dataset.title)) {
      button.textContent = "★ Saved";
      button.disabled = true;
    } else {
      button.textContent = "☆ Save to wishlist";
      button.disabled = false;
    }
  }
}


//the wishlist's own form, with its own validation---------------------
wishlistForm.addEventListener("submit", function (event) {
  event.preventDefault(); //stop the page from reloading

  const text = wishlistInput.value;

  //working out what's wrong, if anything. each check only runs if the
  //ones before it passed (problem is still "")
  let problem = "";
  let found = null;

  if (text.trim() === "") {
    problem = "Type an opening name first.";
  } else {
    problem = validateQuestion(text); //the same rules as the chat (piece 5)
  }

  if (problem === "") {
    found = chessBot.lookup(text); //"najdorf" -> the full Najdorf object

    if (found === null) {
      problem = "I don't know an opening called \"" + text.trim() + "\". Try a name like \"Caro-Kann\" or \"Najdorf\".";
    } else if (isSaved(found.title)) {
      problem = found.title + " is already on your list.";
    }
  }

  if (problem !== "") {
    showError(wishlistInput, problem);
    return; //stop here: nothing gets added
  }

  clearError(wishlistInput);
  addToWishlist(found.title, found.opening.moves);
  wishlistInput.value = "";
});
//"else if" chains checks: only one of them can run. if found is null
//we never ask whether it's saved, which would crash on null.title


//clearing the wishlist error as soon as they start fixing it
wishlistInput.addEventListener("input", function () {
  clearError(wishlistInput);
});


//clicks inside the list (one listener for every row)----------------
//rows are created and destroyed all the time, so instead of adding a
//listener to each button, ONE listener sits on the whole <ul>. a click
//on any button inside it "bubbles up" to the <ul>, and event.target
//says what was actually clicked. this is called event delegation:
//the list click example in your class 5 notes.
wishlistItems.addEventListener("click", function (event) {
  //closest(".x") walks up from the clicked element to find the
  //nearest element with that class (itself counts), or gives null.
  //it's needed because the click might land on text INSIDE a button
  const remove = event.target.closest(".wishlist-remove");
  if (remove !== null) {
    removeFromWishlist(remove.dataset.title);
    return;
  }

  const ask = event.target.closest(".wishlist-ask");
  if (ask !== null) {
    setWishlistOpen(false); //on phones, close the panel to show the answer
    askQuestion(ask.dataset.title); //piece 9
  }
});


//opening and closing the panel (on phones)------------------------
//on a wide screen the css always shows the panel beside the chat, and
//hides these buttons. on a phone it slides in over the chat
function setWishlistOpen(isOpen) {
  //toggle with a second argument: add the class if true, remove if false
  wishlistPanel.classList.toggle("open", isOpen);
  wishlistToggle.setAttribute("aria-expanded", isOpen);
}

wishlistToggle.addEventListener("click", function () {
  const isOpen = wishlistPanel.classList.contains("open");
  setWishlistOpen(!isOpen); //flip it
});

wishlistClose.addEventListener("click", function () {
  setWishlistOpen(false);
});

//the escape key closes it too. "keydown" fires for every key press,
//and event.key says which key it was
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setWishlistOpen(false);
  }
});
//-----------------------------------------------------------------


//true while morphy is "typing", so nobody can send twice at once
let isThinking = false;


//asking morphy a question-------------------------------------------
function askQuestion(text) {
  if (isThinking) {
    return; //still answering the last one
  }

  //validation first: morphy never sees a bad question (piece 5)
  const problem = validateQuestion(text);
  if (problem !== "") {
    showError(questionInput, problem);
    return;
  }
  clearError(questionInput);

  //the question is fine: show it, and clear the way for the answer
  removeChips();
  addUserMessage(text.trim());
  questionInput.value = "";

  //work out the reply now, but show the typing dots for a moment first
  const reply = chessBot.respond(text);
  const typing = showTyping();

  isThinking = true;
  sendButton.disabled = true;

  //setTimeout(function, milliseconds) runs the function ONCE, after the
  //wait. everything else on the page keeps working in the meantime
  setTimeout(function () {
    typing.remove();                           //dots gone
    addBotReply(reply);                        //card or bubble (piece 6)
    addChips(chessBot.suggestions(reply));     //what to ask next

    isThinking = false;
    sendButton.disabled = false;
    questionInput.focus();
  }, thinkingTime(reply));
}


//the chat form--------------------------------------------------------
chatForm.addEventListener("submit", function (event) {
  event.preventDefault(); //stop the page from reloading
  askQuestion(questionInput.value);
});

//clearing the error as soon as they start typing again.
//"input" fires on every change to the box: each key, a paste, a delete
questionInput.addEventListener("input", function () {
  clearError(questionInput);
});


//clicks inside the chat (one listener for the whole list)------------
//the same event delegation as the wishlist (piece 8): chips and save
//buttons are created all the time, so one listener on the <ul> handles them
messageList.addEventListener("click", function (event) {
  const chip = event.target.closest(".chip");
  if (chip !== null) {
    askQuestion(chip.dataset.question);
    return;
  }

  const save = event.target.closest(".save-button");
  if (save !== null) {
    addToWishlist(save.dataset.title, save.dataset.moves);
  }
});


//starting up--------------------------------------------------------
//draw the saved wishlist, then morphy says hello with starter chips
renderWishlist();
addBotText(chessBot.introduce());
addChips(chessBot.suggestions({ kind: "start" }));
questionInput.focus();
//-----------------------------------------------------------------
//
//console version, as described in the assignment (still works, because
//ask still returns a plain string):
//let question = prompt("Ask Morphy about an opening");
//console.log(chessBot.ask(question));
