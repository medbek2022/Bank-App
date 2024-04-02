'use strict';

// Accounts

const account1 = {
  user: 'Mohamed Bekour',
  movements: [200, 450, -150, 700, -300],
  interestRate: 1.7,
  pin: 1111,
};

const account2 = {
  user: 'Salim Bekour',
  movements: [500, 850, -250, 600, -300],
  interestRate: 1.7,
  pin: 2222,
};
// Selecting Elements
const navBar = document.getElementById('nav-bar');

const loginButton = document.querySelector('.login-btn');
const body = document.querySelector('body');

// Programm Start
const checkUser = function () {
  navBar.classList.add('hidden');
};
loginButton.addEventListener('click', checkUser);
