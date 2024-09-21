import { getStorage, removeStorage } from "./helper.js";
import { loginTo } from "./request.js";
import { closeModal } from "./script.js";

const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const emailErr = document.querySelector("#emailErr");
const passErr = document.querySelector("#passErr");
const signInBtn = document.querySelector("#signInBtn");
const userImg = document.querySelector("#userImg");
const username = document.querySelector("#username");
const userProfile = document.querySelector("#userProfile");
const logout = document.querySelector("#logout");

const userData = {};

email.addEventListener("input", (e) => (userData["email"] = e.target.value));
password.addEventListener(
  "input",
  (e) => (userData["password"] = e.target.value)
);

const saveData = async (e) => {
  e.preventDefault();
  const res = await loginTo(userData);

  if (res.email) {
    emailErr.textContent = res.email;
  } else if (res.password) {
    passErr.textContent = res.password;
    emailErr.textContent = "";
  } else {
    closeModal();
    email.value = "";
    password.value = "";
    userImg.src = res.user.photo;
    username.textContent = res.user.name + "" + res.user.surname;
    checkUser();
  }
};

const checkUser = () => {
  const token = getStorage("token");
  if (token) {
    signInBtn.classList.add("d-none");
    userProfile.classList.replace("d-none", "d-block");
  } else {
    signInBtn.classList.replace("d-none", "d-block");
    userProfile.classList.replace("d-block", "d-none");
  }
};

form.addEventListener("submit", (e) => saveData(e));

logout.addEventListener("click", () => {
  removeStorage("token");
  checkUser();
});
