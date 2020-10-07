"use strict";

// ===================================
// VARIABLES
// ===================================

const refs = {
  page: document.querySelector(".page"),
  grid: document.querySelector(".grid"),
  form: document.querySelector(".form"),
  queryInput: document.querySelector(".input"),
  showMoreButton: document.querySelector(".load-more")
};

const request = {
  page: 1,
  query: "",

  resetPage() {
    refs.grid.innerHTML = "";
    this.page = 1;
  },
  incrementPage() {
    this.page += 1;
  }
};

const API_KEY = "7231268-668b9782a3d5ba8acee68f193";

// ===================================
// EVENT LISTENERS
// ===================================

refs.form.addEventListener("submit", handleFormSubmit);
refs.showMoreButton.addEventListener("click", handleShowMoreButtonClick);

// ===================================
// FUNCTIONS
// ===================================

function handleFormSubmit(event) {
  event.preventDefault();

  request.resetPage();

  request.query = refs.queryInput.value;

  handleFetch();

  refs.form.reset();
}

function handleShowMoreButtonClick() {
  request.incrementPage();

  handleFetch();
}

function handleFetch() {
  toggleLoader();

  fetchImages({ query: request.query, page: request.page })
    .then(items => {
      toggleLoader();
      const markup = getGridItems(items);
      refs.grid.insertAdjacentHTML("beforeend", markup);
    })
    .catch(error => console.log(error));
}

function fetchImages({ query, page }) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&per_page=9&page=${page}`;

  return fetch(url)
    .then(response => {
      if (response.ok) return response.json();

      throw new Error("Error while fetching");
    })
    .then(data => data.hits)
    .catch(error => console.log(error));
}

function getGridItems(items) {
  return items.reduce(
    (acc, element) =>
      acc + `<div class="grid-item"><img src="${element.webformatURL}"></div>`,
    ""
  );
}

function toggleLoader() {
  refs.page.classList.toggle("show-loader");
}
