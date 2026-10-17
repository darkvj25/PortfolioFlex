 // 1. Navbar Scroll Opacity Effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 40) {
                nav.classList.add('bg-netflixDark');
                nav.classList.remove('bg-gradient-to-b');
            } else {
                nav.classList.remove('bg-netflixDark');
                nav.classList.add('bg-gradient-to-b');
            }
        });

        // 2. Horizontal Scroll Wheel & Arrow Controller
        function scrollRow(rowId, scrollAmount) {
            const row = document.getElementById(rowId);
            if (row) {
                row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }

        // Enable Keyboard Arrow Key Scrolling for Active Row
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                const graphicRow = document.getElementById('rowGraphic');
                if (graphicRow) {
                    graphicRow.scrollBy({ left: e.key === 'ArrowRight' ? 300 : -300, behavior: 'smooth' });
                }
            }
        });

        // 3. Search Bar Filter
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.poster-card');

            cards.forEach(card => {
                const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
                const desc = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';

                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // 4. Modal Handlers
        function openProjectModal(title, category, description, imageUrl, tags) {
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalCategory').innerText = category;
            document.getElementById('modalDescription').innerText = description;
            document.getElementById('modalTags').innerText = tags || 'Figma • Photoshop';
            document.getElementById('modalImage').style.backgroundImage = `url("${imageUrl}")`;

            const modal = document.getElementById('projectModal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function openFeaturedHeroModal() {
            const heroBg = document.getElementById('heroCoverImage').style.backgroundImage;
            const cleanUrl = heroBg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            
            openProjectModal(
                'RDELL GRAPHIC DESIGN - Salvador Dalí Edition',
                'Graphic Design',
                'Featured cover portfolio artwork for Rdell Mark B. Gabion. Blending Money Heist Salvador Dalí mask visual aesthetics with urban street motion graphics and custom personal branding.',
                cleanUrl,
                'Photoshop • Illustrator • Vector Artwork • Motion Graphics'
            );
        }

        function closeProjectModal() {
            document.getElementById('projectModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function openContactModal() {
            document.getElementById('contactModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeContactModal() {
            document.getElementById('contactModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function openCustomManagerModal(presetCategory) {
            if (presetCategory) {
                document.getElementById('newCategory').value = presetCategory;
            }
            document.getElementById('customManagerModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeCustomManagerModal() {
            document.getElementById('customManagerModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // Close Modals on Outer Overlay Click
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('projectModal')) closeProjectModal();
            if (e.target === document.getElementById('contactModal')) closeContactModal();
            if (e.target === document.getElementById('customManagerModal')) closeCustomManagerModal();
        });

        // 5. File Upload Handler
        let uploadedBase64 = '';
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedBase64 = e.target.result;
                    document.getElementById('newImageUrl').value = 'Local Image Selected (' + file.name + ')';
                };
                reader.readAsDataURL(file);
            }
        }

        // 6. Dynamic Card Inserter
        function handleAddNewWork(event) {
            event.preventDefault();
            const category = document.getElementById('newCategory').value;
            const title = document.getElementById('newTitle').value;
            const tags = document.getElementById('newTags').value;
            const desc = document.getElementById('newDescription').value;
            let imgUrl = document.getElementById('newImageUrl').value;

            if (uploadedBase64 && imgUrl.startsWith('Local Image Selected')) {
                imgUrl = uploadedBase64;
            } else if (!imgUrl || !imgUrl.startsWith('http')) {
                imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';
            }

            const targetRowId = category === 'Graphic Design' ? 'rowGraphic' : 'rowUIUX';
            const targetRow = document.getElementById(targetRowId);

            if (targetRow) {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'poster-card min-w-[200px] xs:min-w-[240px] sm:min-w-[280px] bg-netflixCard rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative border border-gray-800/80';
                cardDiv.onclick = function() {
                    openProjectModal(title, category, desc, imgUrl, tags);
                };

                cardDiv.innerHTML = `
                    <img src="${imgUrl}" alt="${title}" class="h-36 sm:h-44 w-full object-cover">
                    <div class="p-3">
                        <div class="flex items-center justify-between text-xs mb-1">
                            <span class="text-green-400 font-bold">New Release</span>
                            <span class="text-gray-400 border border-gray-700 px-1 rounded text-[10px]">Custom</span>
                        </div>
                        <h3 class="font-bold text-sm text-white truncate">${title}</h3>
                        <p class="text-xs text-gray-400 mt-0.5 truncate">${desc}</p>
                    </div>
                `;

                targetRow.prepend(cardDiv);
                showToast('✨ New project poster added to ' + category + '!');
                closeCustomManagerModal();
                
                // Reset Form
                document.getElementById('addPosterForm').reset();
                uploadedBase64 = '';
            }
        }

        // 7. Clipboard Helper
        function copyToClipboard(text, msg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                const temp = document.createElement('input');
                temp.value = text;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
            }
            showToast(msg || 'Copied to clipboard!');
        }

        // 8. Toast Popup Controller
        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            toastMessage.innerText = msg;

            toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 3200);
        }