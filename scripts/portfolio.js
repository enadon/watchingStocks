// key: 1WD0TQ3OKK4L2K7B.

// returns template literal with div-row, with inner name of stock, it's price and change
// as parameters: userStocksArrStock --> name of stock(symbol) ; responseGQ --> alphavantage api's obj for every stock
function createInnerDivPortfolio(userArrStock, responseGQ) {
  return `<div class="portfolioRow" data-name=${userArrStock}>
          <div class='portfolioName'> ${userArrStock} </div>
          <div class='portfolioCost'> ${responseGQ['05. price']} </div>
          <div class=${responseGQ['05. price'] > responseGQ['08. previous close'] ? 'portfolioChangeGreen' : 'portfolioChangeRed'}> 
            ${(responseGQ['05. price'] > responseGQ['08. previous close'] ? "↑ " : "↓ ") + responseGQ['10. change percent']} 
          </div>
         </div>`
}

// gets array of stokcs of special user from db.json
// then in cycle get`s info about every stock with alphavantage api
function showUserStocks() {
  let userStocksArr = []; // ---------> WAS GLOBAL HAVEN'T DEBUG IT YET !!! MAY CRUSH !!!

  fetch('http://localhost:3000/3040').then(response => response.json()).then(response => {
    userStocksArr.push(...response.stock);
    smallPhoto.src = response.picture;
    userCash.innerText = response.cash + ' $';
  }).then(
    () => {
      let innerDivPortfolio = ``;
      for (let stock = 0; stock < userStocksArr.length; stock++) {
        stockURL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + userStocksArr[stock] + '&apikey=1WD0TQ3OKK4L2K7B';

        fetch(stockURL).then(
          response => response.json()).then(
          response => {
            let responseGQ = response["Global Quote"];
            localStorage.setItem(userStocksArr[stock], JSON.stringify(responseGQ));
            innerDivPortfolio += createInnerDivPortfolio(userStocksArr[stock], responseGQ);
            portfolioAll.innerHTML = innerDivPortfolio;
          })
      }
    }
  );
}

// ----------> events: <----------
window.addEventListener("load", showUserStocks);

portfolioAll.addEventListener('click', (event) => {
  let lastChoosen = document.querySelector('#choosen');
  if (lastChoosen) lastChoosen.removeAttribute('id');
  let choosenStock = event.target.closest("div.portfolioRow");
  choosenStock.id = 'choosen';
  localStorage.setItem('choosenStock', choosenStock.dataset.name);

  let stockInf = JSON.parse(localStorage.getItem(choosenStock.dataset.name));

  let allStockInfoInner = ``;
  for (const [key, value] of Object.entries(stockInf)) {
    allStockInfoInner += `<div class='qualitativeCharacteristic'> ${key.slice(4) + ': ' + value} </div>`;
  }
  allStockInfo.innerHTML = allStockInfoInner;
});

