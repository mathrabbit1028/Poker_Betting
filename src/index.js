var number = 5;
var initial = 500;
var chips = [];
var bets = [];
var round = 0, betting = 0;
var small = 5, large = 10, smallPlayer = 2, bigPlayer = 1;
var dealer = -1, turn = -1;
var total = 0, now = 0;
var isfold = [], live = number;

var playerList = document.querySelectorAll(".player");
var chipsList = document.querySelectorAll(".chips");
var buttonList = document.querySelectorAll(".button");

function draw() {
    total = 0;
    document.querySelector(".box").innerHTML = "round " + round.toString() + " / betting #" + betting.toString();
    
    for (var i = 0; i < number; i++) {
        if (i == dealer) playerList.item(i).style.color = "blue";
        else playerList.item(i).style.color = "black";
        if (i == turn) playerList.item(i).style.backgroundColor = "gray";
        else playerList.item(i).style.backgroundColor = "white";
        if (isfold[i]) playerList.item(i).style.setProperty("text-decoration", "line-through");
    }

    for (var i = 0; i < number; i++) {
        chipsList.item(i).innerHTML = chips[i];
    }
    for (var i = 0; i < number; i++) {
        chipsList.item(i + 8).innerHTML = bets[i];
        total = total + bets[i];
    }

    for (var i = 0; i < 32; i++) {
        if (i % 8 === turn) buttonList.item(i).style.display = "inline-block";
        else buttonList.item(i).style.display = "none";
    }

    document.querySelector(".total").innerHTML = "total: " + total.toString();

    if (betting == 0 || betting == 5) document.querySelector("#next").style.display = "inline-block";
    else document.querySelector("#next").style.display = "none";
}

function next() {
    if (betting == 0) {
        dealer = (dealer + 1) % number;
        round = round + 1;
        betting = 1;
        smallPlayer = (dealer + 1) % number;
        bigPlayer = (dealer + 2) % number;
        turn = bigPlayer;
        chips[smallPlayer] = chips[smallPlayer] - round * small;
        bets[smallPlayer] = round * small;
        chips[bigPlayer] = chips[bigPlayer] - round * large;
        bets[bigPlayer] = round * large;
        now = round * large;
    }
    if (betting == 5) {
        var val = 1 * document.querySelector("input").value;
        if (val == '') alert("winner error");
        else {
            document.querySelector("input").value = '';
            var cnt = 0, iswin = [];
            for (var i = 0; i < number; i++) iswin.push(false);
            while (val > 0) {
                cnt++;
                iswin[val % 10 - 1] = true;
                val = (val - val % 10) / 10;
            }
            for (var i = 0; i < number; i++) {
                isfold[i] = false;
                bets[i] = 0;
                if (iswin[i]) chips[i] = chips[i] + (total - total % cnt) / cnt;
            }
        }
        betting = 0;
    }
    draw();
}

function gameEnd() {
    dealer = (dealer + 1) % number;
    betting = 1;
    round++;
    
}

function turnChange() {
    do {
        turn = (turn + 1) % number;
        if (betting >= 2 && turn == smallPlayer) betting++;
        if (betting == 1 && turn == bigPlayer) {
            betting++;
            turn = smallPlayer;
        }
    } while (isfold[turn]);
    if (betting == 5) {
        turn = -1;
        alert("input winner");
    }
}

function check() {
    turnChange();
    draw();
}

function call() {
    chips[turn] = chips[turn] - now + bets[turn];
    bets[turn] = now;

    turnChange();
    draw();
}

function raise() {
    var val = 1 * document.querySelector("input").value;
    if (val == '' || val <= 0) alert("raise error");
    else {
        document.querySelector("input").value = '';
        now = now + val;
        chips[turn] = chips[turn] - now + bets[turn];
        bets[turn] = now;

        turnChange();
        draw();
    }
}

function fold() {
    isfold[turn] = true;
    live--;
    if (live == 1) {
        betting = 5;
        turn = -1;
    }
    else turnChange();
    draw();
}

function start() {
    for (var i = 0; i < number; i++) chips.push(initial);
    for (var i = 0; i < number; i++) bets.push(0);
    for (var i = 0; i < number; i++) isfold.push(false);
    draw();
}