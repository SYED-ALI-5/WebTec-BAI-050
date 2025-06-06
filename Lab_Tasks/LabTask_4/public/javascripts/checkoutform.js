document.addEventListener("DOMContentLoaded", () => {
    const codCheckbox = document.getElementById("codCheck");
    const cardNumber = document.getElementById("cardNumber");
    const cvv = document.getElementById("cvv");
    const expiry = document.getElementById("expiry");

    function toggleCardFields() {
        const disabled = codCheckbox.checked;
        cardNumber.disabled = disabled;
        cvv.disabled = disabled;
        expiry.disabled = disabled;
    }

    codCheckbox.addEventListener("change", toggleCardFields);

    toggleCardFields(); // Initial check
});
