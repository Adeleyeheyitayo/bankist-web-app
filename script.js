'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////// Practical Actual Code \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);

  const withdraws = acc.movements
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0);

  const interest = acc.movements
    .filter(value => value > 0)
    .map(value => (value * acc.interestRate) / 100)
    .filter((value, i, arr) => value >= 1)
    .reduce((acc, value) => acc + value, 0);

  labelSumInterest.textContent = `${interest}€`;
  labelSumOut.textContent = `${Math.abs(withdraws)}€`;
  labelSumIn.textContent = `${incomes}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value.at(0))
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

///////////////////////////////// Event Handler \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    value => value.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and wlcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer Funds Functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    value => value.username === inputTransferTo.value
  );

  // Clearing Input field of the button
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentAccount.balance &&
    recieverAcc.username !== currentAccount.username
  ) {
    // Doing The Transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Request Loan Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(value => value >= amount * 0.1)
  ) {
    // Add the loan into the movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const nameClose = inputCloseUsername.value;
  const pinClose = Number(inputClosePin.value);
  // console.log(nameClose, pinClose, currentAccount.username, currentAccount.pin);
  // console.log('Delete');

  if (
    nameClose &&
    pinClose &&
    currentAccount.username === nameClose &&
    currentAccount.pin === pinClose
  ) {
    const index = accounts.findIndex(
      value => value.username === currentAccount.username
    );

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  nameClose = pinClose = '';
  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
