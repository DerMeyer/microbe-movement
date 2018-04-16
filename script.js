// data

const dataLifeStoic = (l, s) => {
    $('#life').val(l.toFixed(0));
    $('#stoic').val(s.toFixed(0));
};

const dataXY = (x, y) => {
    $('#x').val(x.toFixed(0));
    $('#y').val(y.toFixed(0));
};

// environment

const coordinates = c => [(c - c % 100) / 100, c % 100];

const sea = document.getElementById('sea');
for (let i = 0; i < 7000; i++) {
    let water = document.createElement('div');
    if (((i - i % 100) / 100) % 2 === 0) {
        i % 2 === 0 ? water.classList.add('hot') : water.classList.add('cold');
    } else {
        i % 2 === 0 ? water.classList.add('cold') : water.classList.add('hot');
    }
    water.setAttribute('id', coordinates(i).join('-'));
    sea.appendChild(water);
}

// microbes

const cell_1 = {
    name: 'cell_1',
    cellParams: {
        defaultLossFactor: 1.4,
        stretchLossFactor: .2,
        stoicFactor: 300,
        pace: 3,
        accFactor: 2.5
    },
    cellState: {
        cellLeft: 200,
        cellTop: 100,
        cellEnergy: 100,
        stoic: 0,
        accLeft: 0,
        accTop: 0,
        spinLeft: 0,
        spinTop: 0
    }
};

const cell_2 = {
    name: 'cell_2',
    cellParams: {
        defaultLossFactor: 1.4,
        stretchLossFactor: .2,
        stoicFactor: 300,
        pace: 3,
        accFactor: 2.5
    },
    cellState: {
        cellLeft: 400,
        cellTop: 200,
        cellEnergy: 100,
        stoic: 0,
        accLeft: 0,
        accTop: 0,
        spinLeft: 0,
        spinTop: 0
    }
};

const cell_3 = {
    name: 'cell_3',
    cellParams: {
        defaultLossFactor: 1.4,
        stretchLossFactor: .2,
        stoicFactor: 300,
        pace: 3,
        accFactor: 2.5
    },
    cellState: {
        cellLeft: 600,
        cellTop: 300,
        cellEnergy: 100,
        stoic: 0,
        accLeft: 0,
        accTop: 0,
        spinLeft: 0,
        spinTop: 0
    }
};

const cell_4 = {
    name: 'cell_4',
    cellParams: {
        defaultLossFactor: 1.4,
        stretchLossFactor: .2,
        stoicFactor: 300,
        pace: 3,
        accFactor: 2.5
    },
    cellState: {
        cellLeft: 800,
        cellTop: 400,
        cellEnergy: 100,
        stoic: 0,
        accLeft: 0,
        accTop: 0,
        spinLeft: 0,
        spinTop: 0
    }
};

const cell_5 = {
    name: 'cell_5',
    cellParams: {
        defaultLossFactor: 1.4,
        stretchLossFactor: .2,
        stoicFactor: 300,
        pace: 3,
        accFactor: 2.5
    },
    cellState: {
        cellLeft: 1000,
        cellTop: 500,
        cellEnergy: 100,
        stoic: 0,
        accLeft: 0,
        accTop: 0,
        spinLeft: 0,
        spinTop: 0
    }
};

const position = [
    { name: 'cell_1', left: cell_1.cellState.cellLeft, top: cell_1.cellState.cellTop },
    { name: 'cell_2', left: cell_2.cellState.cellLeft, top: cell_2.cellState.cellTop },
    { name: 'cell_3', left: cell_3.cellState.cellLeft, top: cell_3.cellState.cellTop },
    { name: 'cell_4', left: cell_4.cellState.cellLeft, top: cell_4.cellState.cellTop },
    { name: 'cell_5', left: cell_5.cellState.cellLeft, top: cell_5.cellState.cellTop }
];

// movement

const getLossFactor = cell => {
    let lossFactor = cell.cellParams.defaultLossFactor;
    if (cell.cellState.cellEnergy > 100) {
        let delta = (cell.cellState.cellEnergy - 100) * cell.cellParams.stretchLossFactor / 100;
        lossFactor *= cell.cellState.cellEnergy / 100 - delta;
    } else if (cell.cellState.cellEnergy < 0) {
        let delta = cell.cellState.cellEnergy * cell.cellParams.stretchLossFactor;
        lossFactor *= 100 / (100 - cell.cellState.cellEnergy - delta);
    }
    return lossFactor;
};

const move = cell => {

    let lossFactor = getLossFactor(cell);

    let accFactor = cell.cellParams.accFactor;
    let pace = cell.cellParams.pace;
    let stoicFactor = cell.cellParams.stoicFactor;

    let cellLeft = cell.cellState.cellLeft;
    let cellTop = cell.cellState.cellTop;
    let cellEnergy = cell.cellState.cellEnergy;
    let stoic = cell.cellState.stoic;
    let accLeft = cell.cellState.accLeft;
    let accTop = cell.cellState.accTop;
    let spinLeft = cell.cellState.spinLeft;
    let spinTop = cell.cellState.spinTop;

    if (stoic < 0) {
        if (cellEnergy > Math.floor(Math.random() * 100)) {
            accLeft = Math.floor(Math.random() * (pace - pace / 2) * accFactor);
            accTop = Math.floor(Math.random() * (pace - pace / 2) * accFactor);
            stoic = Math.floor(Math.random() * stoicFactor);
        } else {
            accLeft = Math.random() * pace - pace / 2;
            accTop = Math.random() * pace - pace / 2;
            stoic = Math.floor(Math.random() * stoicFactor);
        }
        spinLeft = Math.random() * .1 - .05;
        spinTop = Math.random() * .1 - .05;
    } else {
        stoic--;
    }

    if (accLeft > 0) {
        cellEnergy += pace / lossFactor - accLeft;
    } else {
        cellEnergy += pace / lossFactor + accLeft;
    }
    if (accTop > 0) {
        cellEnergy += pace / lossFactor - accTop;
    } else {
        cellEnergy += pace / lossFactor + accTop;
    }

    accLeft += spinLeft;
    accTop += spinTop;

    if (cell.name === 'cell_1') {
        dataLifeStoic(cellEnergy, stoic);
        dataXY(cellTop, cellLeft);
    }

    if ($(`#${cell.name}`).offset().left < 0 || $(`#${cell.name}`).offset().left > innerWidth - $(`#${cell.name}`).width()) {
        accLeft -= accLeft * 2;
    }
    if ($(`#${cell.name}`).offset().top < 0 || $(`#${cell.name}`).offset().top > innerHeight - $(`#${cell.name}`).height()) {
        accTop -= accTop * 2;
    }

    position.forEach(e => {
        if (e.name === cell.name) {
            e.left = cellLeft;
            e.top = cellTop;
        } else {
            let distX = e.left - cellLeft;
            let distY = e.top - cellTop;
            if (Math.sqrt((distX * distX) + (distY * distY)) < 40) {
                accLeft -= accLeft * 2;
                accTop -= accTop * 2;
            }
        }
    });

    cellLeft += accLeft;
    cellTop += accTop;

    $(`#${cell.name}`).css('left', cellLeft).css('top', cellTop);

    return { cellLeft, cellTop, cellEnergy, stoic, accLeft, accTop, spinLeft, spinTop }
};

// trigger cellState

const move_cell_1 = () => {
    cell_1.cellState = move(cell_1);
    return requestAnimationFrame(move_cell_1);
};
cell_1.cellParams.requestID = move_cell_1();

const move_cell_2 = () => {
    cell_2.cellState = move(cell_2);
    return requestAnimationFrame(move_cell_2);
};
cell_2.cellParams.requestID = move_cell_2();

const move_cell_3 = () => {
    cell_3.cellState = move(cell_3);
    return requestAnimationFrame(move_cell_3);
};
cell_3.cellParams.requestID = move_cell_3();

const move_cell_4 = () => {
    cell_4.cellState = move(cell_4);
    return requestAnimationFrame(move_cell_4);
};
cell_4.cellParams.requestID = move_cell_4();

const move_cell_5 = () => {
    cell_5.cellState = move(cell_5);
    return requestAnimationFrame(move_cell_5);
};
cell_5.cellParams.requestID = move_cell_5();

const stop = cell => cancelAnimationFrame(cell.cellParams.requestID);
