// *********************** SLIDER CONFIG *********************** \\
const swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  spaceBetween: 50,
  centeredSlides: false,
  breakpoints: {
    1300: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 3,
    },

    550: {
      slidesPerView: 2,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// *********************** CHECK IF WINDOW IS SCROLLED *********************** \\
const navbar = document.querySelector("#navbar");
window.addEventListener("scroll", function () {
  navbar.classList.remove("translate-y-[300%]");
  navbar.classList.add("translate-y-[0%]");

  // *********************** CHECK IF USER AFK *********************** \\
  let inactivityTime = 0;
  const afkThreshold = 3000; // User afk limit time

  function resetTimer() {
    inactivityTime = 0;
  }

  function checkInactivity() {
    inactivityTime += 1000; // Increase the time counter by 1 second
    if (inactivityTime >= afkThreshold) {
      const navbar = document.querySelector("#navbar");

      navbar.classList.add("translate-y-[300%]");
      navbar.classList.remove("translate-y-[0%]");
    }
  }

  // Reset the timer on user activity
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("scroll", resetTimer);

  // Check for inactivity every second
  setInterval(checkInactivity, 1000);

  // *********************** UPDATE TIME EVERY MINUTE *********************** \\
  function updateTime() {
    const timeText = document.querySelector("#current-time");
    const currentTime = new Date();

    timeText.innerText = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  updateTime();
  setInterval(updateTime, 10);
});

// *********************** SAVED BOOKS *********************** \\
const toggleSaved = document.querySelectorAll(".toggleSaved");
toggleSaved.forEach((button) => {
  const savedContainer = document.querySelector(".savedBooksContainer");
  button.addEventListener("click", function () {
    savedContainer.classList.toggle("translate-x-[100%]");
    const savedBooksString = localStorage.getItem("savedBooks");

    const savedBooks = JSON.parse(savedBooksString) || [];
    displaySavedBooks(savedBooks);
  });
  const backButton = document.querySelector(".backButton");
  backButton.addEventListener("click", function () {
    savedContainer.classList.remove("translate-x-[0%]");
    savedContainer.classList.add("translate-x-[100%]");
  });
});

const deleteSavedBooks = document.querySelector(".deleteSaved");
deleteSavedBooks.addEventListener("click", function () {
  localStorage.clear();
});

// *********************** POPULAR BOOKS *********************** \\
async function getPopularBooks() {
  const currentDate = new Date().toISOString().split("T")[0];
  const popularBooks = await fetchPopularBooks(currentDate);

  const popularTitles = popularBooks.flatMap((popular) => popular.books.map((book) => book));
  console.log(popularTitles);

  displayPopularBooks(popularTitles);
}
getPopularBooks();

// *********************** GET POPULAR BOOKS *********************** \\
async function fetchPopularBooks(date) {
  try {
    const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?published_date=${date}&api-key=GgqWyqrNhJvswKkIAkzuIwqAVWs78M0C`);
    const data = await response.json();
    return data.results.lists;
  } catch (error) {
    console.log(error);
    return [];
  }
}
// *********************** EVENT WHEN USER SEARCH A BOOK *********************** \\
const searchBtn = document.querySelector("#search-btn");
const inputKeyword = document.querySelector("#search-box");
searchBtn.addEventListener("click", async function () {
  let searchedBooks = await getBooks(inputKeyword.value);

  // Check if the books available
  if (!searchedBooks) {
    alert("kosong");
    searchContainer.innerHTML = `<div class="bg-dangerLight w-full p-4 text-danger text-center text-md font-medium shadow-lg rounded-lg tablet:text-xl">Please type something in the search box</div>`;
  } else {
    console.log(searchedBooks);
    displayBooks(searchedBooks);
  }
});

// *********************** GET BOOKS *********************** \\
async function getBooks(keyword) {
  // Lazy loading
  searchContainer.innerHTML = lazyLoading();
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}&key=AIzaSyD952R5dTCubXZWsul-S7TiGwzsY9IF0uw`);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// *********************** DISPLAY BOOKS TO HTML *********************** \\
// Popular Books
const popularContainer = document.querySelector(".popular-books");
function displayPopularBooks(book) {
  let popularBooksCard = "";

  book.forEach((bookList) => (popularBooksCard += mappedPopularBooksInContainer(bookList)));
  popularContainer.innerHTML = popularBooksCard;
}
// Search books
const searchContainer = document.querySelector(".searchBox");
function displayBooks(book) {
  let booksCard = "";

  book.forEach((bookList) => (booksCard += mappedBooksInContainer(bookList)));
  searchContainer.innerHTML = booksCard;
}

// *********************** SAVE BOOK TO LOCAL STORAGE *********************** \\
// Add event listener to handle save button clicks
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("save")) {
    const bookImg = event.target.dataset.img;
    const bookAuthor = event.target.dataset.author;
    const bookTitle = event.target.dataset.title;
    const genreAndPublisher = event.target.dataset.genre;
    const bookData = {
      image: bookImg,
      author: bookAuthor,
      title: bookTitle,
      genreAndPublisher: genreAndPublisher,
    };

    const savedBooks = await saveBookToLocalStorage(bookData);
    displaySavedBooks(savedBooks);
  }
});

// Save book to local storage
async function saveBookToLocalStorage(bookData) {
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  savedBooks.push(bookData);
  localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
  return savedBooks;
}

// Display saved books
function displaySavedBooks(booksData) {
  const savedContentDiv = document.querySelector(".saved");
  savedContentDiv.innerHTML = booksData.map(mapSavedBook).join("");
}

// *********************** MAPPED BOOKS TO CARD *********************** \\
// Popular book
function mappedPopularBooksInContainer(bookList) {
  // return card value
  return `<div class="swiper-slide bg-white p-4 rounded-xl" id="books-box">
  <img src="${bookList.book_image}" alt="books" class="w-full h-80 rounded-xl" />
  <div class="mt-10">
    <h2 class="uppercase text-lg font-bold text-main tracking-tight h-[52px]">${bookList.author}</h2>
    <p class="capitalize mb-8 mt-2 text-xl font-semibold text-dark tracking-tight h-[52px]">${bookList.title}</p>
    <span class="py-2 px-4 bg-gray-300 rounded-full max-w-lg text-dark tracking-tight">${bookList.publisher}</span>
    
    <div class="flex gap-6 justify-between mt-10">
    <button class="save w-full bg-main rounded-full text-white h-12 font-medium" data-img="${bookList.book_image}" data-author="${bookList.author}" data-title="${bookList.title}" data-genre="${bookList.publisher}">Save to Library<i class="fa-solid fa-bookmark ml-2"></i></button>
    </div>
  </div>
</div>`;
}

// Search book
function mappedBooksInContainer(bookList) {
  // card logic
  const { volumeInfo } = bookList;
  const truncatedTitle = volumeInfo.title.length > 30 ? volumeInfo.title.substring(0, 30) + "..." : volumeInfo.title;
  const checkThumbnail = !volumeInfo.imageLinks ? "../../src/images/notfoundimage.png" : volumeInfo.imageLinks.thumbnail;
  // return card value
  return `<div class="mb-10 bg-white p-4 rounded-xl shadow-xl" id="books-box">
  <img src="${checkThumbnail}" alt="books" class="shadow-xl w-64 h-80 rounded-xl" />
  
  <div class="mt-6">
    <h2 class="uppercase text-lg font-bold text-main tracking-tight w-64 h-[52px]">${volumeInfo.authors}</h2>
    <p class="capitalize mb-8 mt-2 text-xl font-semibold text-dark tracking-tight w-64 h-[52px]">${truncatedTitle}</p>
    <span class="py-2 px-4 bg-gray-300 rounded-full max-w-lg text-dark tracking-tight">${!volumeInfo.categories ? "Unknown Categories" : volumeInfo.categories[0].split(",")[0]}</span>

    <div class="flex gap-6 justify-between mt-10">
    <button class="save w-full bg-main rounded-full text-white h-12 font-medium" data-img="${checkThumbnail}" data-author="${volumeInfo.authors}" data-title="${truncatedTitle}" data-genre="${
    !volumeInfo.categories ? "Unknown Categories" : volumeInfo.categories[0].split(",")[0]
  }">Save to Library<i class="fa-solid fa-bookmark ml-2"></i></button>
    </div>
  </div>
</div>`;
}

// Map a saved book to HTML markup
function mapSavedBook(data) {
  const savedImg = data.image;
  const savedTitle = data.title;
  const savedAuthor = data.author;
  const savedGenreandPublisher = data.genreAndPublisher;
  return ` <div class="savedCard mt-8 flex">
  <img src="${savedImg}"  class="w-32 h-40 rounded-xl" />
  <div class="savedText ml-4">
    <h2 class="text-main font-semibold capitalize text-sm">${savedAuthor}</h2>
    <p class="text-dark capitalize mt-2 mb-6">${savedTitle}</p>
    <span class="mt-3 py-2 px-4 bg-gray-300 rounded-full text-sm text-dark tracking-tight">${savedGenreandPublisher}</span>
  </div>
</div>`;
}
// *********************** LAZY LOADING CARD *********************** \\
function lazyLoading() {
  const lazyCardTemplate = `
    <div class="mb-10 bg-white p-4 rounded-xl shadow-xl" id="books-box">
      <div class="bg-gray-300 w-64 h-80 rounded-xl animate-pulse"></div>
    
      <div class="mt-6">
        <h2 class="uppercase text-lg font-bold text-main tracking-tight w-64 animate-pulse"></h2>
        <p class="capitalize mb-8 mt-2 text-xl font-semibold text-dark tracking-tight w-64 animate-pulse"></p>
        <span class="py-5 px-4 block bg-gray-300 rounded-full w-48 text-dark tracking-tight animate-pulse"></span>
    
        <div class="flex gap-6 justify-between mt-10">
          <button class="w-full bg-gray-300 rounded-full text-white h-12 font-medium animate-pulse"></button>
        </div>
      </div>
    </div>
  `;

  // Repeat the template for the desired number of lazy cards
  const numberOfLazyCards = 8;
  const lazyCards = Array.from({ length: numberOfLazyCards }, () => lazyCardTemplate).join("");

  return lazyCards;
}
