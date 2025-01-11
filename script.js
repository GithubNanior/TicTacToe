const X = "x";
const O = "o";

let game = new Game();

function Game(){
    let turn = 0;

    let grid = [
        [" ", " ", " "], 
        [" ", " ", " "], 
        [" ", " ", " "]
    ];


    // Checks

    function cellAvailable(x, y)
    {
        return (0 <= x && x <= 2 && 0 <= y && y <= 2 && grid[x][y] == " ");
    }

    function checkRow(y, symbol)
    {
        for (let x = 0; x <= 2; x++) {
            if (grid[x][y] != symbol)
            {
                return false;
            }
        }

        return true;
    }

    function checkColumn(x, symbol)
    {
        for (let y = 0; y <= 2; y++) {
            if (grid[x][y] != symbol)
            {
                return false
            }
        }

        return true;
    }

    function checkDiagonalL(symbol)
    {
        for (let i = 0; i <= 2; i++) {
            if (grid[i, i] != symbol)
            {
                return false;
            }
        }

        return true;
    }

    function checkDiagonalR(symbol)
    {
        for (let i = 0; i <= 2; i++) {
            if (grid[2-i][i] != symbol)
            {
                return false;
            }
        }

        return true;
    }

    function checkVictory(x, y, symbol)
    {
        return checkRow(y, symbol) ||
            checkColumn(x, symbol) ||
            (x == y && checkDiagonalL(symbol)) ||
            (x == 2 - y && checkDiagonalR(symbol));
    }


    // Functions

    function setTile(x, y)
    {
        if (!cellAvailable(x, y))
        {
            return;
        }


        let symbol = turn % 2 == 0 ? X : O;

        grid[x][y] = symbol;

        if (checkVictory(x, y, symbol))
        {
            console.log(symbol + " won!");
        }

        
        turn++;

        if (turn == 9)
        {
            console.log("Draw!")
        }
    }

    this.setTile = setTile;
    this.grid = grid;
};