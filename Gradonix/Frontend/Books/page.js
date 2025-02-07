async function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        resultsDiv.innerHTML = '';
        
        data.docs.slice(0, 12).forEach((book, index) => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.style.animationDelay = `${index * 0.1}s`;

            const coverId = book.cover_i;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
            
            bookCard.innerHTML = `
                <img src="${coverUrl}" class="book-cover" alt="Book cover">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author_name ? book.author_name[0] : 'Unknown Author'}</p>
                <p class="book-year">${book.first_publish_year || 'Unknown Year'}</p>
            `;

            resultsDiv.appendChild(bookCard);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<div class="error">Error fetching books. Please try again.</div>';
    }
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});