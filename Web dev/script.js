// =====================
// Part 1: JavaScript Basics
// =====================
const checkAgeBtn = document.getElementById('checkAgeBtn');
const ageResult = document.getElementById('ageResult');

checkAgeBtn.addEventListener('click', () => {
  const age = parseInt(document.getElementById('ageInput').value);
  if (isNaN(age)) {
    ageResult.textContent = "Please enter a valid number.";
  } else if (age >= 18) {
    ageResult.textContent = "You are an adult.";
  } else {
    ageResult.textContent = "You are a minor.";
  }
});

// =====================
// Part 2: Functions
// =====================
function sum(a, b) {
  return a + b;
}

const sumBtn = document.getElementById('sumBtn');
const sumResult = document.getElementById('sumResult');

sumBtn.addEventListener('click', () => {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  if (isNaN(num1) || isNaN(num2)) {
    sumResult.textContent = "Please enter valid numbers.";
  } else {
    sumResult.textContent = `Sum: ${sum(num1, num2)}`;
  }
});

// =====================
// Part 3: Loops
// =====================
const showListBtn = document.getElementById('showListBtn');
const numberList = document.getElementById('numberList');

showListBtn.addEventListener('click', () => {
  numberList.innerHTML = ""; // Clear previous list
  for (let i = 1; i <= 5; i++) {
    const li = document.createElement('li');
    li.textContent = `Number ${i}`;
    numberList.appendChild(li);
  }
});

// =====================
// Part 4: DOM Manipulation
// =====================
const toggleBtn = document.getElementById('toggleBtn');
const highlightText = document.getElementById('highlightText');

toggleBtn.addEventListener('click', () => {
  highlightText.classList.toggle('highlight');
});

// Dynamic List Addition
const addItemBtn = document.getElementById('addItemBtn');
const dynamicList = document.getElementById('dynamicList');
let itemCount = 1;

addItemBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.textContent = `Dynamic Item ${itemCount++}`;
  dynamicList.appendChild(li);
});
