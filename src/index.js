document.addEventListener("DOMContentLoaded", function() {
    
    const urlQuotes = 'http://localhost:3000/quotes?_embed=likes';

    const quoteList = document.getElementById("quote-list");

    const newQuoteForm = document.getElementById("new-quote-form");

    //add a fetch

    function fetchQuotes() {
        fetch(urlQuotes)
            .then(response => response.json())
            .then(json => allQuotes(json))
    }
    //iterate to all the quotes
    function allQuotes(json) {
        for (const quote of json) {
            renderQuote(quote)
        }
    }
    //render single quote
    function renderQuote(quote) {
        const li = document.createElement('li')
        li.classList = 'quote-card';

        const blockquote = document.createElement('blockquote')
        blockquote.classList = 'blockquote';

        const p = document.createElement('p')
        p.classList = 'mb-0';
        p.innerText = quote.quote;

        const footer = document.createElement('footer')
        footer.classList = "blockquote-footer";
        footer.innerText = quote.author

        const br = document.createElement('br')

        const buttonLike = document.createElement('button')
        buttonLike.classList = 'btn-success'
        buttonLike.innerText = `Likes: `

        const span = document.createElement('span')
        span.innerText = 0

        const buttonDelete = document.createElement('button')
        buttonDelete.classList = 'btn-danger'
        buttonDelete.innerHTML = `Delete`

        buttonLike.append(span)
        blockquote.append(p,footer,br,buttonLike,buttonDelete)
        li.append(blockquote)
        quoteList.append(li)

        buttonDelete.addEventListener('click', function(e) {
            destroyQuote(quote) 
            .then(li.remove())
        })
    }

    //Get the form object
    //add listerner to form
    newQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const newQuote = document.querySelector('#new-quote').value;
        const author = document.querySelector('#author').value;

        const quoteNew = {
            quote: newQuote,
            author: author
        }

        createQuote(quoteNew)
        .then(renderQuote)

    }); //end of form listener

    function createQuote(quoteNew) {
        return fetch(urlQuotes, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            body: JSON.stringify(quoteNew)
        }) //end of fetch
        .then(response => response.json())
    }

    //////////////////// DELETE  ////////////////////////////

    function destroyQuote(quote){
        return fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: "DELETE"
        })
        .then(response =>response.json())
    }
   













    fetchQuotes()
});
