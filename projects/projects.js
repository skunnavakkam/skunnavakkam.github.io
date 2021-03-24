function open_project(project_link) {
    document.location.href = "files/" + project_link
}

function load_cards() {
    card_div = document.getElementById('card-div')

    const files = 
[
    {
        "name":"sample.html",
        "title": "Sample",
        "desc": "A sample document with nothing in it, just to test how things are" 
    },
    {
        "name":"sample2.html",
        "title":"sample 2",
        "desc": "a second thing created "
    }
]
    for (var i = 0; i < files.length; i++) {
        console.log(files[i])

        var card = document.createElement('DIV')
        var card_body = document.createElement('DIV')
        var card_title = document.createElement('H3')
        var card_text = document.createElement('P')
        var card_button = document.createElement('A')

        card.className = 'card text-white bg-dark mb-3'
        card.style = "margin-bottom:10px; margin-top:20px"
        card_body.className = 'card-body'
        card_title.innerHTML = files[i].title
        card_text.innerHTML = files[i].desc
        card_button.className = "btn btn-outline-light"
        card_button.innerHTML = "Take me there!"
        card_button.href = "files/" + files[i].name

        card_body.appendChild(card_title)
        card_body.appendChild(card_text)
        card.appendChild(card_body)
        card_div.appendChild(card)
        card_body.appendChild(card_button)
        
    }
}

