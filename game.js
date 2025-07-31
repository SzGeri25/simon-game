var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var highScore = localStorage.getItem("highScore") || 0;
updateHighScore();


// Frissítsd a high score szöveget
function updateHighScore() {
    $("#high-score").text("High Score: " + highScore);
    localStorage.setItem("highScore", highScore);
}

$(document).keydown(function () {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(document).click(function (event) {
    if (!started && !$(event.target).hasClass("btn")) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    playSequence();
}

function playSequence() {
    let i = 0;
    function playNext() {
        if (i < gamePattern.length) {
            let colour = gamePattern[i];
            $("#" + colour).fadeIn(100).fadeOut(100).fadeIn(100);
            playSound(colour);
            i++;
            setTimeout(playNext, 600);
        }
    }
    playNext();
}


function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            if (level > highScore) {
                highScore = level;
                updateHighScore();
            }
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong");
        $("#level-title").text("Game Over, Press Any Key to Restart");
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    $("#level-title").text("Press A Key to Start");
}

function playSound(name) {
    var audio = new Audio('sounds/' + name + '.mp3');
    audio.onerror = () => console.warn("Hangfájl nem található: " + name);
    audio.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}