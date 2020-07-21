document.addEventListener('DOMContentLoaded', function(){

    // helper methods 
    function qs(identifier){
        return document.querySelector(identifier) 
    }
    function ce(element){
        return document.createElement(element) 
    }

    // data needed 
    const bookEnds = {
        book1: 601, 
        book2: 851, 
        book3: 451, 
        book4: 501, 
        book5: 901, 
        book6: 501,
        book7: 451,
        book8: 551,
        book9: 701,
        book10: 551, 
        book11: 801,
        book12: 451,
        book13: 801, 
        book14: 501,
        book15: 701, 
        book16: 851,
        book17: 751,
        book18: 601,
        book19: 401,
        book20: 501,
        book21: 601,
        book22: 501,
        book23: 851,
        book24: 801 
    }



    // logging in and signing up functionality  --> 
    const pageHeader = qs('div#header')
    const login_form = qs('form#login-form')
    const form_submit_button = qs('#login-form-submit') 
    const toggle_login_signup_button = qs('button#change-login-signup') 
    const input_username = qs('input#input-username')
    const input_password = qs('input#input-password')
    const user_message_slot = qs('td#login-message') 

    // toggle between log in and sign up for form  
    toggle_login_signup_button.addEventListener('click', function(){
        let current_option = event.target.innerText 
        if (current_option == "Or Sign Up"){ 
            event.target.innerText = "Or Log In"
            form_submit_button.value = "Sign Up"
        } else { 
            event.target.innerText = "Or Sign Up"
            form_submit_button.value = "Log In"
        }
    }) 

    // logic with API for logging in and signing up
    login_form.addEventListener('submit', function(){
        event.preventDefault()
        const configObj = { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify({
                username: input_username.value, 
                password: input_password.value
            })
        }
        // for logging in 
        if (form_submit_button.value == "Log In"){
            // debugger
            fetch('http://localhost:3000/users/login', configObj)
            .then(res => res.json())
            .then(json => {
                if (json.message.split(" ")[0] == "LoggedIn"){
                    sessionStorage.setItem('userkey', json.message.split(" ")[1]) 
                    sessionStorage.setItem('username', json.message.split(" ")[2])
                    console.log(sessionStorage.getItem('userkey'))

                    coverUpLogin(json.message)  
                } 
                else {
                    user_message_slot.innerText = json.message
                } 
            })  
        }
        // signing up functionality 
        if (form_submit_button.value == "Sign Up"){ 
            fetch('http://localhost:3000/users/new', configObj)
                .then(res => res.json())
                .then(json => {
                    user_message_slot.innerText = json.message 
                }) 
        } 
        login_form.reset() 
    }) 

    if (sessionStorage.getItem('userkey') != null && sessionStorage.getItem('username') != null){
        coverUpLogin("LoggedInAt " + sessionStorage.getItem('userkey') + " " + sessionStorage.getItem('username'))
    }

    function coverUpLogin(message){                
        const coverUpBox = ce('div')
        coverUpBox.id = "login-cover" 
        let loggedInText = ce('p') 
        loggedInText.innerText = "You are logged in as @" + message.split(" ")[2]
        let logoutButton = ce('button') 
        logoutButton.innerText = "Logout" 
        coverUpBox.appendChild(loggedInText)
        coverUpBox.appendChild(logoutButton)
        pageHeader.append(coverUpBox)
        logoutButton.addEventListener('click', function(){
            sessionStorage.removeItem('userkey') 
            sessionStorage.removeItem('username')  
            coverUpBox.parentNode.removeChild(coverUpBox)
        }) 
    }
    // <-- end of logging in and signing up 



    // display text in container functionality --> 

    const textContainer = qs('div#text-container') 
    const textTable = qs('table#text-table')
    
    // load next 50 lines after chunkNumber, inclusive
    function loadText(chunkNumber){       
        textTable.innerHTML ="" 
        const blank = qs('input#smallnuminput')
        blank.value = chunkNumber 
        sessionStorage.setItem('currentText', chunkNumber) 
        const book = parseInt(chunkNumber.split(".")[0]) 
        const startPoint = parseInt(chunkNumber.split(".")[1]) 
        const endPoint = startPoint + 49 
        grabLine(book, startPoint, endPoint, 0) 
    }

    function grabLine(book, i, endI, skip){ 
        const currentReq = new XMLHttpRequest()
        currentReq.open("GET", "https://www.perseus.tufts.edu/hopper/CTS?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001:"+book+"."+i, true)
        currentReq.onload = function() { 
            if (currentReq.responseText.split('Invalid URN reference').length == 1){
                let lineOutput = currentReq.responseText.split('<tei:div type="line">')[1].split("</tei:div>")[0]
                if (lineOutput.toLowerCase().split('unit="para"/>').length == 2){
                    lineOutput = lineOutput.toLowerCase().split('unit="para"/>')[1]
                    addAnnotatedNormalText(lineOutput, book, i, "break")
                } else { 
                addAnnotatedNormalText(lineOutput, book, i, "norm")   
                }
                if (i + 1 <= endI){
                    grabLine(book, i+1, endI, 0)  
                } else {
                    console.log("end")
                } 
            } 
            else { 
                let passes = skip + 1
                let interval = 1 
                let delayedLine = "" 
                while (passes > 0 ){ 
                    if (currentReq.responseText.split(`<cite n="${i + interval}">`).length == 2) {
                        const chunkAfter = currentReq.responseText.split(`<cite n="${i + interval}">`)[1]
                        delayedLine = chunkAfter.split('</cite>')[0] 
                        passes = passes - 1 
                    }  
                    interval = interval + 1 
                    console.log(interval) 
                    if (interval >= 20){
                        addEndText()
                        return 
                    } 
                } 
                addAnnotatedNormalText(delayedLine, book, i, "norm")  
                if (i + 1 <= endI){ 
                    console.log(skip) 
                    grabLine(book, i+1, endI, skip + 1)  
                } else { 
                    console.log("end") 
                }  
            }
        } 
        currentReq.send() 
    }

    function addAnnotatedNormalText(lineText , lineBook, lineNum, option){
        const currentTableRow = ce('tr')
        const currentLineNumber = ce('td') 
        currentLineNumber.innerText = lineNum 
        const currentLineText = ce('td')

        let wordIndex = 1
        if (option == "break"){
            const lineBreak = ce('br')
            currentLineText.append(lineBreak) 
        } 
        lineText.split(" ").forEach( lineWord => {
            const wordLocation = `${lineBook}-${lineNum}-${wordIndex}` 
            const wordSpan = ce('span') 
            wordSpan.className = "annotated-word"
            wordSpan.innerText = lineWord 
            wordSpan.id = wordLocation 

            // fetch('http://localhost:3000/words/color',{
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json' 
            //         },
            //     body:  JSON.stringify({
            //         'userkey': sessionStorage.getItem('userkey'), 
            //         'location': wordLocation 
            //         }) 
            //     })
            //     .then(res => res.json())
            //     .then(json => {
            //         if (json.message == "highlight"){
            //             wordSpan.style.backgroundColor = "yellow"
            //         } 
            //     })

            wordSpan.addEventListener('click', function(){
                console.log(wordSpan.id) 
                console.log(wordSpan.className) 
                console.log(wordSpan.innerText) 
                if (qs('span.annotated-word-target') != null) { 
                    const previousTarget = qs('span.annotated-word-target') 
                    previousTarget.style.backgroundColor = "white"
                    previousTarget.className = 'annotated-word'
                } 

                wordSpan.style.backgroundColor = "yellow"
                wordSpan.className = 'annotated-word-target'

                fetch('http://localhost:3000/words/check', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                        },
                    body:  JSON.stringify({
                        'userkey': sessionStorage.getItem('userkey'), 
                        'content': wordSpan.innerText, 
                        'location': wordSpan.id
                        }) 
                })
                    .then(res => res.json())
                    .then(json => displayDetails(json, wordSpan.id)) 
            }) 
            spaceSpan = ce('span')
            spaceSpan.innerText = " "
            currentLineText.append(wordSpan, spaceSpan) 
            wordIndex = wordIndex + 1 
        })
        currentTableRow.append(currentLineNumber, currentLineText)
        textTable.append(currentTableRow) 
    }

    function addEndText(){
        const currentTableRow = ce('tr')
        const currentLineNumber = ce('td') 
        const currentLineText = ce('td')
        currentLineText.innerHTML= "END"   
        currentLineText.id = "endTurnBack"
        currentLineText.style.textAlign="center"
        currentLineText.style.fontWeight="bold"
        currentTableRow.append(currentLineNumber, currentLineText)
        textTable.append(currentTableRow) 
    }

    // <-- end of display text in container functionality 

    // displaying annotations --> 

    const detailsBar = qs('div#annotations-container') 

    function displayDetails(detailsArray, detailsLocation){
        detailsBar.innerHTML = ""
        addCommentForm(detailsLocation) 
        detailsArray.forEach(detail => {
            displayDetailsCard(detail)
        })
    }
    function displayDetailsCard(detail){
        detailCard = ce('div')
        detailCard.className = "detail-card"  

        detailUser = ce('p')
        detailUser.innerText = detail.user.username 
        detailUser.className = 'detail-user' 
        detailContent = ce('p')
        detailContent.innerText = detail.content 
        detailContent.className = 'detail-content' 
        detailCard.append(detailUser, detailContent)  

        if (detail.user.password_digest == sessionStorage.getItem('userkey')){
            const delButton = ce('button') 
            delButton.innerText = "Delete"
            delButton.className = "delete-comment-button" 
            detailCard.append(delButton) 

            delButton.addEventListener('click', function(){
                fetch("http://localhost:3000/comments/" + detail.id, {
                    method: 'DELETE',
                })
                    .then( res => res.json())
                    .then( json => {
                        console.log(json)
                        detailCard.remove() 
                    })
            })
        } 
        detailsBar.append(detailCard) 

    }

    function addCommentForm(targetWordLocation){
        const newCommentForm = ce('form')
        newCommentForm.id = 'new-comment-form' 

        const pContent = ce('p') 
        pContent.innerHTML = "Annotate: <br/>"
        const inputContent = ce('textarea') 
        inputContent.id = 'input-new-comment-content'
        pContent.append(inputContent) 

        const selectPrivacy = ce('select')
        selectPrivacy.id = "input-new-comment-privacy" 

        const publicOption = ce('option')
        publicOption.innerText = "Public"
        publicOption.value = "Public"
        selectPrivacy.append(publicOption)

        const privateOption = ce('option')
        privateOption.innerText = "Private"
        privateOption.value = "Private" 
        selectPrivacy.append(privateOption)
        
        const submitComment = ce("input")
        submitComment.type = "submit" 
        submitComment.value = "Create" 

        newCommentForm.append(pContent, selectPrivacy, submitComment)

        commentFormCard = ce('div')
        commentFormCard.className = 'comment-card' 
        commentFormCard.append(newCommentForm) 
        detailsBar.prepend(commentFormCard)

        newCommentForm.addEventListener('submit', function(){
            event.preventDefault() 
            createNewComment(targetWordLocation) 
            newCommentForm.reset() 
        }) 
    }

    function createNewComment(targetWordLocation){
        const inputContent = qs('textarea#input-new-comment-content').value 
        const inputPrivacy = qs('select#input-new-comment-privacy').value 
        fetch("http://localhost:3000/comments/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                location: targetWordLocation,
                content: inputContent,
                userkey: sessionStorage.getItem('userkey'),  
                privacy: inputPrivacy
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json) 
                if (json.error == null) {
                    displayDetailsCard(json)
                } 
            })  
    }


    // navigation functionality -->  

    const manualNavNumber = qs('form#go-to-page')
    const backTextButton = qs('button#back-text')
    const nextTextButton = qs('button#next-text') 

    manualNavNumber.addEventListener('submit', function(){
        event.preventDefault() 
        const input = qs('#smallnuminput').value 
        const inputLine = parseInt(input.split(".")[1])
        const closestPoint = inputLine - (inputLine % 50) +1 
        const closestOutput = `${input.split(".")[0]}.${closestPoint}`
        loadText(closestOutput) 
    }) 

    nextTextButton.addEventListener('click', function(){
        const current = sessionStorage.getItem('currentText') 
        if (qs('td#endTurnBack') == null) {
            loadText(`${current.split(".")[0]}.${parseInt(current.split(".")[1])+50}`)
        } else {
            if (parseInt(current.split(".")[0]) >=24 ){
                console.log("it's the end")
            } else { 
            loadText(`${parseInt(current.split(".")[0]) + 1}.1`)
        }  
        } 
    }) 

    backTextButton.addEventListener('click', function(){
        const current = sessionStorage.getItem('currentText') 
        if (parseInt(current.split(".")[1]) != 1) {
            loadText(`${current.split(".")[0]}.${parseInt(current.split(".")[1])-50}`)
        } else {
            if (parseInt(current.split(".")[0]) <= 1 ){
                console.log("it's the start")
            } else { 
            let rightEnd = bookEnds[`book${parseInt(current.split(".")[0]) - 1}`]
            console.log(`${parseInt(current.split(".")[0]) - 1}.${rightEnd}`) 
            loadText(`${parseInt(current.split(".")[0]) - 1}.${rightEnd}`)
        }  
        } 
    }) 


    loadText("1.1") 

    // <-- end of navigation functionality 

})
