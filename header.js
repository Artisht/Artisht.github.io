const hamburger = document.querySelector("#hamburger");
const links = document.querySelector("#links");

hamburger.onclick = () => {
  links.classList.toggle("active");
};
