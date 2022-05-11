const Players = (name, sign) => {
    this.name = name;
    this.sign = sign;
    return { name, sign, }
}

const gameBoard = (() => {
    // let matrix = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];
    let _matrix = new Array(9);
    const resetBoard = () => _matrix = new Array(9);
    const getMatrix = () => _matrix;
    const getMatrixValue = (index) => _matrix[index];
    const setMatrixValue = (index, value) => _matrix[index] = value;

    return { getMatrix, getMatrixValue, setMatrixValue, resetBoard }

})();

const displayController = (() => {
    const board = document.getElementById('board');
    const cellGrid = document.querySelectorAll('#cell');
    const reset = document.getElementById('reset');
    const start = document.getElementById('start');
    const startOverlay = document.getElementById('startOverlay');

    const initializeButtons = (() => {
        start.addEventListener('click', handleStart);
        reset.addEventListener('click', gameController.resetGame);
    })

    const render = () => {
        for (let i = 0; i < cellGrid.length; i++) {
            if (gameBoard.getMatrixValue(i) === undefined) continue;
            else { cellGrid[i].classList.add(`${gameBoard.getMatrixValue(i)}`) }     
        }
    }

    const handleDraw = () => {
        if (!(gameController.checkDraw())) return;
        console.log('draw')
        gameController.resetGame();
    }

    const handleWin = () => {
        if (!(gameController.checkWin(cellGrid, gameController.getTurn()))) return;
        console.log('winner');
        gameController.resetGame(); 
        toggleTurnIndicator(); // :)
    }

    const handleStart = () => {
        startOverlay.classList.remove('visible');
        startOverlay.classList.add('hidden');
        gameController.startGame();
    }
    
    const handleReset = () => {
        cellGrid.forEach(cell => {
            cell.removeAttribute('data-value');
            cell.classList.remove('x');
            cell.classList.remove('o');
        })
        board.classList.remove('o')
        board.classList.add('x');
    }

    const handleClick = (event) => {
        setCellValue(event.target);
        render();
        gameController.incrementTurnCount()
        handleDraw();
        handleWin();
        toggleTurnIndicator();
    }

    const addClickListener = () => {
        cellGrid.forEach(cell => {
            cell.addEventListener('click', handleClick, {once: true});
        });
    }

    const removeClickListener = () => {
        cellGrid.forEach(cell => {
            cell.removeEventListener('click', handleClick, {once: true});
        });
    }

    // Toggles turn and toggles current turn hover effect by applying
    // an X or O class to the gameboard.
    const toggleTurnIndicator = () => {
        (board.classList.contains('x')) ?
            (board.classList.remove('x'), board.classList.add('o')) :
            (board.classList.remove('o'), board.classList.add('x'));

        gameController.toggleTurn();
    }

    // Getter and setter for cellGrid indices using data-attributes
    // Correlates to indices in gameBoard matrix
    const getCellIndex = (cell) => cell.getAttribute('data-index');
    const setCellIndex = () => {
        for (let i = 0; i < cellGrid.length; i++) {
            if (cellGrid[i].hasAttribute('data-index')) return;
            cellGrid[i].setAttribute('data-index', i);
        }
    }
    
    // Getter and setter for cellGrid values using data-attributes
    // Setter pushes onClick values to gameBoard matrix
    const getCellValue = (cell) => cell.getAttribute('data-value');
    const setCellValue = (cell) => {
        cell.setAttribute('data-value', `${gameController.getTurn()}`);
        gameBoard.setMatrixValue(getCellIndex(cell), getCellValue(cell));
    }

    return { initializeButtons, handleReset, addClickListener, removeClickListener, setCellIndex, }

})();

const gameController = (() => {
    let _currentTurn = 'x';
    let _turnCount = 0;
    let _winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const startGame = () => {
        _currentTurn = 'x'
        displayController.setCellIndex();
        displayController.addClickListener();
    };

    const resetGame = () => {
        displayController.handleReset();
        gameBoard.resetBoard();
        displayController.removeClickListener();
        _turnCount = 0
        startGame();
    }

    const checkDraw = () => _turnCount === 9;

    // Loops through all winConditions checking that every index in the 
    // current condition contains either X class or O class.
    // Returns true if at least one condition meets criteria
    const checkWin = (grid, currentTurn) => {
        return _winConditions.some(condition => {
            return condition.every(cell => {
                return grid[cell].classList.contains(currentTurn)
            })
        })
    }

    const getTurn = () => _currentTurn;

    const toggleTurn = () => _currentTurn = 
        (_currentTurn === 'x') ? (_currentTurn = 'o') : (_currentTurn = 'x');

    const incrementTurnCount = () => _turnCount++;

    return { startGame, resetGame, checkDraw, checkWin, getTurn, toggleTurn, incrementTurnCount, }

})();

window.onload = displayController.initializeButtons();