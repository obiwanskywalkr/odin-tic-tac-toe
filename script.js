const Players = (name, sign) => {
    this.name = name;
    this.sign = sign;
    return { name, sign, }
}

const gameBoard = (() => {
    // let matrix = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];
    let _matrix = new Array(9);

    const getMatrix = (index) => {
        return _matrix
    }
    const getMatrixValue = (index) => {
        return _matrix[index]
    }
    const setMatrixValue = (index, value) => {
        return (_matrix[index] = value)
    }

    const resetBoard = () => {
        _matrix = new Array(9);
    }
    return { getMatrix, getMatrixValue, setMatrixValue, resetBoard }
})();

const gameController = (() => {
    let _currentTurn = 'x';
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

    const getTurn = () => {
        return _currentTurn;
    }

    const toggleTurn = () => {
        return _currentTurn = (_currentTurn === 'x') ? 
            (_currentTurn = 'o') : (_currentTurn = 'x');
    }
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


    return { getTurn, toggleTurn, checkWin }
})();

const displayController = (() => {
    const board = document.getElementById('board');
    const cellGrid = document.querySelectorAll('#cell');

    const render = () => {
        for (let i = 0; i < cellGrid.length; i++) {
            if (gameBoard.getMatrixValue(i) === undefined) continue;
            else { cellGrid[i].classList.add(`${gameBoard.getMatrixValue(i)}`) }     
        }
    }
    // Toggles turns for the current turn indicator hover effect by applying
    // an X or O class to the gameboard.
    const toggleTurnIndicator = () => {
        (board.classList.contains('x')) ?
            (board.classList.remove('x'), board.classList.add('o')) :
            (board.classList.remove('o'), board.classList.add('x'));
        gameController.toggleTurn();
    }
    // Getter and setter for cellGrid indices using data-attributes
    // Correlates to indices in gameBoard matrix
    const setCellIndex = (() => {
        for (let i = 0; i < cellGrid.length; i++) {
            cellGrid[i].setAttribute('data-index', i);
        }
    })();

    const getCellIndex = (cell) => {
        return cell.getAttribute('data-index');
    }
    // Getter and setter for cellGrid values using data-attributes
    // Setter pushes onClick values to gameBoard matrix
    const getCellValue = (cell) => {
        return cell.getAttribute('data-value');
    }

    const setCellValue = (cell) => {
        cell.setAttribute('data-value', `${gameController.getTurn()}`);
        gameBoard.setMatrixValue(getCellIndex(cell), getCellValue(cell));
    }

    const addCellClick = (() => {
        cellGrid.forEach((cell) => {
            cell.addEventListener('click', (event) => {
                setCellValue(event.target);
                render();
                if (gameController.checkWin(cellGrid, gameController.getTurn())) {
                    console.log('winner');
                }
                toggleTurnIndicator();
                });
    
            }, {once: true});
        })();
})();

