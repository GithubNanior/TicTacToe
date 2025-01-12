const X = "x";
const O = "o";

let game = new Game();
game.initialize();

let interface = new Interface();
interface.initialize();

function Interface(){
    let grid = [];

    const banner = document.querySelector(".banner");
    const outcomeText = banner.querySelector(".outcome-text");
    const retryButton = banner.querySelector(".retry-button");
    const container = document.querySelector(".container");

    function initialize()
    {
        for (let x = 0; x <= 2; x++) {
            grid[x] = [];
            for (let y = 0; y <= 2; y++) {
                let cell = createCell(x, y);

                container.appendChild(cell);
                grid[x][y] = cell;
            }
        }

        game.onTileSet.subscribe(setTile);
        game.onWin.subscribe(victory);
        game.onDraw.subscribe(draw);

        retryButton.onclick = ()=>{
            interface.destroy();

            game.initialize();
            interface.initialize();
        }

        function createCell(x, y)
        {
            let cell = document.createElement("button");
            cell.classList.add("cell");
            cell.onclick = () => {
                game.setTile(x, y);
            }
            return cell;
        }
    }

    function destroy()
    {
        banner.style.visibility = "hidden";

        while (container.hasChildNodes())
        {
            container.removeChild(container.firstChild);
        }

        game.onTileSet.unsubscribe(setTile);
        game.onWin.unsubscribe(victory);
        game.onDraw.unsubscribe(draw);
    }

    function setTile(x, y, symbol)
    {
        grid[x][y].setAttribute("type", symbol);
    }

    function victory(symbol)
    {
        banner.style.visibility = "visible";
        outcomeText.textContent = symbol + " won!"
    }

    function draw()
    {
        banner.style.visibility = "visible";
        outcomeText.textContent = "Draw!"
    }

    this.initialize = initialize;
    this.destroy = destroy;
}

function Game(){
    let turn;

    let grid;

    const onTileSet = new Event();
    const onWin = new Event();
    const onDraw = new Event();


    // Functions

    function initialize()
    {
        turn = 0;
        grid = [
            [" ", " ", " "], 
            [" ", " ", " "], 
            [" ", " ", " "]
        ];
    }

    function setTile(x, y)
    {
        if (!cellAvailable(x, y))
        {
            return;
        }


        let symbol = turn % 2 == 0 ? X : O;

        grid[x][y] = symbol;

        onTileSet.invoke(x, y, symbol);

        if (checkVictory(x, y, symbol))
        {
            onWin.invoke(symbol);
            return;
        }

        
        turn++;

        if (turn == 9)
        {
            onDraw.invoke();
            return;
        }
    }


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

    this.initialize = initialize;
    this.setTile = setTile;
    this.onTileSet = onTileSet;
    this.onWin = onWin;
    this.onDraw = onDraw;
};

function Event()
{
    let subscribers = [];

    function subscribe(subscriber)
    {
        subscribers.push(subscriber);
    }

    function unsubscribe(subscriber)
    {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
    }

    function invoke()
    {
        for (const subscriber of subscribers) {
            subscriber(...arguments);
        }
    }

    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.invoke = invoke;
}