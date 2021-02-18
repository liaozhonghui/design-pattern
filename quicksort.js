function quicksort(a, start, end) {
  if (start > end) return;

  let i = parition(a, start, end);
  quicksort(a, start, i - 1);
  quicksort(a, i + 1, end);
}
function parition(a, start, end) {
  let pivot = end;
  let i = start;
  for (let j = start; j < end; j++) {
    if (a[j] < a[pivot]) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  console.log('a:', a);
  console.log('i:', i);
  [a[i], a[end]] = [a[end], a[i]];
  return i;
}

let arr = [8, 7, 2, 5, 4, 3, 1, 9];
quicksort(arr, 0, arr.length - 1);
console.log('arr:', arr);
