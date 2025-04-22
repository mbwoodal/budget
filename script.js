// script.js
let currentUser = null;
let currentMonth = new Date().toISOString().substring(0, 7);

const authPage = document.getElementById('auth-page');
const mainApp = document.getElementById('main-app');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const transactionForm = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const typeInput = document.getElementById('type');
const transactionsList = document.getElementById('transactions');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const currentMonthEl = document.getElementById('current-month');

function updateUI() {
  const data = getUserData();
  const monthData = data[currentMonth] || [];

  transactionsList.innerHTML = '';
  let totalIncome = 0;
  let totalExpense = 0;

  monthData.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = item.type === 'expense' ? 'expense' : '';
    li.innerHTML = `
      $${item.amount} - ${item.description || 'No description'}
      <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
    `;
    transactionsList.appendChild(li);
    if (item.type === 'income') totalIncome += parseFloat(item.amount);
    else totalExpense += parseFloat(item.amount);
  });

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  balanceEl.textContent = (totalIncome - totalExpense).toFixed(2);
  currentMonthEl.textContent = currentMonth;
}

function getUserData() {
  return JSON.parse(localStorage.getItem(currentUser)) || {};
}

function saveUserData(data) {
  localStorage.setItem(currentUser, JSON.stringify(data));
}

function deleteTransaction(index) {
  const data = getUserData();
  if (!data[currentMonth]) return;
  data[currentMonth].splice(index, 1);
  saveUserData(data);
  updateUI();
}

transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;
  const type = typeInput.value;

  if (!amount || isNaN(amount)) return;

  const data = getUserData();
  if (!data[currentMonth]) data[currentMonth] = [];
  data[currentMonth].push({ amount, description, type });
  saveUserData(data);
  transactionForm.reset();
  updateUI();
});

function prevMonth() {
  const [year, month] = currentMonth.split('-').map(Number);
  const date = new Date(year, month - 2);
  currentMonth = date.toISOString().substring(0, 7);
  updateUI();
}

function nextMonth() {
  const [year, month] = currentMonth.split('-').map(Number);
  const date = new Date(year, month);
  currentMonth = date.toISOString().substring(0, 7);
  updateUI();
}

function login() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const stored = localStorage.getItem('user_' + email);
  if (!stored) return alert('User not found');
  const { pwd } = JSON.parse(stored);
  if (pwd !== password) return alert('Incorrect password');
  currentUser = email;
  authPage.classList.add('hidden');
  mainApp.classList.remove('hidden');
  updateUI();
}

function register() {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) return alert('Enter both email and password');
  if (localStorage.getItem('user_' + email)) return alert('User already exists');
  localStorage.setItem('user_' + email, JSON.stringify({ pwd: password }));
  alert('Registration successful! Please login.');
}
