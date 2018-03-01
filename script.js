let origB;
let human;
let comp;
let level=null;

const winArr = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
  [1,4,7]
  ]
const cells = document.querySelectorAll('.cell');
const start = document.getElementById("start");
const oplay=document.getElementById("ooo"); 
const xplay=document.getElementById("xxx");
const easy=document.getElementById("easy");
const medium=document.getElementById("medium");
const hard=document.getElementById("hard");
oplay.addEventListener("click",playO);
xplay.addEventListener("click",playX);
start.addEventListener("click",startTic);
easy.addEventListener("click",easyP);
medium.addEventListener("click",mediumP);
hard.addEventListener("click",hardP);

function playO(){
  human = 'O';
  comp= 'X';
  oplay.classList.add('played');
  xplay.classList.remove('played');
}

function playX(){
  human = 'X';
  comp = 'O';
  xplay.classList.add('played');
  oplay.classList.remove('played');
 } 


function easyP(){
  level=0;
  easy.classList.add('played');
  medium.classList.remove('played');
  hard.classList.remove('played');
} 

function mediumP(){
  level=1;
  medium.classList.add('played');
  easy.classList.remove('played');
  hard.classList.remove('played');
} 

function hardP(){
  level=2;
  hard.classList.add('played');
  medium.classList.remove('played');
  easy.classList.remove('played');
} 


function startTic(){
  if ((human=='O'|| human=='X')&&level!==null){
  origB=[0,1,2,3,4,5,6,7,8];
  for(var i=0; i<9;i++){
  cells[i].innerText = '';
  cells[i].style.removeProperty('background-color');
  cells[i].addEventListener('click', huClick, false);  
  }
  oplay.removeEventListener("click",playO);
  xplay.removeEventListener("click",playX);
  easy.removeEventListener("click",easyP);
  medium.removeEventListener("click",mediumP);
  hard.removeEventListener("click",hardP);
}}

function huClick(click) {
	if (typeof origB[click.target.id] == 'number') {
	turn(click.target.id, human)
	if (!checkWin(origB, human) && !checkTie()) turn(compmove(),  comp )

	}
}

function turn(cellId, player) {
	origB[cellId] = player;
	document.getElementById(cellId).innerText = player;
	let gameEnd = checkWin(origB, player)
	if (gameEnd) gameOver(gameEnd)
}

function checkWin(board, player) {
  let plays = [];
  idx = board.indexOf(player);
  while (idx != -1) {
  plays.push(idx);
  idx = board.indexOf(player, idx + 1);
  }

  
let gameEnd = null;
 for (let i=0;i<9;i++){
   if(winArr[i].every(elem => plays.indexOf(elem) > -1)){
			gameEnd = {index: i, player: player};
			
		}    
	}
	return gameEnd;
}


function gameOver(gameEnd) {
	for (let index of winArr[gameEnd.index]) {
		document.getElementById(index).style.backgroundColor =
			gameEnd.player == human ? "#669999" : "#334d4d";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', huClick, false);
	}
oplay.addEventListener("click",playO);
xplay.addEventListener("click",playX);
easy.addEventListener("click",easyP);
medium.addEventListener("click",mediumP);
hard.addEventListener("click",hardP);
document.querySelector(".endgame .text").innerText = (gameEnd.player == human ? "You win!" : "You lose.");
}


function clean() {
return origB.filter(s => typeof s == 'number');
}

function compmove() {
  if (level==0)
  {var id = Math.floor(Math.random()*clean().length)
  return clean()[id];};
  if (level==1){if (Math.floor(Math.random()*2)==0){var id =Math.floor(Math.random()*clean().length)
  return clean()[id];} else {return minimax(origB,comp).index;}}
  if (level==2){return minimax(origB, comp).index;}
}


function checkTie() {
	if (clean().length == 0) {
		for (var i = 0; i < 9; i++) {
		cells[i].style.backgroundColor = "#94b8b8";
		cells[i].removeEventListener('click', huClick, false);
		}
oplay.addEventListener("click",playO);
xplay.addEventListener("click",playX);
easy.addEventListener("click",easyP);
medium.addEventListener("click",mediumP);
hard.addEventListener("click",hardP);
document.querySelector(".endgame .text").innerText = ("Tie Game!");    
return true;
}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = clean();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, comp)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == comp) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, comp);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === comp) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
