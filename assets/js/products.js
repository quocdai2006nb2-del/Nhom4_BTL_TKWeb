(() => {
    const form = document.getElementById('menu-filters');
    if (!form) return;

    const search = form.querySelector('.search-input');
    const category = document.getElementById('category-filter');
    const sort = document.getElementById('sort-filter');
    const results = document.getElementById('menu-results');
    const links = [...document.querySelectorAll('.category-menu a')];
    const normalize = (text) => text.toLocaleLowerCase('vi')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();

    const sections = [...document.querySelectorAll('.menu-category')].map((section) => ({
        element: section,
        grid: section.querySelector('.product-grid'),
        count: section.querySelector('.category-header > p'),
        dishes: [...section.querySelectorAll('.product-card')].map((card, index) => ({
            element: card,
            name: normalize(card.querySelector('h3').textContent),
            price: Number(card.querySelector('.price').textContent.replace(/\D/g, '')),
            bestSelling: [...card.querySelectorAll('.badge')]
                .some((badge) => normalize(badge.textContent) === 'ban chay'),
            index
        }))
    }));

    function filterMenu() {
        const words = normalize(search.value).split(' ').filter(Boolean);
        let total = 0;

        sections.forEach(({ element, grid, count, dishes }) => {
            let visible = 0;
            const matchesCategory = !category.value || category.value === element.id;
            const ordered = [...dishes].sort((a, b) => {
                if (sort.value === 'price-asc') return a.price - b.price || a.index - b.index;
                if (sort.value === 'price-desc') return b.price - a.price || a.index - b.index;
                if (sort.value === 'best-selling') {
                    return Number(b.bestSelling) - Number(a.bestSelling) || a.index - b.index;
                }
                return a.index - b.index;
            });

            ordered.forEach((dish) => {
                const matches = matchesCategory && words.every((word) => dish.name.includes(word));
                dish.element.hidden = !matches;
                grid.appendChild(dish.element);
                if (matches) visible += 1;
            });

            element.hidden = visible === 0;
            count.textContent = `${visible} món`;
            total += visible;
        });

        results.textContent = total
            ? `Tìm thấy ${total} món ăn.`
            : 'Không tìm thấy món ăn phù hợp. Hãy thử từ khóa khác hoặc chọn tất cả danh mục.';

        links.forEach((link) => {
            const selected = link.hash === `#${category.value || 'all'}`;
            if (selected) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }

    function selectHashCategory() {
        const id = window.location.hash.slice(1);
        if (id === 'all' || sections.some(({ element }) => element.id === id)) {
            category.value = id === 'all' ? '' : id;
        }
        filterMenu();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        filterMenu();
    });
    search.addEventListener('input', filterMenu);
    category.addEventListener('change', filterMenu);
    sort.addEventListener('change', filterMenu);
    links.forEach((link) => link.addEventListener('click', (event) => {
        event.preventDefault();
        category.value = link.hash === '#all' ? '' : link.hash.slice(1);
        filterMenu();
    }));
    window.addEventListener('hashchange', selectHashCategory);
    selectHashCategory();
})();
