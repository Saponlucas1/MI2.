var HFigure = 50; //Height of the figure
var IniciateGame = false; //Iniciate game
var NextLevel = true; //If true continue if not stop
var columns = 2; // Initial size of the board 
var rows = 2; // Initial size of the board 


$(document).ready(function () {
    GenerateGame(columns, rows);
});

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
                    alert("Goed zo, je kunt doorgaan tot de volgende level");

                    if (columns == rows)
                        columns++;
                    else if (columns > rows)
                        rows++;
                    //Max level is 7
                    if (columns > 7) {
                        columns = 7;
                        rows = 7;

                        alert("goed zo je hebt alle 7 levels beindelgd ");



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
