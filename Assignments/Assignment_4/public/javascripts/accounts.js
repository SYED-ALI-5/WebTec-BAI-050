document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('.login-btn')?.addEventListener('click', function () {
    window.location.href = '/login';
  });

  document.querySelector('.reg-btn')?.addEventListener('click', function () {
    window.location.href = '/register';
  });
});
