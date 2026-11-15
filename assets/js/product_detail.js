(() => {
    const products = Array.from(document.querySelectorAll('.product-detail-page .product'));
    const heading = document.querySelector('.page-title h1');
    const subtitle = document.querySelector('.page-title p');
    const emptyState = document.getElementById('product-not-found');

    function showSelectedProduct() {
        const params = new URLSearchParams(window.location.search);
        let productId = params.get('id');
        if (!productId) {
            try {
                productId = decodeURIComponent(window.location.hash.slice(1));
            } catch {
                productId = '';
            }
        }

        const selected = products.find(product => product.id === productId);
        products.forEach(product => {
            product.hidden = product !== selected;
        });
        emptyState.hidden = Boolean(selected);

        if (selected) {
            const name = selected.querySelector('.product-info h2').textContent.trim();
            heading.textContent = name;
            subtitle.textContent = 'Thông tin chi tiết món ăn tại LumiFood';
            document.title = `${name} | LumiFood`;
        } else {
            heading.textContent = 'Chi tiết món ăn';
            subtitle.textContent = productId
                ? 'Không tìm thấy món ăn bạn chọn.'
                : 'Hãy chọn một món từ trang thực đơn.';
            document.title = 'Chi tiết món ăn | LumiFood';
        }
    }

    showSelectedProduct();
    window.addEventListener('hashchange', showSelectedProduct);
})();
