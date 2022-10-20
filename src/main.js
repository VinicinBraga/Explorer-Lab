import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  };
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `/cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

//Imask
const securityCode = document.querySelector("#security-code");
let securityCodePattern = {
  mask: "000",
};
const securityCodeMAsked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
let expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
let cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    //console.log(foundMask.cardtype);
    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//Buttton
const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão gerado com sucesso!");
});
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

//update Name
const ccHolder = document.querySelector(".cc-holder .value");
const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "XXXXXX XXXXXX XXXXX" : cardHolder.value;
});

//update CVC
const updateSecutityCode = (code) => {
  const ccSeurity = document.querySelector(".cc-security .value");
  ccSeurity.innerText = code.length === 0 ? "000" : code;
};
securityCodeMAsked.on("accept", () => {
  updateSecutityCode(securityCodeMAsked.value);
});

//update Expiration
const updateExpirationDate = (date) => {
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "00/00" : date;
};
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

//update Card Number
const updateCardNumber = (number) => {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number;
};
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});
