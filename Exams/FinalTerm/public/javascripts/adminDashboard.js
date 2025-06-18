document.getElementById('categoryForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedCategory = document.getElementById('categorySelect').value;
    if (selectedCategory) {
        window.location.href = `/admin/${selectedCategory}`;
    }
});

document.getElementById('viewCategoryForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedCategory = document.getElementById('viewCategorySelect').value;
    if (selectedCategory) {
        window.location.href = `/admin/listing${selectedCategory}`;
    }
});