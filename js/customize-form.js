( function() {

const form = document.querySelector(".form-get-prototype");
console.log('form: ');
console.log(form);

const listInputWraps = form.querySelectorAll(".wpcf7-form-control-wrap");
console.log(listInputWraps);

const inputIcons = {
  "your-name": "user-circle",
  "your-coupon-code": "percent",
  "your-facebook": "facebook",
  "your-whatsapp": "phone",
  "your-skype": "skype",
  "your-email": "envelope",
};

listInputWraps.forEach(item => {
  //var style = getComputedStyle(item);
  // console.log('offsetWidth: ');
  // console.log(item.offsetWidth);
  //console.log(item.offsetWidth);
  var spanElem = document.createElement("span");
  spanElem.classList.add("form-input-focus");
  item.appendChild(spanElem);

  var symbol = document.createElement("span");
  symbol.classList.add("form-input__symbol");
  var iElem = document.createElement("i");
  iElem.classList.add("fa");
  var inputElem = item.querySelector("input");
  if(inputElem) {
    iElem.classList.add("fa-" + inputIcons[inputElem.name]);
    // console.log(inputElem);
    // console.log('inputElem.name: ');
    // console.log(inputElem.name);
  }
  symbol.appendChild(iElem);
  item.appendChild(symbol);

});

})();
