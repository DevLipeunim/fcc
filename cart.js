let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
      <div class="cart-item">
        <img width="100"   border-radius: 5px; src=${search.img} alt="" />
        <div class="details">

          <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price">&#8358;${search.price}</p>
              </h4>
              <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
          </div>
          

          <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          </div>
          <h3>&#8358;${item * search.price}</h3>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="chome.html">
      <button class="HomeBtn">Back to home</button>
    </a>
    `;
  }
};

generateCartItems();

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  // console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

let removeItem = (id) => {
  let selectedItem = id;
  // console.log(selectedItem.id);
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

var amount;

let TotalAmount = () => {
  if (basket.length !== 0) {
      amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    // console.log(amount);
    label.innerHTML = `
    <h2>Total Bill : &#8358;${amount}</h2>
    <a href="chome.html">
      <button class="removeAll">Back</button>
    </a>
    <button onclick="clearCart()" class="checkout">Clear cart</button>
    `;
  } else return;
};

TotalAmount();

var totalAmountpaid = amount;

let hidePop = document.getElementById("hidePop");

const form = document.getElementById("payForm");
form.addEventListener("submit", payNow);

function payNow(e) {
  e.preventDefault();

  const txRef = "fcc_" + Math.floor(Math.random() * 1000000000 + 1); //Generate a random id for the transaction reference
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const date = document.getElementById("date").value;

  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));

  hidePop.classList.add("hidePop")

  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-66274efa295ca60299fd1bdad71a8625-X",
    tx_ref: txRef,
    amount: totalAmountpaid,
    currency: "NGN",
    redirect_url: "https://fcc-lipeunim.vercel.app/success.html",
    meta: {
      address: address,
      date: date,
    },




    customer: {
      email: email,
      phone_number: phone,
      name: name,


    },
    customizations: {
      title: "Fehin Cakes & Confectionery",
      description: "Payment for purchase",
      logo: "https://fcc-lipeunim.vercel.app/images/Fccflyer.jpg",
    },
    onclose: function () {},
    callback: function (data) {
      const reference = data.tx_ref;
      console.log("This is the data returned after a charge", data);
      if (data.tx.chargedata == "00" || data.tx.chargedata == "0") {
        window.location = "https://fcc-lipeunim.vercel.app/success.html"
        // redirect to a success page
      } else {
        window.location = "https://fcc-lipeunim.vercel.app/failure.html"
        // redirect to a failure page.
      }
    },
  });
}

// document.addEventListener("DOMContentLoaded", (event) => {
//   // Add an event listener for when the user clicks the submit button to pay
//   document.getElementById("submit").addEventListener("click", (e) => {
//     e.preventDefault();
//     const PBFKey = "FLWPUBK_TEST-299b84dea980c65498e5073253a58153-X"; // paste in the public key from your dashboard here
//     const txRef = "fcc_" + Math.floor(Math.random() * 1000000000 + 1); //Generate a random id for the transaction reference
//     const email = document.getElementById("email").value;
//     const phone = document.getElementById("phoneNumber").value;
//     const name = document.getElementById("name").value;
//     const address = document.getElementById("address").value;
//     const deliveryDate = document.getElementById("deliveryDate").value;

//     // getpaidSetup is Rave's inline script function. it holds the payment data to pass to Rave.
//     FlutterwaveCheckout({
//       public_key: PBFKey,
//       tx_ref: txRef,
//       amount: 54000,
//       currency: "NGN",
//       customer: {
//         email: email,
//         phone_number: phone,
//         name: name,
//         address: address,
//         delivery_date: deliveryDate,
//       },
//       customizations: {
//         title: "Fehin Cakes & Confectionery",
//         description: "Payment for purchase",
//         logo: "https://fcc-lipeunim.vercel.app/images/Fccflyer.jpg",
//       },
//       onclose: function () {},
//       callback: function (data) {
//         const reference = data.tx_ref;
//         console.log("This is the data returned after a charge", data);
//         if (data.tx.chargedata == "00" || data.tx.chargedata == "0") {
//           window.location.href = "index.html" + reference;
//           // redirect to a success page
//         } else {
//           window.location.href = "index.html" + reference;
//           // redirect to a failure page.
//         }
//       },
//     });
//   });
// });
