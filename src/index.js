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
        buttonLike.classList = 'btn btn-success'
        buttonLike.innerText = `❤️ Likes: `

        const span = document.createElement('span')
        quote.likes? span.innerText = quote.likes.length : span.innerText = 0;


        const buttonDelete = document.createElement('button')
        buttonDelete.classList = 'btn btn-danger'
        buttonDelete.innerHTML = `Delete`

        const buttonEdit = document.createElement('button')
        buttonEdit.classList = 'btn btn-light'
        buttonEdit.innerHTML = `Edit 🖊 `

        let editQuoteBtn = false;
        
        buttonEdit.addEventListener("click", (e) => {
            // debugger
            // console.log(e.target)
            const form = e.target.parentElement.parentElement.querySelector('form')
            editQuoteBtn = !editQuoteBtn;
            if (editQuoteBtn) {
                form.style.display = "block";
            } else {
                form.style.display = "none";
            }
        })

        buttonLike.append(span)
        blockquote.append(p,footer,br,buttonLike,buttonDelete,buttonEdit)
        li.append(blockquote)
        quoteList.append(li)

        buttonDelete.addEventListener('click', function(e) {
            destroyQuote(quote) 
            .then(li.remove())
        });

        buttonLike.addEventListener('click', function(e) {
            const newLikeObject ={
                quoteId: quote.id,
                createdAt: Date.now()
            }
            newLike(quote,newLikeObject)
            .then(++span.innerText)
        } )


        //edit form
        createAForm(quote, li)

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

        e.target.reset()

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

    //////////////////// likes ////////////////////

    const urlLikes = "http://localhost:3000/likes";


    function newLike(quote,newLikeObject){
        return fetch(urlLikes, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            body: JSON.stringify(newLikeObject)
        }) //end of fetch
        .then(response => response.json())
    }

    ////////////////// FORM //////////////////////////////
   
    function createAForm(quote, li){

        const form = document.createElement('form')
        form.id = "edit"
        form.style.display = "none";

        const quoteInput = document.createElement('input')
        quoteInput.name = "quote"
        quoteInput.value = quote.quote;
        quoteInput.classList = "form-control form-control-sm"

        const authorInput = document.createElement('input')
        authorInput.name = "author";
        authorInput.value = quote.author;
        authorInput.classList = "form-control form-control-sm"

        const editButton = document.createElement('button')
        editButton.innerText = "Edit"
        editButton.classList = "btn btn-secondary"
    

        form.append(quoteInput, authorInput, editButton)
        li.append(form)

        form.addEventListener('submit',function(e){
            e.preventDefault()

            const quotId = quote.id

            const newQuote = quoteInput.value;
            const author = authorInput.value;
    
            const quoteNew = {
                quote: newQuote,
                author: author
            }
    
            editQuote(quoteNew, quotId)
            .then(quote => renderQuote(quote))
        } )
    }

    function editQuote(quoteNew,quotId) {
        return fetch('http://localhost:3000/quotes' + `/${quotId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            body: JSON.stringify(quoteNew)
        }) //end of fetch
        .then(response => response.json())
    }












    fetchQuotes()
});
