var loaded = false;
window.addEventListener("load", function() {loaded = true;});
var defaultBorder = "0px solid red";
var styledBorder = "10px solid red";
var questionIndex = -1;
var responses = [];
var questions;
function yPosition(elem)
{
  return elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
}
function xPosition(elem)
{
  return elem.getBoundingClientRect().left - document.body.getBoundingClientRect().left;
}
function center()
{
  window.scrollTo(0,yPosition(questions[questionIndex]));
}
function setup()
{
  questions = document.getElementsByClassName("question");
  console.log(questions);
  questionIndex = 0;
  responseIndex = 0;
  for(var i = 0; i < questions.length; i++)
  {
    questions[i].style.border = defaultBorder;
    var inputs = questions[i].getElementsByClassName("question_input"); 
    var j = 0;
    for(; j < inputs.length && !inputs[j].checked; j++){}
    if(j != inputs.length)
    {
      responses.push( { collection: inputs, index: j } );
    }
    else
    {
      responses.push( { collection: inputs, index: 0 } );
      inputs[0].click();
    }
  }
  questions[questionIndex].style.border = styledBorder;
  center();
}
function nextResponse()
{
  responses[questionIndex].index++;
  if(responses[questionIndex].index === responses[questionIndex].collection.length)
    responses[questionIndex].index = 0;
  responses[questionIndex].collection[responses[questionIndex].index].click();
  responses[questionIndex].collection[responses[questionIndex].index].focus();
}
function previousResponse()
{
  responses[questionIndex].index--;
  if(responses[questionIndex].index === -1)
    responses[questionIndex].index = responses[questionIndex].collection.length - 1;
  responses[questionIndex].collection[responses[questionIndex].index].click();
  responses[questionIndex].collection[responses[questionIndex].index].focus();
}
function nextQuestion()
{
  questions[questionIndex].style.border = defaultBorder;
  questionIndex++;
  if(questionIndex === questions.length)
    questionIndex = 0;
  questions[questionIndex].style.border = styledBorder;
  center();

  var i = responses[questionIndex].index;
  responses[questionIndex].collection[i].click();
  responses[questionIndex].collection[i].focus();
}
function previousQuestion()
{
  questions[questionIndex].style.border = defaultBorder;
  questionIndex--;
  if(questionIndex === -1)
    questionIndex = questions.length - 1;
  questions[questionIndex].style.border = styledBorder;
  center();

  var i = responses[questionIndex].index;
  responses[questionIndex].collection[i].click();
  responses[questionIndex].collection[i].focus();
}
function submitQuiz()
{
  document.getElementById("submit_quiz_button").click();
}
function chooseResponse(i)
{
  if(i >= responses[questionIndex].collection.length)
    return;
  responses[questionIndex].index = i;
  responses[questionIndex].collection[i].click();
  responses[questionIndex].collection[i].focus();
}

window.onkeydown = function(e)
{
  var focused = document.activeElement;
  var textArea = focused.tagName === "INPUT" && focused.type === "text";
  switch(e.keyCode)
  {
    case 72: // H
      if(!textArea)
        previousResponse();
      break;
    case 74: // J
      if(!textArea)
        nextQuestion();
      break;
    case 75: // K
      if(!textArea)
        previousQuestion();
      break;
    case 76: // L
      if(!textArea)
        nextResponse();
      break;
    case 37: // left
      previousResponse();
      break;
    case 40: // down
      nextQuestion();
      break;
    case 38: // up
      previousQuestion();
      break;
    case 39: // right
      nextResponse();
      break;
    case 13: // Enter
      submitQuiz();
      break;
    default:
      var i = e.keyCode - 48;
      if(!textArea && 0 <= i <= 9)
        chooseResponse(i);
      break;


  }
}

if(loaded){ setup(); }
else{
  window.addEventListener("load", (event) => { setup(); });
}
