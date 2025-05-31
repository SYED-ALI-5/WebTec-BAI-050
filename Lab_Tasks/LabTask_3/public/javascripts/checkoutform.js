const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const address = document.getElementById('address');
const expiry = document.getElementById('expiry');

function isFutureDate(date) {
    const today = new Date();
    const inputDate = new Date(date + "-01");
    return inputDate > today;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateInputs()) {
        alert('Signup successful!'); 
        form.submit();
    }
});
function isValidUsername(username) {
    const re = /^[A-Za-z]+$/;
    return re.test(username);
}

function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
}

function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPakistaniPhone(phone) {
    const re = /^03\d{9}$/; 
    return re.test(phone);
}

function validateInputs() {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    const addressValue = address.value.trim();
    const expiryValue = expiry.value.trim();
    let isValid = true;
   
    if (usernameValue === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else if (!isValidUsername(usernameValue)) {
        setError(username, 'Username must contain only alphabets');
        isValid = false;
    }
    else {
        setSuccess(username);
    }

    if (emailValue === '') {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    if (phoneValue === '') {
        setError(phone, 'Phone number is required');
        isValid = false;
    } else if (!isValidPakistaniPhone(phoneValue)) {
        setError(phone, 'Provide a valid Pakistani phone number (e.g., 03001234567)');
        isValid = false;
    } else {
        setSuccess(phone);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 characters.');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
        isValid = false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords don't match");
        isValid = false;
    } else {
        setSuccess(password2);
    }

    if (addressValue === '') {
        setError(address, 'Address is required');
        isValid = false;
    } else {
        setSuccess(address);
    }
    
    if (expiryValue === '') {
        setError(expiry, 'Expiry date is required');
        isValid = false;
    } else if (!isFutureDate(expiryValue)) {
        setError(expiry, 'Expiry date must be in the future');
        isValid = false;
    } else {
        setSuccess(expiry);
    }

    return isValid;
}
