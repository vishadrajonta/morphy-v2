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
