function increaseQuantity() {
  const input = document.getElementById('quantityInput');
  let value = parseInt(input.value);
  if (!isNaN(value)) {
    input.value = value + 1;
  }
}

function decreaseQuantity() {
  const input = document.getElementById('quantityInput');
  let value = parseInt(input.value);
  if (!isNaN(value) && value > 1) {
    input.value = value - 1;
  }
}

const sizeButtons = document.querySelectorAll('.size-btn');
sizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

document.getElementById("addToCartBtn").addEventListener("click", async () => {
  const quantity = document.getElementById('quantityInput').value;
  const itemId = document.getElementById('addToCartBtn').getAttribute('data-id');
  const itemNum = document.getElementById('addToCartBtn').getAttribute('itemNum');
  const selectedSizeBtn = document.querySelector('.size-btn.active');

  if (!selectedSizeBtn) {
    alert('Please select a size.');
    return;
  }

  if (isNaN(quantity) || quantity < 1) {
    alert('Please enter a valid quantity.');
    return;
  }

  const selectedSize = selectedSizeBtn.innerText;

  // Fetch suiting item from API
  const res = await fetch(`/api/suiting/${itemId}`);
  const suiting = await res.json();

  // Choose appropriate values based on itemNum
  const data = {
    id: suiting._id,
    image: itemNum === '1' ? suiting.image1 : suiting.image3,
    hoverImage: itemNum === '1' ? suiting.image2 : suiting.image4,
    desc: itemNum === '1' ? suiting.desc1 : suiting.desc2,
    price: itemNum === '1' ? suiting.price1 : suiting.price2,
    sizes: itemNum === '1' ? suiting.sizes1 : suiting.sizes2
  };

  const priceNumber = parseFloat(
    data.price.replace(/Rs\./, '').replace(/,/g, '').trim()
  );
  const TotalPrice = priceNumber * quantity;

  const response = await fetch('/addToCart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data,
      size: selectedSize,
      quantity,
      TotalPrice
    })
  });

  const result = await response.json();

  if (response.status === 401 && result.redirect) {
    window.location.href = result.redirect;
  } else {
    alert(result.message);
  }
});
