// *********************** SLIDER CONFIG *********************** \\
$(".slider").slick({
  dots: true,
  speed: 300,
  arrows: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 720,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
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
const searchContainer = document.querySelector(".searchBox");
function displayBooks(book) {
  let booksCard = "";

  book.forEach((bookList) => (booksCard += mappedBooksInContainer(bookList)));
  searchContainer.innerHTML = booksCard;
}

// *********************** MAPPED BOOKS TO CARD *********************** \\
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
      <button class="w-full bg-main rounded-full text-white h-12 font-medium">Synopsis</button>
      <button class="border px-4 border-dark  rounded-full text-dark font-medium"><i class="fa-solid fa-bookmark"></i></button>
    </div>
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
          <button class="border px-6 bg-gray-300 rounded-full h-12 animate-pulse"></button>
        </div>
      </div>
    </div>
  `;

  // Repeat the template for the desired number of lazy cards
  const numberOfLazyCards = 8;
  const lazyCards = Array.from({ length: numberOfLazyCards }, () => lazyCardTemplate).join("");

  return lazyCards;
}
