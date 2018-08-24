"use strict";
//declaratie van variabelen die worden als een container beschouwd
 var naam, score; //<--- il faut les attribuer de nouvelles donnéés
var HFigure = 50; //Height of the figure
var IniciateGame = false; //Iniciate game
var NextLevel = true; //If true continue if not stop
var columns = 2; // Initial size of the board 
var rows = 2; // Initial size of the board 
var teller = 1;
var highScore;
var db;
var tText;
var name;


$(document).ready(function () {
   //var spel = document.getElementById("spel");
    document.getElementById("spel").style.visibility="hidden";
    
    
               $("#name").change(function()
 {
      name = document.getElementById("name").value;
                       if(name != ""){
        spel.style.visibility = "visible";
        document.getElementById("name").readOnly = true;
        GenerateGame(columns, rows);
    }
    
     });
    

    
      ShowScore();
});



function ShowScore(){
        
        naam = "Luis Sapon Lucas";
    score = "level 7";
     highScore = [{
        "naam": naam
        , "score": score
    }];
    $(document).bind('pageinit', function () {
        // schakel de transities bij navigatie tussen
        // schermen uit.
        $.mobile.defaultPageTransition = 'none';
    });
    // open de databank
     db = openDatabase('mydb', '1.0', 'Test DB', 0.1 * 1024 * 1024);
    db.transaction(function (tx) {
        // maak de tabel aan als deze nog niet bestond
        tx.executeSql('CREATE TABLE IF NOT EXISTS highscores (naam, score)');
        // haal het aantal highscores op uit de tabel highscores
        // de ? worden vervangen door de elementen in de array na
        // de querystring
        tx.executeSql('select count(*) as aantal from highscores where naam like ? and score like ?', [naam, score], function (tx, results) {
            // kijk na of het resultaat ok is.
            console.log("select werkt");
            if (results.rows.item(0).aantal === 0) {
                // er was nog geen combinatie met de naam & score in de db, dus voeg die nu toe :
                tx.executeSql('INSERT INTO highscores (naam,score) VALUES (?, ?)', [naam, score], function (tx, results) {
                    // de select was ok
                    console.log("ok!");
                }, function (tx, error) {
                    // er was een probleem met de select
                    console.log("NOK!");
                });
            }
        }, function (tx, error) {
            console.log("NOK!");
        });
    });
    // update de gegevens in de tabellen op het 2e en 3e scherm
    updateTables();
    updateTablesSQL();
    
}

var myApp = new Framework7();
var i = 0;
function GenerateGame(c, r) {

    //If NextLevel is equal to false it indicates that the game should stop
    if (!NextLevel)
        return;

    //Stop the game
    NextLevel = false;
    //Deletes everything on the game
    $(".spel").fadeOut(1990,
        // at the end of the fade method
        //empty all the game elements on the game board
        function () {
            $(".spel").empty();

            // Expand the stage or game board to accommodate the circles

            $(".container").animate({
                    height: ((HFigure + 8) * r) + "px",
                    width: ((HFigure + 8) * c) + "px"
                }, 990,
                // at the end of the expansion with animate () 
                // I create the new figures according to the 
                //new dimension of the screen and level of game
                                    
                function () {
                    for (i = 0; i < (c * r); i++)
                        $(".spel").append(CreateFigure("circle", HFigure));
                    $(".spel").fadeIn(191);

                // I create randomly which circles on the 
                //board can be clicked and which ones 
                //can't be clicked
                    CreateGreenFigure();
                }
            )
        }
    );

}

function CreateFigure(typefigure, r) {
    //If any figure is clicked
    return $("<div>").addClass("figure " + typefigure).width(r).height(r).click(function () {
        if (IniciateGame) {
            // Check if this figure has the selected attribute, if it is one of the active ones in green
            if ($(this).attr("geselecteerde") == "geselecteerde")
                $(this).addClass("active");
            else
                $(this).addClass("fout");

            var TotalSelected = $(".figure[geselecteerde='geselecteerde']").length
            
            //If the number of clicks in active circles and the number of clicks in non-active circles is greater than the number of clicks made, we will not continue the game and we will regenerate the screen again without changing the level


            if (($(".active").length + $(".fout").length) >= TotalSelected) {

                IniciateGame = false;

                $(".figure[geselecteerde='geselecteerde']:not(.active)").addClass("active");
                // If the click failure level is 0 it means that we hit the sequence

                if ($(".fout").length == 0) {
                    myApp.alert("Goed zo, je kunt doorgaan tot de volgende level", "Boodschap");

                    if (columns == rows)
                        columns++;
                    else if (columns > rows)
                        rows++;
                    //Max level is 7
                    if (columns > 7) {
                        columns = 7;
                        rows = 7;

                        myApp.alert("goed zo je hebt alle 7 levels beindelgd ", "Boodschap");

                           naam = name;
                        score = "level 7";
                        
                         highScore.push({
                        "naam": naam,
                        "score": score
                    });

                    db.transaction(function (tx) {
                        tx.executeSql('INSERT INTO highscores (naam,score) VALUES (?, ?)', [naam, score]);
                    });

                    updateTablesSQL();

                    }else if(columns > 3){
                        
                                naam = name;
                        score = "level 3";
                        
                         highScore.push({
                        "naam": naam,
                        "score": score
                    });

                    db.transaction(function (tx) {
                        tx.executeSql('INSERT INTO highscores (naam,score) VALUES (?, ?)', [naam, score]);
                    });

                    updateTablesSQL();
                    }
                }
                GenerateGame(columns, rows);
            }
        }
    });
}




function CreateGreenFigure() {
    var teller = 0;
    var lengte = $(".spel > .figure").length

    for (teller = 0; teller < Math.ceil(lengte / 3);) {
        var random = Math.ceil(Math.random() * lengte);
        if (random < lengte) {
            if (!$(".spel > .figure").eq(random).hasClass("active")) {
                $(".spel > .figure").eq(random).addClass("active").attr("geselecteerde", "geselecteerde");
                teller++;
            }
        }
    }
   
    window.setTimeout(HideYellowFigure, 1800)
}

function HideYellowFigure() {

    $(".spel > .figure").removeClass("active");
    IniciateGame = true;
    NextLevel = true;
}


//Virtuele database om de score van iedere speler aan te tonen
function updateTables() {
    // update de tabel in het '2e' scherm met de inhoud
    // van de array highScore (niet WebSQL)
    teller = 0;
     tText = "";
    for (teller = 0; teller < highScore.length; teller += 1) {
        tText += "<tr><td>" + highScore[teller].naam + "<\/td><td>" + highScore[teller].score + "<\/td><\/tr>";
    }
    $("#highscore tbody").html(tText);
}

function updateTablesSQL() {
    // update de tabel in het '3e' scherm met de inhoud
    // van een select query op de highscores tabel in de
    // lokale WebSQL databank)
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM highscores order by score desc', [], function (tx, results) {
            var len = results.rows.length
                , i;
            tText = "";
            for (teller = 0; teller < len; teller += 1) {
                tText += "<tr><td>" + results.rows.item(teller).naam + "<\/td><td>" + results.rows.item(teller).score + "<\/td><\/tr>";
            }
            $("#highscoreDB tbody").html(tText);
        }, null);
    });
}

