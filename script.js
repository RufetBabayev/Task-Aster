import formatDateToFrontend, { setStorage } from "./helper.js";
import { getCategories, getNews, loginTo } from "./request.js";

// selectors
const weatherCondition = document.querySelector("#weatherCondition");
const temp = document.querySelector("#temp");
const celsiusBtn = document.querySelector("#celsiusBtn");
const fahrenheitBtn = document.querySelector("#fahrenheitBtn");
const weatherIcon = document.querySelector("#weatherIcon");
const signInBtn = document.querySelector("#signInBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const acceptBtn = document.querySelector("#acceptBtn");
const modalContainer = document.querySelector("#modalContainer");
const categories = document.querySelector("#categories");
const overlay = document.querySelector("#overlay");
const newsContainer = document.querySelector("#newsContainer");

// api tools

const key = "b4a99d8cd64c6760b1205f6c5d4cef8c";
const url = "https://api.openweathermap.org/data/2.5/";

async function getData(cityName) {
  const fetchData = await fetch(
    `${url}weather?q=${cityName}&appid=${key}&lang=en`
  );
  if (fetchData.status === 200) {
    let res = await fetchData.json();
    createUi(res);
  }
}
getData("baku");

function getIcon(icon) {
  const iconObj = {
    "01d": "http://openweathermap.org/img/wn/01d@2x.png",
    "02d": "https://openweathermap.org/img/wn/02d@2x.png",
  };

  return iconObj[icon];
}

function kelvinToCelcius(currentTemp) {
  const celc = currentTemp - 272.15;
  return celc.toFixed(0);
}

function createUi(cityData) {
  const toCelcius = kelvinToCelcius(cityData.main.temp);
  temp.textContent = toCelcius + "°C ";
  weatherCondition.textContent = cityData.weather[0].main;
  weatherIcon.src = getIcon(cityData.weather[0].icon);

  function btnF() {
    temp.textContent = (+toCelcius * 1.8 + 32).toFixed(0) + "°F";
    fahrenheitBtn.classList.remove("text-opacity-30");
    celsiusBtn.classList.add("text-opacity-30");
  }
  fahrenheitBtn.addEventListener("click", () => btnF());

  function btnC() {
    temp.textContent = toCelcius + "°C ";
    fahrenheitBtn.classList.add("text-opacity-30");
    celsiusBtn.classList.remove("text-opacity-30");
  }
  celsiusBtn.addEventListener("click", () => btnC());
}

function openModal() {
  modalContainer.classList.replace("scale-0", "scale-100");
  overlay.classList.replace("d-none", "d-block");
}
export function closeModal() {
  modalContainer.classList.replace("scale-100", "scale-0");
  overlay.classList.replace("d-block", "d-none");
}

signInBtn.addEventListener("click", openModal);
overlay.addEventListener("click", closeModal);

//==============================================

const categoryIcon = (icon) => {
  const icons = {
    world: "fa-globe",
    politics: "fa-briefcase",
    sports: "fa-medal",
  };

  return icons[icon];
};

async function createCategoryUi() {
  const data = await getCategories();
  let categoryHome = `   <li class=" flex alingItems pl-32">
              <a class="flex alingItems" href="./pages/view.html">
                <i class="home fa-solid fa-house icon--sm"></i>
                <p class="home text--sm pl-16 font--700">Top Stories</p>
              </a>
            </li>`;
  const html = data
    .map((category, index) => {
      return `    <li class="flex  alingItems pl-32 pt-16">
        <a class="flex alingItems" href="./pages/view.html">
        ${index == 3 ? "<div></div>" : ""}
              <i class="fa-solid ${categoryIcon(category.slug)} icon--sm"></i>
              <p class="text--sm pl-16 font--700">${category.name} </p>
               </a>
            </li>`;
    })
    .join("");
  categoryHome += html;
  categories.innerHTML = categoryHome;

  const li = document.querySelectorAll("li");
  li.forEach((item) => {
    item.addEventListener("click", () => {
      li.forEach((l) => {
        l.addEventListener("click", () => {
          item.classList.remove("nav--active");
          l.classList.add("nav--active");
        });
      });
    });
  });
}

createCategoryUi();

async function createNewsUi() {
  const news = await getNews();

  const html = news.data
    .map((n, index) => {
      return ` <a data-slug=${n.slug} class="d-block newsItem div${
        index + 1
      } flex p-16" href="./pages/view.html">
     
                <div class="flex flex-column justifyAround">
                  <p class="font--500 text--xl">
                    ${n.title}
                   
                  </p>

                  <p class="text-opacity-60">
                    Samsung Galaxy F22 has been launched in India. The new
                    smartphone has been priced in the mid-range segment. The new
                    smartphone is powered by a MediaTek chipset and features a
                    high refresh rate AMOLED display.
                  </p>
                  <div class="position-relative flex alingItems">
                    <div class="pr-32 text-opacity-40">
                      <span>The Mint</span>
                      <span class="minute--point-md px-32">${formatDateToFrontend(
                        n.published_date
                      )} gun evvel</span>
                    </div>
                    <div class="box-end pl-32">
                      <i class="fa-solid fa-arrow-up-from-bracket pr-8"></i>
                      <span class="pr-32">Share</span>
                      <i class="fa-solid fa-shield pr-8"></i>
                      <span>Read Later</span>
                    </div>
                  </div>
                </div>
                <figure class="flex alingItems pl-32">
                  <img
                    class="img--md pr-8"
                    src=${n.photo}
                    alt=""
                  />
                </figure>
              </a>`;
    })
    .join("");
  newsContainer.innerHTML = html;

  const newsItem = document.querySelectorAll(".newsItem");
  newsItem.forEach((newsItems) => {
    newsItems.addEventListener("click", () => {
      const slug = newsItems.getAttribute("data-slug");
      setStorage("slug", slug);
    });
  });
}

createNewsUi();

// loginTo()
