'use strict';

// Accounts

const account1 = {
  owner: 'Mohamed Bekour',
  movements: [100, 680, -550, -120, 200, 500],
  interestRate: 1,
  pin: 1111,
};

const account2 = {
  owner: 'Niklas Muller',
  movements: [200, 200, -200, 500, 1200, -100],
  interestRate: 1.4,
  pin: 2222,
};

const account3 = {
  owner: 'Nicole Schune',
  movements: [500, -300, 850, -250, 600, -300],
  interestRate: 0.7,
  pin: 3333,
};
// All accounts of the App
const accounts = [account1, account2, account3];

// ---------------- Selecting Elements -----------------
const navBar = document.getElementById('nav-bar');
const loginButton = document.querySelector('.login-btn');
const mainContainer = document.getElementById('main_container');
const movementsContainer = document.querySelector('.movements');
const balance_value = document.querySelector('.balance_value');
const inValue = document.querySelector('.inValue');
const outValue = document.querySelector('.outValue');
const intrValue = document.querySelector('.intrValue');
const user = document.querySelector('.user-input');
const pin = document.querySelector('.pin-input');
const welcome = document.querySelector('.welcome');

// Transfer Elements
const transferBlock = document.querySelector('.transfer');
const tranferBtn = transferBlock.querySelector('.transferBtn');
const resieverUser = transferBlock.querySelector('.reciever');
const amountToTransfer = transferBlock.querySelector('.amount-value');

// close Accounts Elements
const closeBlock = document.querySelector('.close-account');
const closeUser = closeBlock.querySelector('.user-input');
const closePin = closeBlock.querySelector('.pin-input');
const closeBtn = closeBlock.querySelector('.form-btn');

// Request a Loan
const loanBlock = document.querySelector('.request-loan');
const loanAmount = loanBlock.querySelector('.loan-value');
const loanBtn = loanBlock.querySelector('.form-btn');

// Timer
const timeLeft = document.querySelector('.time-left');
console.log(timeLeft);

// Some Global Variables
let currAcc;
let timer;

// -------------------- Functions -------------------------

// generate User Names
const generateUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
// ---------- Timer Log Out -----------
// log out the Current logged in User
const logOutUser = function () {
  clearInterval(timer);
  currAcc = '';
  mainContainer.style.transition = '';
  mainContainer.style.opacity = '0';
  welcome.textContent = 'Log in to get started';
};
//
const convertSeconds = function (seconds) {
  const minutesLeft = Number.parseInt(seconds / 60);
  const secondsLeft = Number.parseInt(seconds % 60);

  let secondsLeftWithZero = secondsLeft.toString();
  if (secondsLeftWithZero.length === 1) {
    secondsLeftWithZero = `0${secondsLeftWithZero}`;
  }
  return `0${minutesLeft}:${secondsLeftWithZero}`;
};

const logOutTimer = function () {
  let t = 299;
  timer = setInterval(function () {
    timeLeft.textContent = convertSeconds(t);
    t--;
    if (t === 0) logOutUser();
  }, 1000);
};
// calculate and display The balance balance
const displayBalance = function getBalance(currAcc) {
  const balance = currAcc.movements.reduce((sum, mov) => sum + mov, 0);
  currAcc.balance = balance;
  balance_value.textContent = balance + '€';
};
// calculate and display the sum of all the deposits
const displayDepositsSum = function (currAcc) {
  const sum = currAcc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov);
  inValue.textContent = sum + '€';
};

// calculate and display the sum of all with withdrawals
const displayWithdrawalsSum = function (currAcc) {
  const sum = currAcc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov);
  outValue.textContent = sum + '€';
};

// calculate and display the interests
const displayInterest = function (currAcc) {
  const interest = currAcc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currAcc.interestRate) / 100)
    .reduce((acc, interest) => acc + interest);
  intrValue.textContent = interest.toFixed(2) + '€';
};
// Display All Movements of the logged in Accounts
const displayMovements = function (currAcc) {
  movementsContainer.innerHTML = '';
  currAcc.movements.forEach(function (mov, i) {
    // build out row
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const color = mov > 0 ? 'green' : 'red';
    const row = `
    <div class="row">
      <p class="type ${color}-row"><span class="index">${
      i + 1
    }</span> ${type}<p>
      <p class="amount">${mov}€</p>
    </div>`;
    movementsContainer.insertAdjacentHTML('afterbegin', row);
  });
};
// Transfer The Money
const transferMoney = function (e) {
  e.preventDefault();
  resieverUser.style.border = 'none';
  const money = Number(amountToTransfer.value);
  // get the reciever account
  const resieverAcc = accounts.find(acc => acc.userName === resieverUser.value);

  if (
    resieverAcc &&
    money > 0 &&
    currAcc.balance >= money &&
    resieverAcc?.userName !== currAcc.userName
  ) {
    currAcc.movements.push(-1 * money);
    resieverAcc.movements.push(money);
    // refresh the movements
    displayBalance(currAcc);
    displayMovements(currAcc);

    // reset the transfer Fields
    resieverUser.value = '';
    amountToTransfer.value = '';
  } else {
    transferBlock.style.opacity = '0.6';
  }
};

// Close Account
const closeAccount = function (e) {
  e.preventDefault();
  if (
    closeUser.value === currAcc.userName &&
    Number(closePin.value) === currAcc.pin
  ) {
    const indexAccountToRemove = accounts.findIndex(
      acc => closeUser.value === acc.userName
    );
    // delete the Account
    accounts.splice(indexAccountToRemove, 1);
    // hide the UI without Less Transition
    mainContainer.style.transition = 'opacity 0.3s ease';
    mainContainer.style.opacity = 0;
    welcome.textContent = 'Log in to get started';
  } else {
    closeBlock.style.opacity = '0.6';
  }
};
// Request a Loan
const requestLoan = function (e) {
  e.preventDefault();
  const loan = Number(loanAmount.value);
  const LoanPercentage = loan * 0.1;
  if (
    loan > 0 &&
    currAcc.movements.some(mov => mov > 0 && mov >= LoanPercentage)
  ) {
    setTimeout(function () {
      // update The UI
      currAcc.movements.push(loan);
      loanAmount.value = '';
      displayBalance(currAcc);
      displayMovements(currAcc);
      displayDepositsSum(currAcc);
      displayInterest(currAcc);
    }, 1000);
  } else {
    loanBlock.style.opacity = '0.6';
  }
};

// -------------------- Events ------------------------------

//  **** login Event ****
loginButton.addEventListener('click', function (e) {
  checkUser(e);
});

// *** Transfer Event ***
tranferBtn.addEventListener('click', function (e) {
  transferMoney(e);
});
// reset after wrong data
resieverUser.addEventListener('click', function (e) {
  transferBlock.style.opacity = '1';
});
amountToTransfer.addEventListener('click', function (e) {
  transferBlock.style.opacity = '1';
});

// *** Close Account Event ***
closeBtn.addEventListener('click', function (e) {
  closeAccount(e);
});
// Reset after wrong data
closeUser.addEventListener('click', function (e) {
  closeBlock.style.opacity = '1';
});
closePin.addEventListener('click', function (e) {
  closeBlock.style.opacity = '1';
});

//*** Request Loan*** /
loanBtn.addEventListener('click', function (e) {
  requestLoan(e);
});
// reset after wrong data
loanAmount.addEventListener('click', function (e) {
  loanBlock.style.opacity = 1;
});

// --------------------- Programm Start ----------------------
const checkUser = function (e) {
  e.preventDefault();

  // generate User Names
  generateUserNames(accounts);
  // Check if the timer is already Running
  if (timer !== null) {
    clearInterval(timer);
  }
  // start the log out Timer
  timeLeft.textContent = '05:00';
  logOutTimer();
  // get the current account
  currAcc = accounts.find(acc => acc.userName === user.value);

  if (currAcc?.pin === Number(pin.value)) {
    // make the input fields empty
    user.value = '';
    pin.value = '';

    // get rid of border of user & input fields
    user.style.border = 'none';
    pin.style.border = 'none';

    // Set the Welcome
    welcome.textContent = `Welcome back, ${currAcc.owner.split(' ')[0]}`;

    displayMovements(currAcc);
    displayBalance(currAcc);
    displayDepositsSum(currAcc);
    displayWithdrawalsSum(currAcc);
    displayInterest(currAcc);

    // Reset all fields
    user.value = '';
    pin.value = '';
    closeUser.value = '';
    closePin.value = '';

    closeBlock.style.opacity = '1';
    mainContainer.style.opacity = '1';
    mainContainer.style.transition = 'opacity 0.6s ease';
  } else {
    // login failed
    user.style.border = '1px solid red';
    pin.style.border = '1px solid red';
  }
};
