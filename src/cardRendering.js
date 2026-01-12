export function renderCards(containerElementId, cards) {
  const cardsContainer = document.getElementById(containerElementId);

  cardsContainer.className = "cardsContainer"

  cards.forEach((card, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card";
    wrapper.style.zIndex = `${index + 1}`;

    const img = document.createElement("img");
    img.src = imageUrls[card.id];
    img.className = "card-image";

    if (card.rotated) {
      img.classList.add("rotated")
    }

    wrapper.append(img);
    cardsContainer.appendChild(wrapper);
  });
}

// Image URLs as literals
const imageUrls = {
  "110": new URL("../assets/images/cards/raw/110.jpg", import.meta.url).href,
  "12": new URL("../assets/images/cards/raw/12.jpg", import.meta.url).href,
  "13": new URL("../assets/images/cards/raw/13.jpg", import.meta.url).href,
  "14": new URL("../assets/images/cards/raw/14.jpg", import.meta.url).href,
  "15": new URL("../assets/images/cards/raw/15.jpg", import.meta.url).href,
  "16": new URL("../assets/images/cards/raw/16.jpg", import.meta.url).href,
  "17": new URL("../assets/images/cards/raw/17.jpg", import.meta.url).href,
  "18": new URL("../assets/images/cards/raw/18.jpg", import.meta.url).href,
  "19": new URL("../assets/images/cards/raw/19.jpg", import.meta.url).href,
  "210": new URL("../assets/images/cards/raw/210.jpg", import.meta.url).href,
  "23": new URL("../assets/images/cards/raw/23.jpg", import.meta.url).href,
  "24": new URL("../assets/images/cards/raw/24.jpg", import.meta.url).href,
  "25": new URL("../assets/images/cards/raw/25.jpg", import.meta.url).href,
  "26": new URL("../assets/images/cards/raw/26.jpg", import.meta.url).href,
  "27": new URL("../assets/images/cards/raw/27.jpg", import.meta.url).href,
  "28": new URL("../assets/images/cards/raw/28.jpg", import.meta.url).href,
  "29": new URL("../assets/images/cards/raw/29.jpg", import.meta.url).href,
  "310": new URL("../assets/images/cards/raw/310.jpg", import.meta.url).href,
  "34": new URL("../assets/images/cards/raw/34.jpg", import.meta.url).href,
  "35": new URL("../assets/images/cards/raw/35.jpg", import.meta.url).href,
  "36": new URL("../assets/images/cards/raw/36.jpg", import.meta.url).href,
  "37": new URL("../assets/images/cards/raw/37.jpg", import.meta.url).href,
  "38": new URL("../assets/images/cards/raw/38.jpg", import.meta.url).href,
  "39": new URL("../assets/images/cards/raw/39.jpg", import.meta.url).href,
  "410": new URL("../assets/images/cards/raw/410.jpg", import.meta.url).href,
  "45": new URL("../assets/images/cards/raw/45.jpg", import.meta.url).href,
  "46": new URL("../assets/images/cards/raw/46.jpg", import.meta.url).href,
  "47": new URL("../assets/images/cards/raw/47.jpg", import.meta.url).href,
  "48": new URL("../assets/images/cards/raw/48.jpg", import.meta.url).href,
  "49": new URL("../assets/images/cards/raw/49.jpg", import.meta.url).href,
  "510": new URL("../assets/images/cards/raw/510.jpg", import.meta.url).href,
  "56": new URL("../assets/images/cards/raw/56.jpg", import.meta.url).href,
  "57": new URL("../assets/images/cards/raw/57.jpg", import.meta.url).href,
  "58": new URL("../assets/images/cards/raw/58.jpg", import.meta.url).href,
  "59": new URL("../assets/images/cards/raw/59.jpg", import.meta.url).href,
  "610": new URL("../assets/images/cards/raw/610.jpg", import.meta.url).href,
  "67": new URL("../assets/images/cards/raw/67.jpg", import.meta.url).href,
  "68": new URL("../assets/images/cards/raw/68.jpg", import.meta.url).href,
  "69": new URL("../assets/images/cards/raw/69.jpg", import.meta.url).href,
  "710": new URL("../assets/images/cards/raw/710.jpg", import.meta.url).href,
  "78": new URL("../assets/images/cards/raw/78.jpg", import.meta.url).href,
  "79": new URL("../assets/images/cards/raw/79.jpg", import.meta.url).href,
  "810": new URL("../assets/images/cards/raw/810.jpg", import.meta.url).href,
  "89": new URL("../assets/images/cards/raw/89.jpg", import.meta.url).href,
  "910": new URL("../assets/images/cards/raw/910.jpg", import.meta.url).href,
};

//renderCards("cardsContainer", ["110", "12", "13", "14", "15", "16", "17", "18", "19"]);