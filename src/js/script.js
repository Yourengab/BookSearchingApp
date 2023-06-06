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
  const searchedBooks = await getBooks(inputKeyword.value);

  console.log(searchedBooks);
  displayBooks(searchedBooks);
});

// *********************** GET BOOKS *********************** \\
async function getBooks(keyword) {
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
function displayBooks(book) {
  const searchContainer = document.querySelector(".searchBox");
  let booksCard = "";

  book.forEach((bookList) => (booksCard += mappedBooksInContainer(bookList)));
  searchContainer.innerHTML = booksCard;
}

// *********************** MAPPED BOOKS TO CARD *********************** \\
function mappedBooksInContainer(bookList) {
  const { volumeInfo } = bookList;
  const truncatedTitle = volumeInfo.title.length > 30 ? volumeInfo.title.substring(0, 30) + "..." : volumeInfo.title;

  return `<div class="mb-10 bg-white p-4 rounded-xl shadow-xl" id="books-box">
  <img src="${volumeInfo.imageLinks.thumbnail}" alt="books" class="shadow-xl w-64 h-80 rounded-xl" />
  
  <div class="mt-6">
    <h2 class="uppercase text-lg font-bold text-main tracking-tight w-64">${volumeInfo.authors}</h2>
    <p class="capitalize mb-8 mt-2 text-xl font-semibold text-dark tracking-tight w-64">${truncatedTitle}</p>
    <span class="py-2 px-4 bg-gray-300 rounded-full max-w-lg text-dark tracking-tight">${!volumeInfo.categories ? "Unknown Categories" : volumeInfo.categories[0].split(",")[0]}</span>

    <div class="flex gap-6 justify-between mt-10">
      <button class="w-full bg-main rounded-full text-white h-12 font-medium">Synopsis</button>
      <button class="border px-4 border-dark  rounded-fullh-12 rounded-full text-dark font-medium"><i class="fa-solid fa-bookmark"></i></button>
    </div>
  </div>
</div>`;
}
