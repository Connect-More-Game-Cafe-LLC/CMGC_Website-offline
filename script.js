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

    // Create the "No Results" element dynamically if it doesn't exist
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
            
            // Capture active filters from each specific group
            const activePlayers = document.querySelector('[data-group="players"] .active')?.dataset.filter;
            const activeCategory = document.querySelector('[data-group="category"] .active')?.dataset.filter;
            const activeComplexity = document.querySelector('[data-group="complexity"] .active')?.dataset.filter;

            let visibleCount = 0;

            gameCards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const cardCategory = card.dataset.category;
                const cardComplexity = card.dataset.complexity;
                const cardPlayers = card.dataset.players || "";

                // Search Match
                const matchesSearch = title.includes(searchTerm);

                // Category Match
                const matchesCategory = !activeCategory || cardCategory === activeCategory;

                // Complexity (Difficulty) Match
                const matchesComplexity = !activeComplexity || cardComplexity === activeComplexity;

                // Player Match Logic
                let matchesPlayers = true;
                if (activePlayers) {
                    if (activePlayers === "5") {
                        const maxPlayers = parseInt(cardPlayers.split('-').pop());
                        matchesPlayers = maxPlayers >= 5;
                    } else {
                        const [min, max] = cardPlayers.split('-').map(Number);
                        const target = parseInt(activePlayers);
                        matchesPlayers = max ? (target >= min && target <= max) : (target === min);
                    }
                }

                // Final Visibility Check
                if (matchesSearch && matchesCategory && matchesComplexity && matchesPlayers) {
                    card.style.display = "block";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            // Toggle "No Results" message
            if (noResults) noResults.style.display = (visibleCount === 0) ? "block" : "none";
        };

        gameSearch.addEventListener('input', filterGames);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.parentElement;
                const isAlreadyActive = btn.classList.contains('active');

                // Deselect others in the same group
                group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Toggle current button
                if (!isAlreadyActive) {
                    btn.classList.add('active');
                }
                
                filterGames();
            });
        });

        // Reset Function
        const resetAll = () => {
            gameSearch.value = "";
            filterBtns.forEach(b => b.classList.remove('active'));
            filterGames();
        };

        if (clearBtn) clearBtn.addEventListener('click', resetAll);
        if (noResults) noResults.querySelector('button').addEventListener('click', resetAll);
    }
});