var loaded = false;
window.addEventListener("load", function() {loaded = true;});
var defaultBorder = "0px solid red";
var questionBorder = "10px solid red";
var inputBorder = "10px solid yellow";
var questionIndex = -1;
var questions;
var ITYPES = {
  RADIO: 0,
  SELECT: 1,
  TEXT: 2
};
var MODES = {
  NORMAL: 0,
  INSERT: 1
};
var mode = MODES.NORMAL;

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

function itypeof(question)
{
  if(question.tagName === "SELECT")
    return ITYPES.SELECT;
  if(question.type === "radio")
    return ITYPES.RADIO;
  if(question.type === "text")
    return ITYPES.TEXT;
}

function defaultInput()
{
  var q = questions[questionIndex];
  q.inputs[q.index].elem.style.outline = defaultBorder;
}

function highlightInput()
{
  var q = questions[questionIndex];
  q.inputs[q.index].elem.style.outline = inputBorder;
}

function defaultQuestion()
{
  var q = questions[questionIndex];
  q.style.border = defaultBorder;
  defaultInput();
}

function highlightQuestion()
{
  var q = questions[questionIndex];
  q.style.border = questionBorder;
  highlightInput();
}

function setup()
{
  questions = document.getElementsByClassName("question");
  console.log(questions);
  questionIndex = 0;
  for(var i = 0; i < questions.length; i++)
  {
    questions[i].inputs = [];
    questions[i].index = 0;
    var inputs = questions[i].getElementsByClassName("question_input"); 
    for(var j = 0; j < inputs.length; j++)
    {
      inputs[j].style.border = defaultBorder;
      questions[i].inputs.push({type: itypeof(inputs[j]), elem: inputs[j]});
      if(itypeof(inputs[j]) == ITYPES.RADIO && inputs[j].checked)
        questions[i].index = j;
    }
    defaultQuestion();
  }
  highlightQuestion();
  center();
}
function nextResponse()
{
  defaultInput();
  questions[questionIndex].index++;
  var q = questions[questionIndex];
  if(q.index === q.inputs.length)
    questions[questionIndex].index = 0;
  highlightInput();

  q = questions[questionIndex];

  if(q.inputs[q.index].type === ITYPES.RADIO)
    q.inputs[q.index].elem.click();
}
function previousResponse()
{
  defaultInput();
  questions[questionIndex].index--;
  var q = questions[questionIndex];
  if(q.index === -1)
    questions[questionIndex].index = q.inputs.length - 1;
  highlightInput();

  q = questions[questionIndex];

  if(q.inputs[q.index].type === ITYPES.RADIO)
    q.inputs[q.index].elem.click();
}
function nextQuestion()
{
  defaultQuestion();
  questionIndex++;
  if(questionIndex === questions.length)
    questionIndex = 0;
  highlightQuestion();
  center();
}
function previousQuestion()
{
  defaultQuestion();
  questionIndex--;
  if(questionIndex === -1)
    questionIndex = questions.length - 1;
  highlightQuestion();
  center();
}

function nextOption()
{
  var q = questions[questionIndex];
  var input = q.inputs[q.index];
  if(input.type !== ITYPES.SELECT)
    return;
  var l = input.elem.options.length;
  if(input.elem.selectedIndex === l - 1)
    input.elem.selectedIndex = 0;
  else
    input.elem.selectedIndex++;
}

function previousOption()
{
  var q = questions[questionIndex];
  var input = q.inputs[q.index];
  if(input.type !== ITYPES.SELECT)
    return;
  var l = input.elem.options.length;
  input.elem.selectedIndex--;
  if(input.elem.selectedIndex === -1)
    input.elem.selectedIndex = l - 1;
}

function submitQuiz()
{
  // document.getElementById("submit_quiz_button").click();
}
function chooseInput(i)
{
  var q = this.questions[questionIndex];
  if(i < 0 || i >= q.inputs.length)
    return;
  defaultInput();
  questions[questionIndex].index = i;
  if(q.inputs[i].type == ITYPES.RADIO)
    q.inputs[i].elem.click();
  highlightInput();
}

window.onkeydown = function(e)
{
  switch(e.keyCode)
  {
    case 72: // H
      if(mode === MODES.NORMAL)
        previousResponse();
      else if(mode === MODES.INSERT)
        previousOption();
      break;
    case 74: // J
      if(mode === MODES.NORMAL)
        nextQuestion();
      else if(mode === MODES.INSERT)
        nextOption();

      break;
    case 75: // K
      if(mode === MODES.NORMAL)
        previousQuestion();
      else if(mode === MODES.INSERT)
        previousOption();
      break;
    case 76: // L
      if(mode === MODES.NORMAL)
        nextResponse();
      else if(mode === MODES.INSERT)
        nextOption();
      break;
    case 37: // left
      if(mode === MODES.NORMAL)
        previousResponse();
      else if(mode === MODES.INSERT)
        previousOption();
      break;
    case 40: // down
      if(mode === MODES.NORMAL)
        nextQuestion();
      else if(mode === MODES.INSERT)
        nextOption();
      break;
    case 38: // up
      if(mode === MODES.NORMAL)
        previousQuestion();
      else if(mode === MODES.INSERT)
        previousOption();
      break;
    case 39: // right
      if(mode === MODES.NORMAL)
        nextResponse();
      else if(mode === MODES.INSERT)
        nextOption();
      break;
    case 13: // Enter
      if(mode === MODES.NORMAL)
        submitQuiz();
      break;
    case 73: // I
      if(mode === MODES.NORMAL)
      {
        mode = MODES.INSERT;
        var q = questions[questionIndex];
        if(q.inputs[q.index].type === ITYPES.TEXT)
        {
          q.inputs[q.index].elem.focus();
          e.preventDefault();
        }
        // if(q.inputs[q.index].type === ITYPES.SELECT)
        // {
          // q.inputs[q.index].elem.focus();
          // e.preventDefault();
        // }
      }
      break;
    case 27: // Esc
      if(mode === MODES.INSERT)
      {
        mode = MODES.NORMAL;
        var q = questions[questionIndex];
        if(q.inputs[q.index].type === ITYPES.TEXT)
        {
          q.inputs[q.index].elem.blur();
          document.body.focus();
        }
        // if(q.inputs[q.index].type === ITYPES.SELECT)
        // {
          // q.inputs[q.index].elem.blur();
          // document.body.focus();
        // }
      }
      break;
    default:
      if(mode === MODES.NORMAL)
      {
        var i = e.keyCode - 48;
        chooseInput(i);
      }
      break;


  }
}

if(loaded){ setup(); }
else{
  window.addEventListener("load", (event) => { setup(); });
}
