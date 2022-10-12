var number = 7;
var initial = 500;
var chips = [0];
var bets = [[0], [0], [0], [0], [0]];
var round = 0, betting = 0;
var small = 5, large = 10, smallPlayer = 2, bigPlayer = 1;
var dealer = 0, turn = 0, isFirst = true, ch = [0], keep = false;
var now = 0;
var isfold = [false];

var playerList = document.querySelectorAll(".player");
var chipsList = document.querySelectorAll(".chips");
var tableList = document.querySelectorAll(".table");
var buttonList = document.querySelectorAll(".button");

function draw() {
    for (var i = 1; i <= number; i++) {
        if (i == dealer) playerList.item(i).style.color = "blue";
        else playerList.item(i).style.color = "black";
        if (i == turn) playerList.item(i).style.backgroundColor = "gray";
        else playerList.item(i).style.backgroundColor = "white";
        if (isfold[i]) playerList.item(i).style.setProperty("text-decoration", "line-through");
    }

    for (var i = 1; i <= number; i++) {
        chipsList.item(i).innerHTML = chips[i];
    }
    for (var i = 1; i <= number; i++) {
        bets[0][i] = 0;
        for (var j = 1; j <= betting; j++) bets[0][i] = bets[0][i] + bets[j][i];
        chipsList.item(i + 8).innerHTML = bets[0][i];
    }

    for (var i = 1; i <= number; i++) {
        for (var j = 1; j <= betting; j++) tableList.item(i + 8 * j - 8).innerHTML = bets[j][i];
        for (var j = betting + 1; j <= 4; j++) tableList.item(i +    8 * j - 8).innerHTML = "";
    }

    document.querySelector(".betting").innerHTML = "round " + round.toString();

    if (isFirst) buttonList.item(0).innerHTML = "check";
    else buttonList.item(0).innerHTML = "call";

    if (!keep) {
        document.querySelector("#next").disabled = false;
        for (var i = 0; i < 4; i++) buttonList.item(i).disabled = true;
    }
    else {
        document.querySelector("#next").disabled = true;
        for (var i = 0; i < 4; i++) buttonList.item(i).disabled = false;
        if (chips[turn] <= now) {
            buttonList.item(0).disabled = true;
            buttonList.item(1).disabled = true;
        }
        else {
            buttonList.item(0).disabled = false;
            buttonList.item(1).disabled = false;
        }
    }

    if (betting == 0) document.querySelector("#loan").disabled = false;
    else document.querySelector("#loan").disabled = true;
}

function next() {
    keep = true;
    isFirst = true;
    if (betting == 0) {
        for (var i = 1; i <= number; i++) {
            for (var j = 0; j <= 4; j++) bets[j][i] = 0;
        }
        dealer = dealer % number + 1;
        round = round + 1;
        betting = 1;
        smallPlayer = dealer % number + 1;
        bigPlayer = (dealer + 1) % number + 1;
        turn = bigPlayer;
        bets[1][smallPlayer] = 1 * small;
        bets[1][bigPlayer] = 1 * large;
        now = 1 * large;
    }
    else if (0 < betting && betting < 4) {
        turn = smallPlayer;
        betting++;
        now = 0;
        for (var i = 1; i <= number; i++) ch[i] = 0;
    }
    else if (betting >= 4) {
        keep = false;
        var val = 1 * document.querySelector("input").value;
        if (val == '') {
            alert("winner error");
        }
        else {
            document.querySelector("input").value = '';
            var cnt = 0, iswin = [false];
            for (var i = 1; i <= number; i++) iswin.push(false);
            while (val > 0) {
                cnt++;
                iswin[val % 10] = true;
                val = (val - val % 10) / 10;
            }
            for (var i = 1; i <= number; i++) {
                if (iswin[i]) {
                    for (var j = 1; j <= number; j++) {
                        if (bets[0][i] * cnt < bets[0][j]) {
                            chips[i] = chips[i] + bets[0][i];
                            chips[j] = chips[j] - bets[0][i];
                        }
                        else {
                            chips[i] = chips[i] + bets[0][j] / cnt;
                            chips[j] = chips[j] - bets[0][j] / cnt;
                        }
                    }
                }
                isfold[i] = false;
            }
            betting = 0;
        }
    }
    draw();
}

function turnChange() {
    var starter = turn;
    ch[turn] = 1;
    do {
        turn = turn % number + 1;
        if (starter == turn) break;
    } while (isfold[turn] || chips[turn] == bets[turn]);

    if (starter == turn) {
        betting = 4;
        keep = false;
    }
    else {
        var cnt = number;
        for (var i = 1; i <= number; i++) {
            if (isfold[i] || chips[i] == bets[betting][i]) cnt--;
        }
        if (cnt == 0) {
            betting = 4;
            keep = false;
        }
        else {
            keep = false;
            for (var i = 1; i <= number; i++) {
                if (isfold[i] || chips[i] == bets[betting][i]) continue;
                if (bets[betting][i] == now && ch[i] == 1) continue;
                keep = true;
            }
        }
    }
    isFirst = false;
}

function check() {
    bets[betting][turn] = now;
    turnChange();
    draw();
}

function raise() {
    var val = 1 * document.querySelector("input").value;
    if (val == '' || val <= 0 || now + val > chips[turn]) alert("raise error");
    else {
        document.querySelector("input").value = '';
        now = now + val;
        bets[betting][turn] = now;
        turnChange();
        draw();
    }
}

function allin() {
    bets[betting][turn] = chips[turn];
    now = Math.max(now, bets[betting][turn]);
    turnChange();
    draw();
}

function fold() {
    isfold[turn] = true;
    turnChange();
    draw();
}

function loan() {
    var val = 1 * document.querySelector("input").value;
    if (val == '') alert("loan error");
    else {
        document.querySelector("input").value = '';
        var t = parseInt(Math.log10(val).toString());
        var amount = val % Math.pow(10, t - 1);
        val = (val - amount) / Math.pow(10, t - 1);
        var receiver = val % 10;
        var giver = (val - val % 10) / 10;
        chips[giver] = chips[giver] - amount;
        chips[receiver] = chips[receiver] + amount;
    }
    draw();
}

function start() {
    for (var i = 1; i <= number; i++) chips.push(initial);
    for (var i = 1; i <= number; i++) for (var j = 0; j <= 4; j++) bets[j].push(0);
    for (var i = 1; i <= number; i++) isfold.push(false);
    for (var i = 1; i <= number; i++) ch.push(0);
    draw();
}