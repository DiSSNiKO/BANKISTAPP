'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

//fodder functions

const sum = arr => {
  let sum = 0;
  arr.forEach(element => {
    sum += Number(element);
  });
  return sum;
};
const positiveSum = arr => {
  let sum = 0;
  arr.forEach(element => {
    element > 0 ? (sum += Number(element)) : (sum += 0);
  });
  return sum;
};
const negativeSum = arr => {
  let sum = 0;
  arr.forEach(element => {
    element < 0 ? (sum += Number(element)) : (sum += 0);
  });
  return sum;
};
const indexRemove = function (arr, indx) {
  let rearr = [];
  let cuindx = 0;
  for (let item of arr) {
    if (indx != cuindx) {
      rearr.push(item);
    }
    cuindx += 1;
  }
  return rearr;
};

const addIndx = function (indx, arr, toadd) {
  let rearr = [];
  let index = 0;
  for (let item of arr) {
    if (indx == index) {
      rearr.push(toadd);
      rearr.push(item);
    } else {
      rearr.push(item);
    }
    index += 1;
  }
  return rearr;
};

function sortArray(arr) {
  let len = arr.length;
  let biggest;
  let cuindex;
  let smolindex;
  let rearr = [];
  for (let i = 0; i < len; i++) {
    smolindex = 0;
    cuindex = 0;
    biggest = arr[i];
    for (let num of arr) {
      if (num > biggest && cuindex >= i) {
        biggest = num;
        smolindex = cuindex;
      }
      cuindex += 1;
      if (cuindex === len) {
        break;
      }
    }
    arr = indexRemove(arr, smolindex);
    arr = addIndx(i, arr, biggest);
    rearr.push(biggest);
  }
  return rearr;
}

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  username: 'jsmith',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  username: 'jdavis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  username: 'stwilliams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  username: 'ssmith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements

//login
const userLoginInput = document.querySelector('#user');
const userPinLoginInput = document.querySelector('#userPin');
const loginButton = document.querySelector('#userChangeButt');
const userName = document.querySelector('#userName');

//Date and main money display
const asOfDate = document.querySelector('#date');
const balValue = document.querySelector('#balValue');

//bank functions
const main = document.querySelector('.Main');
const footer = document.querySelector('footer');
const transferTo = document.querySelector('#transferTo');
const transferAmount = document.querySelector('#transferAmount');
const initiateTransfer = document.querySelector('#initiateTransfer');
const requestAmount = document.querySelector('#requestAmount');
const initiateRequest = document.querySelector('#initiateRequest');
const closeUserName = document.querySelector('#closeUserName');
const closeUserPin = document.querySelector('#closeUserPin');
const closeUserButton = document.querySelector('#closeUserButton');
const transactionsContainer = document.querySelector('#transactionsContainer');

//footer
const sortButton = document.querySelector('#sortButton');
const footerPositiveValues = document.querySelectorAll('.footerValueP');
const footerNegativeValue = document.querySelector('.footerValueN');
const timer = document.querySelector("#logoutTimer")

//prerequisites
let currentUser = '';
let currentAccount;
let numOfCurrentUserTransactions = 0;
main.style.display = 'none';
footer.style.display = 'none';
let transactionListSorted = false;
let preSortedList = [];



//functions

const clearHtmlElements = function () {
  if (numOfCurrentUserTransactions > 0) {
    for (let i = 0; i < numOfCurrentUserTransactions; i++) {
      transactionsContainer.removeChild(transactionsContainer.firstChild);
    }
  }
  numOfCurrentUserTransactions = 0;
};

const addTopHtml = function (style, text){
    numOfCurrentUserTransactions += 1;
    let transactionTemplate = `<div class="transaction notlasttrans">
                              <div class="actionDate">
                                <h3 class="
                                  ${style}
                                ">${numOfCurrentUserTransactions} ${text}</h3>
                                <h3 class="actionDateDisplay"></h3>
                              </div>
                              <span class="financial">$${currentAccount.movements.at(
                                -1
                              )}</span>
                            </div>`;
    transactionsContainer.insertAdjacentHTML('afterbegin', transactionTemplate);
}

const createHtmlElements = function (
  arr,
  transactionTemplate = '',
  movLen = currentAccount.movements.length
) {
  for (let i = movLen - 1; i > -1; i--) {
    if (numOfCurrentUserTransactions < movLen - 1) {
      transactionTemplate = `<div class="transaction notlasttrans">
                              <div class="actionDate">
                                <h3 class="${
                                  arr[i] > 0
                                    ? 'actionDisplayP'
                                    : 'actionDisplayN'
                                }">${movLen - numOfCurrentUserTransactions} ${
        arr[i] > 0 ? 'Deposit' : 'Withdraw'
      }</h3>
                                <h3 class="actionDateDisplay"></h3>
                              </div>
                              <span class="financial">$${arr[i].toFixed(2)}</span>
                            </div>`;
      transactionsContainer.innerHTML += transactionTemplate;
    } else {
      transactionTemplate = `<div class="transaction">
                                <div class="actionDate">
                                  <h3 class="${
                                    arr[i] > 0
                                      ? 'actionDisplayP'
                                      : 'actionDisplayN'
                                  }">${arr[i] > 0 ? 'Deposit' : 'Withdraw'}</h3>
                                  <h3 class="actionDateDisplay"></h3>
                                </div>
                                <span class="financial">$${arr[i].toFixed(2)}</span>
                              </div>`;
      transactionsContainer.innerHTML += transactionTemplate;
    }
    numOfCurrentUserTransactions += 1;
  }
};

const login = function () {
  const usernameinput = userLoginInput.value;
  const usernamepininput = userPinLoginInput.value;
  logOutTimer();
  console.log(accounts);
  if (usernameinput != currentUser) {
    for (let account of accounts) {
      if (
        account.username === usernameinput &&
        account.pin === Number(usernamepininput)
      ) {
        currentUser = account.username;
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i].username === currentUser) {
            currentAccount = accounts[i];
          }
        }
        clearHtmlElements();
        footer.style.display = 'flex';
        main.style.display = 'block';
        createHtmlElements(currentAccount.movements);
        balValue.textContent = `$ ${sum(currentAccount.movements)}`;
        userName.textContent = `${currentAccount.owner}!`;
        footerPositiveValues[0].textContent = `$${positiveSum(
          currentAccount.movements
        ).toFixed(2)}`;
        footerPositiveValues[1].textContent = `$${Math.trunc(
          (positiveSum(currentAccount.movements) *
            currentAccount.interestRate) /
            100
        ).toFixed(2)}`;
        footerNegativeValue.textContent = `$${negativeSum(
          currentAccount.movements
        ).toFixed(2)}`;
        transactionListSorted = false;
        break;
      }
    }
  }
};

const sortTransactions = function () {
  if (transactionListSorted) {
    clearHtmlElements();
    createHtmlElements(currentAccount.movements);
    transactionListSorted = false;
  } else {
    clearHtmlElements();
    const sortedActions = sortArray(currentAccount.movements);
    createHtmlElements(sortedActions.reverse());
    transactionListSorted = true;
  }
};

const transferMoney = function () {
  const transferToValue = transferTo.value;
  const transferAmountValue = Number(transferAmount.value);
  if (transferAmountValue > 0 && transferToValue != currentUser) {
    accounts.forEach(account => {
      if (account.username === transferToValue) {
        account.movements.push(transferAmountValue);
        currentAccount.movements.push(-1 * transferAmountValue);
        addTopHtml('actionDisplayN', 'Withdraw');
        balValue.textContent = `$ ${sum(currentAccount.movements)}`;
      }
    });
  }
  transferTo.value = '';
  transferAmount.value = '';
};

const requestMoney = function(){
  const requestedAmount = requestAmount.value;
  if(Number(requestedAmount) > 0){
    currentAccount.movements.push(Math.round(Number(requestedAmount)));
    addTopHtml('actionDisplayP', 'Deposit');
    balValue.textContent = `$ ${sum(currentAccount.movements)}`;
    requestAmount.value = '';
  }
};

const closeUser = function() {
  const closeUserNameValue = closeUserName.value;
  const closeUserPinValue = closeUserPin.value;
  if(currentUser===closeUserNameValue&&currentAccount.pin===Number(closeUserPinValue)){
    footer.style.display = 'none'; //flex
    main.style.display = 'none'; //block
    userName.textContent = 'please log in.'
    accounts = indexRemove(accounts, accounts.indexOf(currentAccount))
    clearHtmlElements();
    transactionListSorted = false;
    currentAccount = null;
    currentUser = null;
    console.log(accounts);
  }
};

const logOut = () => {
  currentAccount = null;
  currentUser = null;
  footer.style.display = 'none';
  main.style.display = 'none';
  userName.textContent = 'please log in.'
  transactionListSorted = false;
}
const logOutTimer = () => {
  let time = 150;
  const interval = setInterval(function(){
    timer.textContent = `${Math.trunc(time/60)}:${time%60 > 9 ? time%60:'0'+(time%60).toString()}`
    time-=1;
    if(time===-1){
      // timer.textContent == '0:00';
      clearInterval(interval);
      logOut();
    }
  }, 1000);
  loginButton.addEventListener('click', () => {clearInterval(interval);});
}

//event listeners

loginButton.addEventListener('click', function () {
  login();
});
sortButton.addEventListener('click', function () {
  sortTransactions();

});
initiateTransfer.addEventListener('click', function () {
  transferMoney();
});
initiateRequest.addEventListener('click', function () {
  requestMoney();
});
closeUserButton.addEventListener('click', function () {
  closeUser();
});


const randomInt = (min, max) => {

}