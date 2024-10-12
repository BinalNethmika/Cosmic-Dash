/* 

Project - Cosmic Dash
Author - B.S.M Binal Nethmika
License - MIT
Version - 1.0.0v
latest update - 2024/1/10


© CopyRight reserved, 2024

*/

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const ctx = canvas.getContext("2d");

//IMG, MP3 load
var alien = new Image();
alien.src = "./path/alien.png";

var heart = new Image();
heart.src = "./path/heart.png";

var Emptyheart = new Image();
Emptyheart.src = "./path/empty-heart.png";

var backgroundMis = new Audio("./path/background.mp3");

//collision
function BoxCollisionCheck(a, b) {
  return (
    a.x + a.width >= b.x &&
    a.x <= b.x + b.width &&
    a.y + a.height >= b.y &&
    a.y <= b.y + b.height
  );
}

//Game Props
var mapXvelocity = -7; //map -x velocity
var score = 0; //player score
var isLost = false; //player lost check
var SoundCounterLost = 0;
var live = 4; //player heart count
var isGameStarted = false;
var NoLives = false; //check player has no hearts left
var isEndScreen = false; //show end-screen if player have no hearts left
var collisionArr = []; //brick array
var boxSideSize = 64; //brick width, height size

// layer props
const player = {
  x: canvas.width / 4, //player x
  y: 0, //player y
  width: boxSideSize, //player width
  height: boxSideSize, //player height
  velocityY: 0, //player Y velocity
  gravity: 0.74, //map gravity
  lift: -10, //player jump lift
};

function collisionLayer() {
  var topBrick = {
    x: canvas.width / 2,
    y: Math.round((Math.random() * -canvas.height) / 2),
    width: boxSideSize,
    height: canvas.height / 2,
    passed: false,
    border: "#898",
  };
  var bottomBrick = {
    x: canvas.width / 2,
    y: 0,
    width: boxSideSize,
    height: canvas.height,
    passed: false,
    border: "#898",
  };

  if (!isLost && !NoLives && !isEndScreen && mapXvelocity != 0) {
    collisionArr.push(topBrick, bottomBrick);
  }

  topBrick.x += boxSideSize * 3 * collisionArr.length;
  bottomBrick.x += boxSideSize * 3 * collisionArr.length;

  bottomBrick.y = topBrick.y + topBrick.height + canvas.height / 3;
}

//check for high total scores
function Hicalc() {
  if (localStorage.getItem("HI")) {
    if (isLost && NoLives && isEndScreen) {
      if (
        Number(localStorage.getItem("totalCount")) >
        Number(localStorage.getItem("HI"))
      ) {
        localStorage.setItem("HI", localStorage.getItem("totalCount"));
        return;
      }
      return;
    }
  } else {
    localStorage.setItem("HI", localStorage.getItem("totalCount"));
    return;
  }
  return;
}

//player jump
function PlayerJumpCTRL() {
  // Apply gravity
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Prevent falling through the ground
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }
}

function jump() {
  player.velocityY = player.lift;
}

if (!isLost) {
  window.addEventListener("keydown", (event) => {
    if (event.code == "Space" && !isEndScreen) {
      if (!isLost) {
        jump();
      }
      backgroundMis.play();
    }

    //player stop from screen off
    if (player.y <= 0 || player.y >= canvas.height) {
      player.y = 0;
    }
  });
}

function ScorePannel() {
  //drawing hearts
  for (var i = 0; i < Number(localStorage.getItem("live")) + 1; i++) {
    ctx.drawImage(heart, 20 + 28 * i, 20, 22, 22);
  }
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.font = `80px monospace`;
  ctx.fillText(score, 20, 140);
  return;
}

function StartPannel() {
  if (!isGameStarted) {
    ctx.drawImage( alien, canvas.width / 2 - ( (boxSideSize * 2) / 2) , canvas.height / 2 - ( (boxSideSize * 4) / 2), boxSideSize * 2, boxSideSize * 2)
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "50px monospace";
    ctx.fillText(
      "Press 'Space' key to start",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
    ctx.font = "20px monospace";
    ctx.fillText(
      "Press 'H' for Instuctions",
      canvas.width / 2,
      canvas.height / 2 + 90
    );
  }
}

//hearts check
var livecounter = setInterval(() => {
  if (!NoLives) {
    if (localStorage.getItem("live")) {
      if (isLost) {
        if (localStorage.getItem("live") == 0) {
          NoLives = true;
          localStorage.setItem("live", live);
        } else {
          var realHearts = localStorage.getItem("live") - 1;
          localStorage.setItem("live", realHearts);
          clearInterval(livecounter);
        }
      }
    } else {
      localStorage.setItem("live", live);
    }
  }
}, 10);

function EndScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    Emptyheart,
    canvas.width / 2 - 32,
    canvas.height / 2 - 180,
    boxSideSize,
    boxSideSize
  );
  ctx.fillStyle = "#fff";
  ctx.font = " 40px monospace";
  ctx.textAlign = "center";
  ctx.fillText("You Lost", canvas.width / 2, canvas.height / 2 - 35);
  ctx.font = "100px monospace";
  ctx.fillText(
    localStorage.getItem("totalCount"),
    canvas.width / 2,
    canvas.height / 2 + 70
  );
  ctx.font = "20px monospace";
  ctx.fillText(
    `HI - ${localStorage.getItem("HI")}`,
    canvas.width / 2,
    canvas.height / 2 + 100
  );
}

function update() {
  //layer clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isGameStarted) {
    PlayerJumpCTRL();
    collisionLayer();

    collisionArr.forEach((box, i) => {
      box.x += mapXvelocity;
      ctx.fillStyle = box.border;
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = "#010";
      ctx.fillRect(box.x + 5, box.y + 5, box.width - 10, box.height - 10);
      if (!box.passed && player.x > box.x + box.width) {
        score += 0.5;
        box.passed = true;
      }
      if (BoxCollisionCheck(box, player)) {
        box.border = "#f77";
        mapXvelocity = 0;
        isLost = true;
        if (isLost && SoundCounterLost == 0) {
          if (localStorage.getItem("live") == 0) {
            isEndScreen = true;
          }
          if (localStorage.getItem("totalCount")) {
            var total = Number(localStorage.getItem("totalCount")) + score;
            localStorage.setItem("totalCount", total);
            Hicalc();
          } else {
            localStorage.setItem("totalCount", 0);
          }
          if (isLost && !isEndScreen) {
            new Audio("./path/lost.mp3").play();
            var LostpageReload = setInterval(() => {
              location.reload();
            }, 1500);
          }
          SoundCounterLost++;
        }
      }
    });

    ScorePannel();

    //player layer
    ctx.drawImage(alien, player.x, player.y, player.width, player.height);
  }

  if (isEndScreen) {
    EndScreen();
  }
  if (!isEndScreen) {
    StartPannel();
  }
  requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
  if (isEndScreen && isLost) {
    if (e.code == "KeyR") {
      location.reload();
      localStorage.setItem("totalCount", 0);
      return;
    }
    return;
  }
});
window.addEventListener("keydown", (e) => {
  if (e.code == "Space" && !isEndScreen) {
    isGameStarted = true;
  }
});

if (!isLost && !isEndScreen) {
  update();
}

// conrtole pannel
const DashBoard = document.getElementById("ctrlDash");
DashBoard.hidden = true;

window.addEventListener("keydown", (e) => {
  if (e.key == "Control") {
    if (DashBoard.hidden) {
      DashBoard.hidden = false;
    } else if (!DashBoard.hidden) {
      DashBoard.hidden = true;
    }
  }
});

const reset_HI = document.getElementById("reset-hi");
const reset_heart = document.getElementById("reset-heart");
const reset_total = document.getElementById("reset-total");
const mapXvelocityInput = document.getElementById("MapXvelo");

reset_HI.addEventListener("click", () => {
  localStorage.setItem("HI", 0);
});
reset_heart.addEventListener("click", () => {
  localStorage.setItem("live", live);
});
reset_total.addEventListener("click", () => {
  localStorage.setItem("totalCount", 0);
});


//help pannel
const Instructions = document.getElementById("help");
Instructions.hidden = true;

window.addEventListener("keydown", (e) => {
  if (e.key == "h") {
    if (Instructions.hidden) {
      Instructions.hidden = false;
    } else if (!Instructions.hidden) {
      Instructions.hidden = true;
    }
  }
});
