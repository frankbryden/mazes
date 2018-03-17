var NODE_SIZE = 8;//15;
var COLS = 10;
var ROWS = 5;
var X_OFFSET = 50;
var Y_OFFSET = 50;
var grid = [];

/*
 - Give each node a neighbour + parent attribute - apply union finder optimisation by path compression
 - Colour nodes in white - connections in white - empty connections in black
 */

function reset(){
    COLS = Math.max(node1.value, 15);//10);
    ROWS = Math.max(node2.value, 10);
    grid = [];
    for (i = 0; i < ROWS; i++){
        row = [];
        for (j = 1; j <= COLS; j++){
            row.push(makeNode(COLS*i+j, COLS*i+j, (j - 1) * 4 * NODE_SIZE, i * 4 * NODE_SIZE));
        }
        grid.push(row);
    }
    console.log(grid);
    repaint();
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawGridNode(ctx, node){
    ctx.fillStyle = "cyan";
    ctx.fillRect(getXOffset(node.x) - NODE_SIZE, getYOffset(node.y) - NODE_SIZE, 2 * NODE_SIZE, 2 * NODE_SIZE);
}

function drawStart(ctx, node){
    console.log("In draw start");
    ctx.fillStyle = "red";
    ctx.fillRect(getXOffset(node.x) - NODE_SIZE, getYOffset(node.y) - NODE_SIZE, 2 * NODE_SIZE, 2 * NODE_SIZE);
}

function drawEnd(ctx, node){
    ctx.fillStyle = "green";
    ctx.fillRect(getXOffset(node.x) - NODE_SIZE, getYOffset(node.y) - NODE_SIZE, 2 * NODE_SIZE, 2 * NODE_SIZE);
}

function drawWall(ctx, x, y){
    ctx.fillStyle = "black";
    ctx.fillRect(getXOffset(x), getYOffset(y), 2 * NODE_SIZE, 2 * NODE_SIZE);
}

function drawPath(ctx, x, y){
    ctx.fillStyle = "cyan";
    ctx.fillRect(getXOffset(x), getYOffset(y), 2 * NODE_SIZE, 2 * NODE_SIZE);
}

function dealNode(currentNode, nextNode, x, y){
    if (currentNode.parent == nextNode || currentNode == nextNode.parent){
        console.log("Drawing PATH between " + currentNode.data + " and " + nextNode.data + " equal 1 ? " + 1 + " currentNode.data = " + typeof(currentNode.data) + " and 1 is " + typeof(1));
        /*if (currentNode.data == 1){
            console.log("=================== It is a wall because nextNode.parent = " + nextNode.data);
        }*/
        //console.log("Drawing PATH between " + currentNode.data + " and " + nextNode.data);
        console.log("draw path");
        drawPath(ctx, x, y);
    } else {
        console.log("Drawing WALL between " + currentNode.data + " and " + nextNode.data);
        drawWall(ctx, x, y);
    }
}

function drawMazeGrid(ctx){
    for (var i = 1; i <= ROWS*COLS; i++){
        var myNode = getNode(i);
        if (myNode.data == 1){
            drawStart(ctx, myNode);
        } else if (myNode.data == ROWS * COLS){
            drawEnd(ctx, myNode);
        } else {
            drawGridNode(ctx, myNode);
        }


        //Deal with connections between nodes
        if (!isEndNode(myNode.data)){
            var x = myNode.x + 1 * NODE_SIZE;
            var y = myNode.y - NODE_SIZE;
            var nextNode = getNode(myNode.data + 1);
            dealNode(myNode, nextNode, x, y);
        }
        if (!isBottomNode(myNode.data)){
            var x = myNode.x - NODE_SIZE;
            var y = myNode.y + NODE_SIZE;
            var nextNode = getNode(myNode.data + COLS);
            dealNode(myNode, nextNode, x, y);
        }

        //Draw a wall no matter what in the diagonal -- EXCEPT IF LAST ROW OR COL
        if (!isBottomNode(myNode.data) && !isEndNode(myNode.data)){
            var x = myNode.x + NODE_SIZE;
            var y = myNode.y + NODE_SIZE;
            drawWall(ctx, x, y);
        }

    }
}

function isEndNode(n){
    return n % COLS == 0;
}

function isBottomNode(n){
    return n > COLS * (ROWS - 1);
}


function makeNode(p, d, x, y) {
    //console.log("Created node with data parent " + parent + " data = " + d + " at x = " + x + " and y = " + y);
    return {parent: p, data: d, x: x, y: y}
}

function getRoot(node){
    if (node.parent == node.data){
        return node;
    }
    return getRoot(node.parent)
}

function connectNodes(node1, node2){
    if (isAdj(node1.data, node2.data) && !isConnected(node1.data, node2.data)){
        if (node1.parent == node1.data){
            node1.parent = node2;
            node1.parent = node2;
        } else {
            node2.parent = node1;
        }

        return true;
    }
    return false;
}

function isConnected(n1, n2){
    var node1 = getNode(n1);
    var node2 = getNode(n2);
    return getRoot(node1) == getRoot(node2);
}

function isFinished(start, end){
    return getRoot(start) == getRoot(end);
}

function getXOffset(x){
    return X_OFFSET + x;
}

function getYOffset(y){
    return Y_OFFSET + y;
}

function getX(n){
    return (n - 1)%COLS;
}

function getY(n){
    n--;
    return (n - n%COLS)/COLS;
}

function getNode(n){
    return grid[getY(n)][getX(n)];
}

function drawNode(ctx, node) {
    ctx.beginPath();
    ctx.arc(getXOffset(node.x), getYOffset(node.y), NODE_SIZE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "11px Arial";//"16px Arial";
    if (node === null) {
        console.log("Our node is null");
    }
    if (node.data >= 100){
        ctx.fillText(node.data, getXOffset(node.x) - NODE_SIZE / 2 - NODE_SIZE/4, getYOffset(node.y) + NODE_SIZE / 3);
    }else {
        ctx.fillText(node.data, getXOffset(node.x) - NODE_SIZE / 2, getYOffset(node.y) + NODE_SIZE / 2);
    }

    //console.log("Drawing node at " + getXOffset(node.x) + ", " + getYOffset(node.y) + ".");

}

function drawConnection(ctx, node){
    if (node.parent != -1){
        //If this node is connected -> not a root
        ctx.beginPath();
        ctx.moveTo(getXOffset(node.x), getYOffset(node.y));
        ctx.lineTo(getXOffset(node.parent.x), getYOffset(node.parent.y));
        ctx.stroke();
    }
}

function drawGrid(ctx){
    for (i = 0; i < ROWS; i++){
        for (j = 0; j < COLS; j++){
            drawNode(ctx, grid[i][j]);
            drawConnection(ctx, grid[i][j]);
        }
    }
}

function addNewNode() {
    var val = nodeData.value;
    console.log("Adding node with data " + val)
    addNode(root, val);
    repaint();
}

async function drawMazeAsync(){
    console.log("here");
    start = 1;
    end = COLS * ROWS;
    console.log("isConnected(start, end) -> " + isConnected(start, end));
    while (!isConnected(start, end)){
        var node1 = getNode(Math.round(Math.random() * 49 + 1));
        console.log("New it with node = " + node1.data);
        adjacentNodes = getAdj(node1.data);
        var node2 = adjacentNodes[Math.round(Math.random() * (adjacentNodes.length - 1))];
        connectNodes(node1, node2);
        repaint();
        await sleep(100);
    }
}

function computeMazeLin(){
    start = 1;
    end = COLS * ROWS;
    while (!isConnected(start, end)){
        for (var i = 1; i <= ROWS*COLS; i++){
            var node1 = getNode(i);
            adjacentNodes = getAdj(i);
            var node2 = adjacentNodes[Math.round(Math.random() * (adjacentNodes.length - 1))];
            connectNodes(node1, node2);
            if (isConnected(start, end)){
                break;
            }
        }
    }
}

function drawMazeLin(){
    start = 1;
    end = COLS * ROWS;
    while (!isConnected(start, end)){
        for (var i = 1; i <= ROWS*COLS; i++){
            var node1 = getNode(i);
            adjacentNodes = getAdj(i);
            var node2 = adjacentNodes[Math.round(Math.random() * (adjacentNodes.length - 1))];
            connectNodes(node1, node2);
            if (isConnected(start, end)){
                break;
            }
        }
    }
    repaint();
}

function drawMaze(){
    start = 1;
    end = COLS * ROWS;
    while (!isConnected(start, end)){
        var node1 = getNode(Math.round(Math.random() * 49 + 1));
        adjacentNodes = getAdj(node1.data);
        var node2 = adjacentNodes[Math.round(Math.random() * (adjacentNodes.length - 1))];
        connectNodes(node1, node2);

    }
    repaint();
}

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
}

function getAdj(n){
    adj = [];
    xOff = [];
    yOff = [];
    var x = getX(n);
    var y = getY(n);
    if (x >= 1 && x < COLS - 1){
        xOff.push(1);
        xOff.push(-1);
    } else if (x == 0){
        xOff.push(1);
    } else {
        xOff.push(-1);
    }

    if (y >= 1 && y < ROWS - 1){
        yOff.push(1);
        yOff.push(-1);
    } else if (y == 0){
        yOff.push(1);
    } else {
        yOff.push(-1);
    }

    for (j = 0; j < yOff.length; j++){
        adj.push(grid[y + yOff[j]][x]);
    }

    for (i = 0; i < xOff.length; i++){
        adj.push(grid[y][x + xOff[i]]);
    }
    return adj;
}


function isAdj(n1, n2){
    var x1 = getX(n1);
    var y1 = getY(n1);

    var x2 = getX(n2);
    var y2 = getY(n2);

    var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    var adjacent = null;

    if (dist <= 1){
        adjacent = true;
    } else {
        adjacent = false;
    }

    return adjacent;
}

function userRqstDrawAsync(){
    drawMazeAsync();
    output.innerHTML = "Drawing maze async";
}

function userRqstDrawGrid(){
    reset();
    computeMazeLin();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMazeGrid(ctx);
    output.innerHTML = "Finished drawing maze";
}

function userRqstDrawLin(){
    drawMazeLin();
    output.innerHTML = "Finished drawing maze in a linear fashion.";
}

function userRqstReset(){
    reset();
    output.innerHTML = "Maze reset.";
}

function userRqstNodeRoot(){
    var n1 = node1.value;
    var root = getRoot(getNode(n1));
    output.innerHTML = "Root of " + n1 + " is " + root.data;
}

function userRqstAdjacentNodes(){
    var n1 = node1.value;
    var adjacent = getAdj(n1);
    var nodeList = "";
    for (i = 0; i < adjacent.length; i++){
        nodeList += adjacent[i].data + ",";
    }
    output.innerHTML = "Nodes adjacent to " + n1 + " : " + nodeList;

}

function userRqstAdjacent() {
    var n1 = node1.value;
    var n2 = node2.value;
    var adjacent = isAdj(n1, n2);
    output.innerHTML = "From n1 -> " + n1 + " we have coords -> (" + getX(n1) + "; " + getY(n1) + ") and n2 -> " + n2 + " coords -> (" + getX(n2) + "; " + getY(n2) + ") adjacent = " + adjacent;

}


function userRqstConnect() {
    var n1 = node1.value;
    var n2 = node2.value;
    console.log("Connecting nodes " + n1 + " and " + n2 + "...");
    //rotateLeft(root);
    var success = connectNodes(getNode(n1), getNode(n2));
    console.log("Done rotate left. GO for repaint...")
    repaint();
    console.log("Done repaint. Done rebalancing");
    if (success){
        output.innerHTML = "Connected nodes " + n1 + " and " + n2 + ".";
    } else {
        output.innerHTML = "Nodes " + n1 + " and " + n2 + " are not adjacent. Abandoning.";
    }

}

var canvas = document.getElementById("myCanv");
var ctx = canvas.getContext('2d');
var node1 = document.getElementById("node1");
var node2 = document.getElementById("node2");
var output = document.getElementById("output");
canvas.width = 1200;
canvas.height = 800;
ctx.fillStyle = 'red';
reset();