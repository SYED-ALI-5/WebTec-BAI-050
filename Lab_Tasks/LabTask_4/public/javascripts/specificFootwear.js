function increaseQuantityFoot() {
  const input = document.getElementById('quantityInputFootwear');
  let value = parseInt(input.value);
  if (!isNaN(value)) {
    input.value = value + 1;
  }
}

function decreaseQuantityFoot() {
  const input = document.getElementById('quantityInputFootwear');
  let value = parseInt(input.value);
  if (!isNaN(value) && value > 1) {
    input.value = value - 1;
  }
}

const sizeButtons = document.querySelectorAll('.size-btn-foot');
sizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

document.getElementById("addToCartBtn").addEventListener("click", async () => {
  const quantity = document.getElementById('quantityInputFootwear').value;
  const itemId = document.getElementById('addToCartBtn').getAttribute('data-id');
  const selectedSizeBtn = document.querySelector('.size-btn-foot.active');

  if (!selectedSizeBtn) {
    alert('Please select a size.');
    return;
  }

  if (isNaN(quantity) || quantity < 1) {
    alert('Please enter a valid quantity.');
    return;
  }

  const selectedSize = selectedSizeBtn.innerText;

  const responseFootwear = await fetch(`/api/footwear/${itemId}`);
  const footwear = await responseFootwear.json();

  const data = {
    id: footwear._id,
    image: footwear.image1,
    hoverImage: footwear.image2,
    desc: footwear.desc,
    price: footwear.price,
    sizes: footwear.sizes,
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
