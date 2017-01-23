var board = {
  //default values
  boardSize: 20,
  numBlueCells: 50,
  numGreenCells:  50,
  numEmptyCells: 25,
  numSimilarCells: 50,

  //Array abstraction of the board
  cellElements: [],
  UNOCCUPIED: ' ',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  EMPTY: 'EMPTY',

  timerID: 0,
  round: 0
};

board.start = function ()
{
  hideMenu();
  hideExplanation();
  showSimulationText();
  board.getValues();
  board.createBoard();
  board.unoccupyBoard();
  showBoard();
  showStats();
  board.populateCells();
  //Execute a round every 50 ms
  board.timerID=setInterval(function(){
      board.doSchelling();
  },50);
}

board.stop =  function ()
{
  clearInterval(board.timerID);
}

//Resets all attributes to default values
board.reset = function ()
{
  $("#slider-range-boardSize").slider("value", board.boardSize);
  $("#slider-range-cells").slider("value", board.numGreenCells);
  $("#slider-range-similar").slider("value", board.numSimilarCells);
  $("#slider-range-empty").slider("value", board.numEmptyCells);
}

//Gets current values from menu
board.getValues = function ()
{ 
  board.boardSize = $("#slider-range-boardSize").slider("value");
  board.numGreenCells = $("#slider-range-cells").slider("values",0);
  board.numBlueCells = 100 - $("#slider-range-cells").slider("values",0);
  board.numSimilarCells = $("#slider-range-similar").slider("values",0);
  board.numEmptyCells = $("#slider-range-empty").slider("values",0);
}

//Creates a table which represents the board
board.createBoard = function () 
{
  var tableBoard = "<table border='0' class='board' id='tableBoard'>";
  for (var i = 0; i < board.boardSize; i++)
  {
    tableBoard += "<tr id='row" + i + "'>";
    for (var c = 0; c < board.boardSize; c++)
    {
      tableBoard += "<td id='row" + i + "col" + c + "'></td>";
    }
    tableBoard += "</tr>";
  }
  $("#board").append(tableBoard + "</table>");
}

//Randomly populate cells with blue/green/empty cells.
//Blue + Green + Empty cells constitute 100% of the board.
board.populateCells = function ()
{
  var iRandomNumber, cRandomNumber, size, emptyCountMax,
      emptyCount, blueCountMax, blueCount, greenCountMax,
      greenCount;

  size = board.boardSize*board.boardSize;
  emptyCountMax = (board.numEmptyCells*size)/100;
  emptyCount = 0;
  
  blueCountMax = (board.numBlueCells*size)/100;
  blueCount = 0;
  
  greenCountMax = (board.numGreenCells*size)/100;
  greenCount = 0;
  
  //Randomly place cells in the board
  for (var i=0; i < size; i++)
  {
    //Search for UNOCCUPIED spots on the array to fill in
    do
    {
      iRandomNumber = Math.floor(Math.random() * parseInt(board.boardSize));
      cRandomNumber = Math.floor(Math.random() * parseInt(board.boardSize));
      
    } while (board.cellElements[iRandomNumber][cRandomNumber] != board.UNOCCUPIED);
    
    var cellID = "row" + iRandomNumber + "col" + cRandomNumber;

    if (blueCount < blueCountMax)
    {
      $("#" + cellID).addClass("blue");
      board.cellElements[iRandomNumber][cRandomNumber] = board.BLUE;
      blueCount++;
    }
    else 
    {
      $("#" + cellID).addClass("green");
      board.cellElements[iRandomNumber][cRandomNumber] = board.GREEN;
      greenCount++;
    } 
  }
  
  //Randomly place the number of empty cells
  for (var i = 0; i < emptyCountMax; i++)
  {
    iRandomNumber = Math.floor(Math.random() * parseInt(board.boardSize));
    cRandomNumber = Math.floor(Math.random() * parseInt(board.boardSize));
    
    cellID = "row" + iRandomNumber + "col" + cRandomNumber;
    
    //Remove current cell class
    if($("#" + cellID).hasClass("green"))
      $("#" + cellID).removeClass("green");
    else
      $("#" + cellID).removeClass("blue");
    
    $("#" + cellID).addClass("empty");
    board.cellElements[iRandomNumber][cRandomNumber] = board.EMPTY;
  }
}

//A "schelling" does a traversal through all the board
//and finds dissatisfied cells first, then randomly allocates
//this cells to new empty positions. This process is repeated 
//until every cell in the board is satisfied. Ideally, a cell would
//choose its new location based on AI, to determine
//wheter this new positions would be better than the last one.
board.doSchelling = function ()
{
  var dissatisfied = 0,
      boardSize = board.boardSize,
      dissatisfiedCells = [],
      numCellsAnalyzed = 0;
  
  //Do traversal for all cells inside the 2d array
  for (var i = 0; i < boardSize; i++)
  {
    for (var c = 0; c < boardSize; c++)
    {
      if (board.cellElements[i][c] != board.EMPTY)
      {
        //calculate similarity in a 3x3 grid 
        var similarity = board.calculateSimilarity(i, c);
        
        if (similarity < board.numSimilarCells)
        {
          //cell is dissatisfied
          dissatisfied++;
          var dissatisfiedID = i + "_" + c;
          
          //save position of cell to relocate later
          dissatisfiedCells.push(dissatisfiedID);   
        }
        numCellsAnalyzed++; 
      }
    }
  }
    
  var dissatisfiedCellPos = [];


    for (var c = 0; c < dissatisfied; c++)
    { 
      //Parse the ids to get the positions
      var dissatisfiedCellPos = dissatisfiedCells[c].split("_"),
          dissatisfiedRow = parseInt(dissatisfiedCellPos[0]),
          dissatisfiedCol = parseInt(dissatisfiedCellPos[1]);
      
      //Find a random empty cell
      do
      {
        iRandomNumber = Math.floor(Math.random() * board.boardSize);
        cRandomNumber = Math.floor(Math.random() * board.boardSize);
      } while (board.cellElements[iRandomNumber][cRandomNumber] != board.EMPTY);
      
      var newCellPosition = board.cellElements[iRandomNumber][cRandomNumber],
          oldCellPosition = board.cellElements[dissatisfiedRow][dissatisfiedCol];
      
      var cellID = "row" + iRandomNumber + "col" + cRandomNumber,
          dissatisfiedCellID = "row" + dissatisfiedRow + "col" + dissatisfiedCol;
      
      $('#' + cellID).removeClass("empty");
            
      if (oldCellPosition == board.BLUE)
      {
        $("#" + dissatisfiedCellID).removeClass("blue");
        $("#" + cellID).addClass("blue");
        board.cellElements[iRandomNumber][cRandomNumber] = board.BLUE;
      }
      else 
      {
        $("#" + dissatisfiedCellID).removeClass("green");
        $("#" + cellID).addClass("green");
        board.cellElements[iRandomNumber][cRandomNumber] = board.GREEN;
      }
      
      $("#" + dissatisfiedCellID).addClass("empty");
      board.cellElements[dissatisfiedRow][dissatisfiedCol] = board.EMPTY;
    }
  
  var overallSatisfaction = Math.floor(((boardSize*boardSize-dissatisfied)*100)/(boardSize*boardSize)),
      round = board.round++; 
  $("#round").text(round);
  $("#overallSatisfaction").text(overallSatisfaction + "%"); 
  if( overallSatisfaction == 100)
    board.stop(); 
}

//Calculates similarity of a single cell in
//a 3x3 grid
board.calculateSimilarity = function (row, col)
{ 
  var evaluatedCellType = board.cellElements[row][col];
  
  //initialize both to -1 since this loop will iterate through the cell itself too
  var similar = -1,
     neighbors = -1,
     result = 0,
     similarity = 0,
     boardSize = board.boardSize;
  
  for (var i = row - 1; i <= row + 1; i++)
  {
    for (var c = col - 1; c <= col + 1; c++)
    {
      if (i >= 0 && c >= 0 && i < boardSize && c < boardSize)
      {
        var cell = board.cellElements[i][c];
        if (cell != board.EMPTY)
        {
          if (cell == evaluatedCellType)
            similar++;

          neighbors++;
        }
      }
    }
  } 
  
  if (neighbors != 0)
  {
    similarity = similar/neighbors;
    //convert similarity to percentage
    similarity = similarity*100;
  }
  else
  {
    //since agent does not have any neighbors, it is already satisfied
    similarity = 100;
  }
    
  return similarity;    
}

//Initially set all elements to UNOCCUPIED
board.unoccupyBoard = function () {
  var size = board.boardSize;
  
  //Create 2D array from cells[]
  for (var i=0; i < size; i++)
  {
    board.cellElements[i] = new Array(size);
  } 
  
  for (var i=0; i < size; i++)
  {
    for (var c=0; c < size; c++)
    {
      board.cellElements[i][c] = board.UNOCCUPIED;
    }
  } 
}

board.emptyBoard = function ()
{
  $("#board").empty();
}

board.setDefaults = function ()
{
  board.boardSize = 20;
  board.numBlueCells = 50;
  board.numGreenCells =  50;
  board.numEmptyCells = 25;
  board.numSimilarCells = 50;
  board.timerID = 0;
  board.round = 0;
}

$(document).ready(function(){

 $("#slider-range-boardSize").slider({
    range: "min",
    value: 20,
    min: 10,
    max: 30,
  });

 $("#slider-range-cells").slider({
    range: "min",
    value: 50,
    min: 0,
    max: 100,
  });

  //customize first slider to show  cell colors accordingly
  $("#slider-range-cells").removeClass("ui-widget-content");
  $("#slider-range-cells").addClass("ui-widget-content-cells"); 
  $("div.ui-widget-header").eq(1).addClass("ui-widget-header-cells");
  $("div.ui-widget-header").eq(1).removeClass("ui-widget-header");

 $("#slider-range-similar").slider({
    range: "min",
    value: 60,
    min: 0,
    max: 100,
  });

 $("#slider-range-empty").slider({
    range: "min",
    value: 40,
    min: 1,
    max: 100,
  });

  $("a.ui-slider-handle").mousemove(function(evt){
    var id = evt.target.parentNode.id;
    showSliderBubble(id);
    updateCellSliderValues(id);
  });

  $("a.ui-slider-handle").mouseout(function(evt){
    var id = evt.target.parentNode.id;
    hideSliderBubble(id);
    updateCellSliderValues(id);
  });

  $("#start").click(function(){
    board.start();
  });

  $("#reset").click(function(){
    board.reset();
  });

  $("#back").click(function(){
    back();
  });
}); 

function hideSliderBubble(id)
{
  $("#" + id + "-bubbleValue").hide();
}

function showSliderBubble(id)
{
    $("#" + id + "-bubbleValue").show();
}

//Updates the bubble value on the top of the
//sliders with the current value
function updateCellSliderValues(id)
{
    var value1 = $("#"+ id).slider("values",0);
    if (id == "slider-range-cells")
      $("#"+ id + "-bubbleValue").text(value1 + "% - " + (100 - value1) + "%").css({"left": + value1 + "%"});
    else if (id == "slider-range-boardSize")
    {
      var denominator = $("#slider-range-boardSize").slider("option", "max") - $("#slider-range-boardSize").slider("option", "min"),
          offSet = ((value1-$("#slider-range-boardSize").slider("option", "min"))*100)/denominator;
      $("#"+ id + "-bubbleValue").text(value1 + "x" + value1).css({"left": + offSet + "%"});
    }
    else
      $("#"+ id + "-bubbleValue").text(value1 + "%").css({"left": + value1 + "%"});
}

function hideMenu()
{
  $("#menu").hide(1000);  
}

function showMenu()
{
  $("#menu").show(1000);  
}

function hideExplanation()
{
  
  $("#schellingExplanation").hide(100);
  $("#simulationText").hide(100, function()
    {
      $(".text").css("text-align", "center"); 
    });
}

function showExplanation()
{
  $("#simulationText").hide(10, function ()
  {
    $("#simulationText").show(1000);
    $("#schellingExplanation").show(1000, function ()
      {
        $(".text").css("text-align", "justify");
        $("#simulationText").css("display", "inline");
        $("#schellingExplanation").css("display", "inline");      
      });
  });

}

function showSimulationText()
{
  $("#simulationText").show(100);
}

function showStats()
{
  $("#stats").fadeIn(1000);
}

function hideStats()
{
  $("#stats").fadeOut(1000, function() {
    $("#round").empty();
    $("#overallSatisfaction").empty();   
  });
}

function showBoard ()
{
  $("#tableBoard").fadeIn(1000);
}

function hideBoard ()
{
  $("#tableBoard").fadeOut(1000,function(){
    board.emptyBoard();
  });
}

function back()
{
  board.stop();
  hideStats();
  hideBoard();
  board.setDefaults();
  showMenu();
  showExplanation();
}
