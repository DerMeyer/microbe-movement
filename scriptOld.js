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

// microbe

let requestID,
    cellLeft = 700, // start offset
    cellTop = 200,
    cellEnergy = 100,
    lossFactor,
    defaultLossFactor = 1.4, // how much energy will be lost upon acceleration, higher val for higher loss
    stretchLossFactor = .2, // 0 to 1, higher values allow more extreme energy states
    stoic = 0,
    stoicFactor = 300, // higher values decrease the likeliness of reconsiering acceleration decision
    accLeft = 0,
    accTop = 0,
    spinLeft = 0,
    spinTop = 0,
    pace = 3, // higher values higher pace
    accFactor = 2.5; // How much faster is acceleration likely to be on high energy

const move = (counter) => {

    console.log('hi', counter);

    lossFactor = defaultLossFactor;
    if (cellEnergy > 100) {
        let delta = (cellEnergy - 100) * stretchLossFactor / 100;
        // console.log('delta:', delta);
        lossFactor *= cellEnergy / 100 - delta;
    } else if (cellEnergy < 0) {
        let delta = cellEnergy * stretchLossFactor;
        // console.log('delta:', delta);
        lossFactor *= 100 / (100 - cellEnergy - delta);
    }

    // console.log(lossFactor);

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

    dataLifeStoic(cellEnergy, stoic);
    dataXY(cellTop, cellLeft);

    if ($('#cell').offset().left < 0 || $('#cell').offset().left > innerWidth - $('#cell').width()) {
        accLeft -= accLeft * 2;
    }
    if ($('#cell').offset().top < 0 || $('#cell').offset().top > innerHeight - $('#cell').height()) {
        accTop -= accTop * 2;
    }

    cellLeft += accLeft;
    cellTop += accTop;

    $('#cell').css('left', cellLeft).css('top', cellTop);

    requestID = requestAnimationFrame(move);
}

$(document).on('keydown', (e) => {
    e.keyCode === 13 && move();
    e.keyCode === 32 && cancelAnimationFrame(requestID);
});

move(0);
