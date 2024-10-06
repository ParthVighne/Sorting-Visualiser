const arrayContainer = document.getElementById("array");
const generateArrayBtn = document.getElementById("generateArray");
const startSortBtn = document.getElementById("startSort");
const speedSlider = document.getElementById("speed");
const algorithmSelector = document.getElementById("algorithm");
let array = [];

// Generate a random array and display the bars
function generateArray(size = 40) {
  array = [];
  arrayContainer.innerHTML = ""; // Clear previous array

  // Create new array bars
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 100) + 1;
    array.push(value);

    // Create a bar element
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 4.5}px`; // Scale the height for better visuals
    bar.style.width = `${100 / size}%`; // Make bars responsive
    bar.style.transition = "height 0.3s ease, background-color 0.3s ease";
    arrayContainer.appendChild(bar);
  }
}

// Swap two bar heights (visual swap)
function swap(bar1, bar2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tempHeight = bar1.style.height;
      bar1.style.height = bar2.style.height;
      bar2.style.height = tempHeight;
      resolve();
    }, 100 - speedSlider.value); // Delay based on slider speed
  });
}

// Bubble Sort Algorithm with Visualization
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.backgroundColor = "blue";
      bars[j + 1].style.backgroundColor = "blue";

      if (array[j] > array[j + 1]) {
        await swap(bars[j], bars[j + 1]);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }

      bars[j].style.backgroundColor = "#ff7979"; // Back to original color
      bars[j + 1].style.backgroundColor = "#ff7979";
    }
    bars[array.length - i - 1].style.backgroundColor = "green"; // Sorted
  }
}

// Quick Sort Algorithm
async function quickSort(start, end) {
  if (start >= end) return;
  const index = await partition(start, end);
  await Promise.all([quickSort(start, index - 1), quickSort(index + 1, end)]);
}

async function partition(start, end) {
  const bars = document.querySelectorAll(".bar");
  let pivot = array[end];
  bars[end].style.backgroundColor = "blue";
  let i = start - 1;
  for (let j = start; j < end; j++) {
    if (array[j] < pivot) {
      i++;
      await swap(bars[i], bars[j]);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  await swap(bars[i + 1], bars[end]);
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  bars[end].style.backgroundColor = "#ff7979";
  bars[i + 1].style.backgroundColor = "green"; // Mark sorted
  return i + 1;
}

// Merge Sort
async function mergeSort(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);

  // Recursively sort both halves
  await Promise.all([mergeSort(start, mid), mergeSort(mid + 1, end)]);

  // Merge sorted halves
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const bars = document.querySelectorAll(".bar");
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);

  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i] * 4}px`;
      bars[k].style.backgroundColor = "blue";
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j] * 4}px`;
      bars[k].style.backgroundColor = "blue";
      j++;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 100 - speedSlider.value)
    ); // Delay for visualization
    k++;
  }

  // Copy remaining elements of left[] if any
  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i] * 4}px`;
    bars[k].style.backgroundColor = "blue";
    i++;
    await new Promise((resolve) =>
      setTimeout(resolve, 100 - speedSlider.value)
    );
    k++;
  }

  // Copy remaining elements of right[] if any
  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j] * 4}px`;
    bars[k].style.backgroundColor = "blue";
    j++;
    await new Promise((resolve) =>
      setTimeout(resolve, 100 - speedSlider.value)
    );
    k++;
  }

  // Mark the sorted range
  for (let x = start; x <= end; x++) {
    bars[x].style.backgroundColor = "green";
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    bars[i].style.backgroundColor = "blue";

    // Move elements of array[0..i-1] that are greater than key, one position ahead
    while (j >= 0 && array[j] > key) {
      bars[j].style.backgroundColor = "blue";
      array[j + 1] = array[j];
      await swap(bars[j + 1], bars[j]);
      bars[j].style.backgroundColor = "#ff7979";
      j = j - 1;
    }

    array[j + 1] = key;
    bars[i].style.backgroundColor = "#ff7979";
  }

  // Mark the array as fully sorted
  for (let i = 0; i < array.length; i++) {
    bars[i].style.backgroundColor = "green";
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    bars[minIndex].style.backgroundColor = "blue";
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = "blue";
      if (array[j] < array[minIndex]) {
        bars[minIndex].style.backgroundColor = "#ff7979";
        minIndex = j;
        bars[minIndex].style.backgroundColor = "blue";
      }
      bars[j].style.backgroundColor = "#ff7979";
    }
    if (minIndex !== i) {
      await swap(bars[i], bars[minIndex]);
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
    bars[i].style.backgroundColor = "green";
    bars[minIndex].style.backgroundColor = "#ff7979";
  }
}

// Event Listeners
generateArrayBtn.addEventListener("click", () => generateArray(40)); // Generate new array on click

startSortBtn.addEventListener("click", async () => {
  const algorithm = algorithmSelector.value;
  switch (algorithm) {
    case "bubble":
      await bubbleSort();
      break;
    case "quick":
      await quickSort(0, array.length - 1);
      break;
    case "merge":
      await mergeSort(0, array.length - 1);
      break;
    case "selection":
      await selectionSort();
      break;
    case "insertion":
      await insertionSort();
      break;
    default:
      alert("Please select a valid algorithm!");
  }
});

// Initialize with a random array on page load
generateArray(40);
