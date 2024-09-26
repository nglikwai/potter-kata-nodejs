/**
 * This function accepts a list of numbers where each number must be between 1 and 5, representing different books.
 * Example: [1, 1, 1, 2, 2, 3, 4, 5, 5]
 * @param {number[]} books
 * @return {string}
 * @throws {Error} If any number in the array is not between 1 and 5.
 */

// Method 1: Dynamic Programming & Backtracking
const calculateDiscountInDP = (books) => {
  const dp = new Map();

  const backtracking = (basket) => {
    const key = basket.join(".");

    if (dp.has(key)) return dp.get(key);
    if (basket.length === 0) return 0;

    for (let bookToTake = 1; bookToTake <= basket.length; bookToTake++) {
      const discount = 1 - (discountMap[bookToTake] || 0);

      for (
        let takePosition = 0;
        takePosition <= basket.length - bookToTake;
        takePosition++
      ) {
        const _basket = [...basket];

        for (let token = 0; token < bookToTake; token++) {
          _basket[takePosition + token]--;
        }

        const currentPrice =
          bookToTake * 8 * discount + backtracking(_basket.filter((i) => i));

        dp.set(key, Math.min(dp.get(key) || Infinity, currentPrice));
      }
    }

    return dp.get(key);
  };
  const normalizedBooks = normalizeData(books).sort((a, b) => a - b);

  return backtracking(normalizedBooks).toFixed(2);
};

// Method 2: Greedy & Two Pointer
const calculateDiscountInGreedy = (books) => {
  const basket = normalizeData(books);

  basket.sort((a, b) => b - a);

  const discountSet = Array.from({ length: basket[0] }, () => []);

  basket.forEach((sameBook, series) => {
    for (let s = 0; s < sameBook; s++) {
      discountSet[s].push(series);
    }
  });

  // move 1 book from set(5) to set(3), use two pointer
  let p1 = 0;
  let p2 = discountSet.findLastIndex((s) => s.length === 3);

  while (discountSet[p1]?.length === 5 && discountSet[p2]?.length === 3) {
    const bookTransfered = discountSet[p1].pop();
    discountSet[p2].push(bookTransfered);
    p1++;
    p2--;
  }

  return discountSet
    .reduce(
      (acc, s) => acc + s.length * 8 * (1 - (discountMap[s.length] || 0)),
      0
    )
    .toFixed(2);
};

const normalizeData = (books) => {
  if (books.some((book) => book < 1 || book > 5))
    throw new Error("Invalid book");
  const bookMap = new Map();

  books.forEach((book) => {
    bookMap.set(book, (bookMap.get(book) || 0) + 1);
  });

  return Array.from(bookMap.values());
};

const discountMap = {
  2: 0.05,
  3: 0.1,
  4: 0.2,
  5: 0.25,
};

// test case

const books = [
  1, 2, 3, 4, 5, 5, 3, 4, 5, 3, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 1, 3,
  2, 1, 3, 4, 5, 4, 5,
];

console.log(calculateDiscountInDP(books)); // 51.20
console.log(calculateDiscountInGreedy(books)); // 51.20
