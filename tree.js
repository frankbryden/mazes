var NODE_SIZE = 8;//15;
var COLS = 10;
var ROWS = 5;
var X_OFFSET = 36;
var Y_OFFSET = 20;
var grid = [];

/*
 - Give each node a neighbour + parent attribute - apply union finder optimisation by path compression
 - Colour nodes in white - connections in white - empty connections in black
 */

function reset(){
    COLS = Math.max(node1.value, 5);//10);
    ROWS = Math.max(node2.value, 5);
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


function makeNode(p, d, x, y) {
    //console.log("Created node with data parent " + parent + " data = " + d + " at x = " + x + " and y = " + y);
    return {parent: p, root:null, connectedTo: [], data: d, x: x, y: y}
}

function getRoot(node){
    console.log("In get root with node data " + node.data);
    if (node.root !== null){
        return node.root;
    }
    if (node.parent == node.data){
        return node;
    }
    return getRoot(node.parent)
}

function connectNodes(node1, node2){
    if (isAdj(node1.data, node2.data) && node1.parent != node2 && node2.parent != node1){// && !isConnected(node1.data, node2.data)){
        if (node1.parent == node1.data){
            node1.parent = node2;
            node1.parent = node2;
        } else {
            if (node1.data > node2.data){
                if (node2.parent != node2.data){
                    //alert("Rerouting node " + node2.data + " from " + node2.parent.data + " to " + node1.data);
                    node2.connectedTo.push(node1);
                } else {
                    node2.parent = node1;
                }

            } else {
                if (node1.parent != node1.data){
                    //alert("Rerouting node " + node1.data + " from " + node1.parent.data + " to " + node2.data);
                    node1.connectedTo.push(node2);
                } else {
                    node1.parent = node2;
                }

            }

        }
        /*
        node1.connectedTo = node2;
        node2.connectedTo = node1;
        */
        return true;
    }
    return false;
}

function isConnected(n1, n2){
    var node1 = getNode(n1);
    var node2 = getNode(n2);
    var root1 = getRoot(node1);
    var root2 = getRoot(node2);
    if (node1.data == 1 || node2.data == 1){
        //console.log("Setting root of 1 to " + root1 + " -> " + root1.data);
    }
    if (root1.data != node1.data){
        node1.root = root1;
    }

    if (root2.data != node2.data){
        node2.root = root2;
    }

    return root1 == root2;
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
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(getXOffset(node.x), getYOffset(node.y), NODE_SIZE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "red";
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
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(getXOffset(node.x), getYOffset(node.y));
        ctx.lineTo(getXOffset(node.parent.x), getYOffset(node.parent.y));
        ctx.stroke();
    }
    for (var i = 0; i < node.connectedTo.length; i++){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(getXOffset(node.x), getYOffset(node.y));
        ctx.lineTo(getXOffset(node.connectedTo[i].x), getYOffset(node.connectedTo[i].y));
        ctx.stroke();
    }
    if (node.root != null){
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(getXOffset(node.x), getYOffset(node.y));
        ctx.lineTo(getXOffset(node.root.x), getYOffset(node.root.y));
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
        await sleep(1000);
    }
}

async function drawMazeLin(){
    start = 1;
    end = COLS * ROWS;
    while (!isConnected(start, end)){
        for (var i = 1; i <= ROWS*COLS; i++){
            var node1 = getNode(i);
            console.log("here with node1 = " + node1.data);
            adjacentNodes = getAdj(i);
            var node2 = adjacentNodes[Math.round(Math.random() * (adjacentNodes.length - 1))];
            connectNodes(node1, node2);
            if (isConnected(start, end)){
                break;
            }else {
                console.log("We haven't connected start and end yet !");
            }
            repaint();
            var root1 = getRoot(getNode(start));
            var root2 = getRoot(getNode(end));
            output.innerHTML = "1 -> " + root1.data + " and " + end + " -> " + root2.data;
            await sleep(10);
        }
    }
    repaint();
    console.log(grid);
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
        console.log(n1 + ", " + n2 + " are not adjacent as (" + x1 + "; " + y1 + ") and (" + x2 + "; " + y2 + ") are more than 1 apart (" + distance + ")");
        adjacent = false;
    }

    return adjacent;
}

function userRqstDrawAsync(){
    drawMazeAsync();
    output.innerHTML = "Drawing maze async";
}

function userRqstDraw(){
    drawMaze();
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
    var node = getNode(n1);
    var root1 = getRoot(node);
    console.log("Shall we perform optimisation : node data is " + node.data + " and root data is " + root1.data);
    if (root1.data != node.data){
        console.log("Optimisation : rerouted " + node.data + " to point to root " + root1.data);
        node.root = root1;
    }
    output.innerHTML = "Root of " + n1 + " is " + root1.data;
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