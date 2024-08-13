var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;
window.onload = function() {
    // Initialize the 5x5 board
    for (let i = 1; i <= rows * columns; i++) {
        let tile = document.createElement("img");
        tile.src = `images/New folder/${i}.jpg`;

        // DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("board").append(tile);
    }

    // Pieces
    let pieces = [];
    for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString());
    }
    pieces.reverse();
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        // Swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.id = `${i + 1}`;
        tile.src = "./images/" + pieces[i] + ".jpg";

        // DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").append(tile);
    }
}

// DRAG TILES
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

var correctCounter = 0;
function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    let currTileSource = currTile.src.split('/').pop();
    let otherTileSource = otherTile.src.split('/').pop();

    if (currTileSource === otherTileSource) {
        currTile.src = otherImg;
        otherTile.src = currImg;
        currTile.setAttribute("draggable",false);
        otherTile.setAttribute("draggable",false);
       
        setTimeout(()=>{
            correctCounter++;
            if(correctCounter==25){
                // alert("good");
                Swal.fire({
                    title: "Good job!",
                    text: "You complete the Puzzle",
                    icon: "success"
                  });
             }
        });
        
    }
    turns += 1;
    document.getElementById("turns").innerText = turns;

   
}
