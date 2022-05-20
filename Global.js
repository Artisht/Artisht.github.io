const hamburger = document.querySelector("#hamburger");
const links = document.querySelector("#links");

hamburger.onclick = () => {
  links.classList.toggle("active");
};


function validateForm() {
  var a = document.forms["Form"]["name"].value;
  var b = document.forms["Form"]["query"].value;
  if (!a || !b) {
    alert("Please fill all boxes or the query will be not validated");
    return false;
  }
}