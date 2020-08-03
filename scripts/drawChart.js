google.charts.load('current', {
    'packages': ['corechart']
});

// function to create url (alphavntage api)
function createApiUrl(dateParameter) {
    let func;
    switch (dateParameter) {
        case 'day':
            func = 'INTRADAY';
            break;
        case 'month':
            func = 'DAILY';
            break;
        case 'year':
            func = 'MONTHLY';
            break;
    }
    return 'https://www.alphavantage.co/query?function=TIME_SERIES_' + func +
        '&symbol=' + localStorage.getItem('choosenStock') +
        `${func="INTRADAY"?'&interval=60min&apikey=1WD0TQ3OKK4L2K7B':'&apikey=1WD0TQ3OKK4L2K7B'}`;
}

// function to draw chart with GoogleCharts
// dataArray --> parameter with needed data for chart
function drawChart(dataArray) {
    let options = {
        'fontName': 'Open Sans',
        'colors': ['#843AB3'],
        'legend': 'none'
    };
    let chartDiv = document.getElementById('chart');
    let data = google.visualization.arrayToDataTable(dataArray.reverse(), true);
    let chart = new google.visualization.CandlestickChart(chartDiv);

    chart.draw(data, options);
}

// ---------- classes day / month / year
class Day {
    constructor(obj) {
        this.timeSeriesInf = obj['Time Series (60min)'];
        this.today = Object.keys(this.timeSeriesInf)[0];
    }
    sliceToCheckDate = function (date) {
        return date.slice(0, 10)
    }
    sliceDateToChecked(date) {
        return date.slice(11, 16)
    }

    pushDataForTableinArr(arrToPush) {
        for (const [key, value] of Object.entries(this.timeSeriesInf)) {
            if (this.sliceToCheckDate(key) == this.sliceToCheckDate(this.today)) {
                let arr = [this.sliceDateToChecked(key), +value['3. low'], +value['1. open'], +value['4. close'], +value['2. high']];
                arrToPush.push(arr);
            }
        }
    }
}

class Month {
    constructor(obj) {
        this.timeSeriesInf = obj['Time Series (Daily)'];
        this.today = Object.keys(this.timeSeriesInf)[0];
    }
    sliceToCheckDate = function (date) {
        return date.slice(0, 7);
    }

    pushDataForTableinArr(arrToPush) {
        for (const [key, value] of Object.entries(this.timeSeriesInf)) {
            if (this.sliceToCheckDate(key) == this.sliceToCheckDate(this.today)) {
                let arr = [key, +value['3. low'], +value['1. open'], +value['4. close'], +value['2. high']];
                arrToPush.push(arr);
            }
        }
    }
}

class Year {
    constructor(obj) {
        this.timeSeriesInf = obj['Monthly Time Series'];
        this.today = Object.keys(this.timeSeriesInf)[0];
    }
    sliceToCheckDate = function (date) {
        return date.slice(0, 5);
    }
    sliceDateToChecked(date) {
        return date.slice(0, 7);
    }

    pushDataForTableinArr(arrToPush) {
        for (const [key, value] of Object.entries(this.timeSeriesInf)) {
            if (this.sliceToCheckDate(key) == this.sliceToCheckDate(this.today)) {
                let arr = [this.sliceDateToChecked(key), +value['3. low'], +value['1. open'], +value['4. close'], +value['2. high']];
                arrToPush.push(arr);
            }
        }
    }
}


// creates data for google charts and then uses function to draw chart
function createDataAndDraw(dateParameter) {
    localStorage.setItem('drownChart', dateParameter);
    let apiURL = createApiUrl(dateParameter);

    fetch(apiURL).then(response => response.json()).then(response => {
        let dataForTable = [];
        let dayMonthYear;
        switch (dateParameter) {
            case 'day':
                dayMonthYear = new Day(response);
                break;
            case 'month':
                dayMonthYear = new Month(response);
                break;
            case 'year':
                dayMonthYear = new Year(response);
                break;
        }
        dayMonthYear.pushDataForTableinArr(dataForTable);
        return dataForTable;
    }).then((dataForTable) => {
        drawChart(dataForTable);
    });
}

// ------------> events <------------

drawDay.addEventListener('click', () => {
    createDataAndDraw('day')
});
drawMonth.addEventListener('click', () => {
    createDataAndDraw('month')
});
drawYear.addEventListener('click', () => {
    createDataAndDraw('year')
});

window.addEventListener('resize', () => {
    if (chart.innerHTML !== '') {
        createDataAndDraw(localStorage.getItem('drownChart'));
    }
});