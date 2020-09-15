var canvas;
var ctx;
var output;

var WIDTH = 1200;
var HEIGHT = 800;

tileW = 20;
tileH = 20;

tileRowCount = 15;
tileColumnCount = 30;

dragok = false;

boundX = 0;
boundY = 0;

var tile = [];
for( let c = 0; c < tileColumnCount; c++) {
    tile[c]=[];
    for( let r = 0; r < tileRowCount; r++) {
        tile[c][r] = {x:c*(tileW+3), y:r*(tileH+3), state:'e'};
    }
}

tile[0][0].state = 's';
tile[tileColumnCount-1][tileRowCount-1].state = 'f';

function rect(x, y, w, h, state) {
    if(state == 's') {
        ctx.fillStyle = "green";
    }
    else if(state == 'f') {
        ctx.fillStyle = "red";
    } 
    else if(state == 'e') {
        ctx.fillStyle = "grey";
    }
    else if (state == 'w') {
        ctx.fillStyle = 'blue';
    }
    else if(state == 'x') {
        ctx.fillStyle = 'black';
    }
    else {
        ctx.fillStyle = 'yellow';
    }
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
}

function draw() {
    clear();
    for( let c = 0; c < tileColumnCount; c++) {
        for( let r = 0; r < tileRowCount; r++) {
            rect(tile[c][r].x, tile[c][r].y, tileW, tileH, tile[c][r].state);
        }
    }
}

function init() {
    canvas = document.getElementById("myCanvas");
    canvas.style = "position:absolute;left: 55%; width: 1200px; margin-left: -400px;";
    ctx = canvas.getContext("2d");
    output = document.getElementById("outcome");
    return setInterval(draw, 10);
}

function solveMaze() {
    var Xqueue = [0];
    var Yqueue = [0];

    var pathFound = false;
    
    var xLoc;
    var yLoc;

    while(Xqueue.length > 0 && !pathFound) {
        xLoc = Xqueue.shift();
        yLoc = Yqueue.shift();

        if ( xLoc > 0) {
            if(tile[xLoc-1][yLoc].state == 'f') {
                pathfound = true;
            }
            
        }
        if ( xLoc < tileColumnCount-1) {
            if(tile[xLoc+1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if ( yLoc > 0) {
            if(tile[xLoc][yLoc-1].state == 'f') {
                pathfound = true;
            }
            
        }
        if ( yLoc < tileRowCount-1) {
            if(tile[xLoc][yLoc+1].state == 'f') {
                pathFound = true;
            }
        }

        if ( xLoc > 0) {
            if(tile[xLoc-1][yLoc].state == 'e') {
                Xqueue.push(xLoc-1);
                Yqueue.push(yLoc);  
                tile[xLoc-1][yLoc].state = tile[xLoc][yLoc].state + 'l';    
            }
            
        }
        if ( xLoc < tileColumnCount-1) {
            if(tile[xLoc+1][yLoc].state == 'e') {
                Xqueue.push(xLoc+1);
                Yqueue.push(yLoc);  
                tile[xLoc+1][yLoc].state = tile[xLoc][yLoc].state + 'r';
            }
        }
        if ( yLoc > 0) {
            if(tile[xLoc][yLoc-1].state == 'e') {
                Xqueue.push(xLoc);
                Yqueue.push(yLoc-1);  
                tile[xLoc][yLoc-1].state = tile[xLoc][yLoc].state + 'u';
            }
            
        }
        if ( yLoc < tileRowCount-1) {
            if(tile[xLoc][yLoc+1].state == 'e') {
                Xqueue.push(xLoc);
                Yqueue.push(yLoc+1);  
                tile[xLoc][yLoc+1].state = tile[xLoc][yLoc].state + 'd';
            }
        }
    }

    if(!pathFound) {
        output.innerHTML = 'No Solution';
    }
    else {
        output.innerHTML = 'Solved';
        var path = tile[xLoc][yLoc].state;
        var pathLength = path.length;
        var currX = 0;
        var currY = 0;
        for(var i = 0 ; i < pathLength-1; i++) {
                if(path.charAt(i+1) == 'u') {
                    currY -= 1;
                }
                if(path.charAt(i+1) == 'd') {
                    currY += 1;
                }
                if(path.charAt(i+1) == 'r') {
                    currX += 1;
                }
                if(path.charAt(i+1) == 'l') {
                    currX -= 1;
                }
                tile[currX][currY].state = 'x';
        }
    }
}

function reset() {
    for( let c = 0; c < tileColumnCount; c++) {
        tile[c]=[];
        for( let r = 0; r < tileRowCount; r++) {
            tile[c][r] = {x:c*(tileW+3), y:r*(tileH+3), state:'e'};
        }
    }
    
    tile[0][0].state = 's';
    tile[tileColumnCount-1][tileRowCount-1].state = 'f';

    output.innerHTMl = '';
}

function myMove(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for( let c = 0; c < tileColumnCount; c++) {
        for( let r = 0; r < tileRowCount; r++) {
            if(c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH) {
                if(tile[c][r].state == 'e' && (c != boundX || r != boundY)) {
                    tile[c][r].state = 'w';
                    boundX = c;
                    boundY = r;
                }
                else if(tile[c][r].state == 'w' && (c != boundX || r != boundY)) {
                    tile[c][r].state = 'e';
                    boundX = c;
                    boundY = r;
                }
            }
        }
    }
}

function myDown(e) {
    canvas.onmousemove = myMove;
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    for( let c = 0; c < tileColumnCount; c++) {
        for( let r = 0; r < tileRowCount; r++) {
            if(c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH) {
                if(tile[c][r].state == 'e') {
                    tile[c][r].state = 'w';
                    boundX = c;
                    boundY = r;
                }
                else if(tile[c][r].state == 'w') {
                    tile[c][r].state = 'e';
                    boundX = c;
                    boundY = r;
                }
            }
        }
    }
}

function myUp() {
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmousemove = myUp;