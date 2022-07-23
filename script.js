'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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

const accounts = [account1, account2, account3, account4];

// Elements

//login
const userLoginInput = document.querySelector("#user");
const userPinLoginInput = document.querySelector("#userPin");
const loginButton = document.querySelector("#userChangeButt");
const userName = document.querySelector('#userName');

//Date and main money display
const asOfDate = document.querySelector("#date");
const balValue = document.querySelector("#balValue");

//bank functions
const main = document.querySelector(".Main");
const footer = document.querySelector("footer");
const transferTo = document.querySelector("#transferTo");
const transferAmount = document.querySelector("#transferAmount");
const initiateTransfer = document.querySelector("#initiateTransfer");
const requestAmount = document.querySelector("#requestAmount");
const initiateRequest = document.querySelector("#initiateRequest");
const closeUserName = document.querySelectorAll('#closeUserName');
const closeUserPin = document.querySelectorAll('#closeUserPin');
const closeUserButton = document.querySelectorAll('#closeUserButton');
const transactionsContainer = document.querySelector('#transactionsContainer');

//footer
const sortButton = document.querySelector("#sortButton");
const footerPositiveValues = document.querySelectorAll(".footerValueP");
const footerNegativeValue = document.querySelector(".footerValueN");

//prerequisites
let currentUser = '';
let currentAccount;
let numOfCurrentUserTransactions = 0;
main.style.display = 'none';
footer.style.display = 'none';
let transactionListSorted = false;

//fodder functions

const sum = (arr) => {
  let sum = 0;
  arr.forEach((element) => {
    sum+=Number(element);
  })
  return sum;
}
const positiveSum = (arr) => {
  let sum = 0;
  arr.forEach((element) => {
    element > 0 ? sum+=Number(element):sum+=0;
  })
  return sum;
}
const negativeSum = (arr) => {
  let sum = 0;
  arr.forEach((element) => {
    element < 0 ? sum+=Number(element):sum+=0;
  })
  return sum;
}
const indexRemove = function (arr,indx){
  let rearr = [];
  let cuindx = 0;
  for(let item of arr){
    if(indx!=cuindx){
      rearr.push(item);
    }
    cuindx+=1;
  }
  return rearr;
}


const addIndx = function (indx, arr, toadd){
  let rearr = [];
  let index = 0;
  for(let item of arr){
    if(indx==index){
      rearr.push(toadd);
      rearr.push(item);
    } else {
      rearr.push(item);
    }
    index+=1;
  }
  return rearr;
}

function sortArray(arr){
  let len = arr.length;
  let biggest;
  let cuindex;
  let smolindex;
  let rearr = [];
  for(let i=0; i<len; i++){
      smolindex=0;
      cuindex=0;
      biggest=arr[i];
      console.log(biggest)
      for(let num of arr){
          if(num>biggest&&cuindex>=i){
              biggest=num;
              smolindex=cuindex;
              
          }
          cuindex+=1;
          if(cuindex===len){
              break;
          }
      }
      arr = indexRemove(arr, smolindex);
      arr = addIndx(i,arr,biggest);
      rearr.push(biggest);
  }
  return rearr;
}

//functions

const clearHtmlElements = function (){
  if(numOfCurrentUserTransactions>0){  
    for(let i = 0; i<numOfCurrentUserTransactions; i++){
      transactionsContainer.removeChild(transactionsContainer.firstChild);
    }
  }
  numOfCurrentUserTransactions=0;
}

const createHtmlElements = function (arr, transactionTemplate='', movLen=(currentAccount.movements).length){
  for(let movement of arr){
    if(numOfCurrentUserTransactions<movLen-1){
    transactionTemplate = `<div class="transaction notlasttrans">
                              <div class="actionDate">
                                <h3 class="${movement > 0 ? "actionDisplayP":"actionDisplayN"}">${movLen-numOfCurrentUserTransactions} ${movement > 0 ? "Deposit":"Withdraw"}</h3>
                                <h3 class="actionDateDisplay"></h3>
                              </div>
                              <span class="financial">$${movement}</span>
                            </div>`
    transactionsContainer.innerHTML+=transactionTemplate;
    } else {
      transactionTemplate = `<div class="transaction">
                                <div class="actionDate">
                                  <h3 class="${movement > 0 ? "actionDisplayP":"actionDisplayN"}">${movement > 0 ? "Deposit":"Withdraw"}</h3>
                                  <h3 class="actionDateDisplay"></h3>
                                </div>
                                <span class="financial">$${movement}</span>
                              </div>`
    transactionsContainer.innerHTML+=transactionTemplate;
    }
    numOfCurrentUserTransactions+=1;
  }
}

const login = function (){
  const usernameinput=userLoginInput.value;
  const usernamepininput =userPinLoginInput.value;
  if(usernameinput!=currentUser){
    for(let account of accounts){
      if(account.username===usernameinput && account.pin === Number(usernamepininput)){
        currentUser=account.username;
        for(let i=0; i<accounts.length;i++){
          if(accounts[i].username===currentUser){
            currentAccount=accounts[i];
          }
        }
        clearHtmlElements();
        footer.style.display = 'flex';
        main.style.display = 'block';
        let movLen = (currentAccount.movements).length;
        createHtmlElements(currentAccount.movements);
        balValue.textContent = `$ ${sum(currentAccount.movements)}`
        userName.textContent = `${currentAccount.owner}!`;
        footerPositiveValues[0].textContent = `$${positiveSum(currentAccount.movements)}`;
        footerPositiveValues[1].textContent = `$${Math.trunc(positiveSum(currentAccount.movements)*currentAccount.interestRate/100)}`;
        footerNegativeValue.textContent = `$${negativeSum(currentAccount.movements)}`;
        transactionListSorted = false;
        break;
      }
    }
  }
}

const sortTransactions = function (){
  clearHtmlElements();
  const sortedActions = sortArray(currentAccount.movements);
  createHtmlElements(sortedActions);
  transactionListSorted = true;
}











//event listeners

loginButton.addEventListener('click', function(){login()});
sortButton.addEventListener('click', function(){sortTransactions()});