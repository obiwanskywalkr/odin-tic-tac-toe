const gameBoard = (() => {
    let boardArray = new Array(9);
    return { boardArray, }
})();

const gameController = (() => {
    let _currentTurn = 'x';

    const getTurn = () => {
        return _currentTurn;
    }

    const toggleTurn = () => {
        return _currentTurn = ((_currentTurn === 'x')) ? 
            (_currentTurn = 'o') : (_currentTurn = 'x');
    }

    return { getTurn, toggleTurn, }
})();

const displayController = (() => {
    const board = document.getElementById('board');
    const cellGrid = document.querySelectorAll('#cell');

    const toggleTurnIndicator = () => {
        (board.classList.contains('x')) ?
            (board.classList.remove('x'), board.classList.add('o')) :
            (board.classList.remove('o'), board.classList.add('x'))
    }

    const markCell = (cell) => {
        cell.classList.add(`${(gameController.getTurn())}`);
        cell.setAttribute('data-value', `${gameController.getTurn()}`);
    }

    (function setCellIndex () {
        for (let i = 0; i < cellGrid.length; i++) {
            cellGrid[i].setAttribute('data-index', i);
        }
    })();

    const getCellIndex = (cell) => {
        return cell.getAttribute('data-index');
    }

    const getCellValue = (cell) => {
        return cell.getAttribute('data-value')
    }
    
    board.addEventListener('click', toggleTurnIndicator);

    cellGrid.forEach((cell) => {
        cell.addEventListener('click', (event) => {
            markCell(event.target);
            gameBoard.boardArray.splice(getCellIndex(event.target), 1, getCellValue(event.target))
            gameController.toggleTurn();
        })
    })

})();

const Players = (sign) => {
    this.sign = sign;
    return { sign, }
}
