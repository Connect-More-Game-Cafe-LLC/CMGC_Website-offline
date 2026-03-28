document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Hamburger Menu Logic --- */
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    const contactLink = document.getElementById('contactLink');

    if (openMenu && drawer && overlay) {
        const toggleMenu = () => {
            drawer.classList.toggle('open');
            overlay.classList.toggle('active');
        };

        openMenu.addEventListener('click', toggleMenu);
        if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        if (contactLink) {
            contactLink.addEventListener('click', () => {
                drawer.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
    }

    /* --- 2. Accordion Logic (FAQ & Games) --- */
    const headers = document.querySelectorAll('.game-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            document.querySelectorAll('.game-card').forEach(otherCard => {
                if (otherCard !== card) otherCard.classList.remove('active');
            });
            card.classList.toggle('active');
        });
    });

    /* --- 3. Game Library Search & Multi-Filter Logic --- */
    const gameSearch = document.getElementById('gameSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearBtn = document.getElementById('clearFilters');
    const gameGrid = document.getElementById('gameGrid');
    const gameCards = document.querySelectorAll('.game-card');

    let noResults = document.getElementById('noResults');
    if (!noResults && gameGrid) {
        noResults = document.createElement('div');
        noResults.id = "noResults";
        noResults.innerHTML = `
            <p>No games match your current filters.</p>
            <button class="btn btn-secondary" style="margin-top: 10px; font-size: 0.8rem;">Clear All</button>
        `;
        noResults.style.display = "none";
        gameGrid.appendChild(noResults);
    }

    if (gameSearch) {
        const filterGames = () => {
            const searchTerm = gameSearch.value.toLowerCase();
            
            // Get all active filters for each group as Arrays
            const activePlayers = Array.from(document.querySelectorAll('[data-group="players"] .active')).map(btn => btn.dataset.filter);
            const activeCategories = Array.from(document.querySelectorAll('[data-group="category"] .active')).map(btn => btn.dataset.filter.toLowerCase());
            const activeComplexities = Array.from(document.querySelectorAll('[data-group="complexity"] .active')).map(btn => btn.dataset.filter);

            let visibleCount = 0;

            gameCards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const cardCategories = (card.dataset.category || "").toLowerCase().split(' ');
                const cardComplexity = card.dataset.complexity;
                const cardPlayers = card.dataset.players || "";

                // 1. Search Match
                const matchesSearch = title.includes(searchTerm);

                // 2. Category Match (Must match ALL selected categories)
                const matchesCategory = activeCategories.length === 0 || 
                    activeCategories.every(cat => cardCategories.includes(cat));

                // 3. Complexity Match (Matches ANY selected difficulty)
                const matchesComplexity = activeComplexities.length === 0 || 
                    activeComplexities.includes(cardComplexity);

                // 4. Player Match Logic (Matches ANY selected player count)
                let matchesPlayers = true;
                if (activePlayers.length > 0) {
                    matchesPlayers = activePlayers.some(filterValue => {
                        if (filterValue === "5") {
                            const maxPlayers = parseInt(cardPlayers.split('-').pop());
                            return maxPlayers >= 5;
                        } else {
                            const playersArr = cardPlayers.split('-').map(Number);
                            const target = parseInt(filterValue);
                            return playersArr.length === 2 
                                ? (target >= playersArr[0] && target <= playersArr[1]) 
                                : (target === playersArr[0]);
                        }
                    });
                }

                // Final Visibility Check
                if (matchesSearch && matchesCategory && matchesComplexity && matchesPlayers) {
                    card.style.display = "block";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            if (noResults) noResults.style.display = (visibleCount === 0) ? "block" : "none";
        };

        gameSearch.addEventListener('input', filterGames);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle the "active" class on click instead of clearing siblings
                btn.classList.toggle('active');
                filterGames();
            });
        });

        const resetAll = () => {
            gameSearch.value = "";
            filterBtns.forEach(b => b.classList.remove('active'));
            filterGames();
        };

        if (clearBtn) clearBtn.addEventListener('click', resetAll);
        if (noResults) noResults.querySelector('button').addEventListener('click', resetAll);
    }

    /* --- 4. Netlify Contact Form --- */
    const contactForm = document.getElementById('contact-form');
    const formFields = document.getElementById('form-fields');
    const successMessage = document.getElementById('success-message');

    if (contactForm && formFields && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                formFields.style.display = "none";
                successMessage.style.display = "block";
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch((error) => {
                alert("Wait, something went wrong. Please try again or email us directly.");
                console.error('Form submission error:', error);
            });
        });
    }
});