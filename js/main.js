var questions;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {//Retrieve all the questions
  if (this.readyState == 4 && this.status == 200) {
   questions = JSON.parse(this.responseText);
   displayQuestion(0);
  }
};
xhttp.open("GET", "questions.json", true);
xhttp.send();


const answers = [];

const card = document.getElementById("card");

function displayQuestion(id){
  const questionContainer = document.getElementById("question");
  questionContainer.innerHTML = "";

  const question = questions[id];

  const title = document.createElement("h2");
  title.innerHTML = question.title;

  //const altContainer = document.getElementById("altContainer");
  const altContainer = document.createElement("div");
  altContainer.classList.add("alt-container");
  altContainer.setAttribute('data-question-id', question.id);



  for(let i = 0; i < question.alternatives.length; i++){
    let alternative = document.createElement("button");

    alternative.setAttribute('data-id', question.alternatives[i].id);
    alternative.innerHTML = question.alternatives[i].text;

    alternative.addEventListener("click",clickAlt);
    altContainer.appendChild(alternative);
  }

  questionContainer.appendChild(title);
  questionContainer.appendChild(altContainer);

  resize();
}

function clickAlt(event){
  event.target.parentNode.classList.add("disapear");
  event.target.parentNode.parentNode.childNodes[0].classList.add("disapear");

  const questionId = event.target.parentNode.getAttribute('data-question-id');
  const answerId = event.target.getAttribute('data-id');

  var answer = {
    questionId : questionId,
    answerId : answerId,
    answerText : event.target.innerHTML,
    correct : answerCheck(questionId,answerId)
  };

  if(!answered(questionId)){
    answers.push(answer);
  }

  setTimeout(function(){
    newQuestion(questionId);
  },250);
}


function answerCheck(questionId,answerId){
  for(let i = 0; i < questions.length; i++){

    if(questions[i].id == questionId){ //Find the right question
      for(let x = 0; x < questions[i].answer.length; x++){
        if(questions[i].answer[x] == answerId){ //Check the answer
          return true;
        }
      }
      return false;

    }

  }
  return;
}


function answered(questionId){

  for(let i = 0; i < answers.length; i++){

    if(answers[i].questionId == questionId){ //See if question has been answered already
      return true;
    }

  }

  return false;
}

function newQuestion(questionId){
  if(answers.length === questions.length){//If all the questions have been answered
    showResult();
    return;
  }

  displayQuestion(++questionId);//Go to next question
}

function showResult(){
  document.getElementById("question").innerHTML = "";

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";
  let heading = document.createElement("h3");
  heading.innerHTML = "Your results";
  resultContainer.appendChild(heading);

  let retryButton = document.createElement("a");
  retryButton.classList.add("button")
  retryButton.href= "index.html"
  retryButton.innerHTML = "Try again?"

  let correctAnswers = document.createElement("p");
  resultContainer.appendChild(correctAnswers);


  let correctAnswerCount = 0;

  for(let i = 0; i < answers.length; i++){
    correctAnswerCount = answers[i].correct ? ++correctAnswerCount : correctAnswerCount;

    let container = document.createElement("div");
    container.classList.add("question-result");

    container.classList.add(answers[i].correct ? "correct" : "wrong");

    let title = document.createElement("h4");
    title.innerHTML = questions[i].title;
    let choice = document.createElement("p");
    choice.innerHTML = "<i>“" + answers[i].answerText + "” </i> was " + (answers[i].correct ? "correct." : "wrong.");

    container.appendChild(title);
    container.appendChild(choice);

    resultContainer.appendChild(container);

    correctAnswers.innerHTML = "You scored " + correctAnswerCount + "/" + answers.length + ".";
  }

  resultContainer.appendChild(retryButton);

  resize();

}

window.onresize = function(event) {
  resize();
};

function resize(){
  card.style.height = document.getElementById("container").offsetHeight + "px";
}
