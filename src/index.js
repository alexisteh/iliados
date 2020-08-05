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
    const sumChunks = 327 

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

        // logging in functionality 
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
                    textPage("1.1") 
                } 
                else {
                    user_message_slot.innerText = json.message
                    setTimeout(function(){
                        user_message_slot.innerText = ""
                    }, 2000)
                } 
            })  
        }

        // signing up functionality 
        if (form_submit_button.value == "Sign Up"){ 
            fetch('http://localhost:3000/users/new', configObj)
                .then(res => res.json())
                .then(json => {
                    user_message_slot.innerText = json.message 
                    setTimeout(function(){
                        user_message_slot.innerText = ""
                    }, 2000) 
                }) 
        } 
        login_form.reset() 
    }) 

    // making sure logged-in display is present 
    // if page was refreshed and previous user didn't log out 
    if (sessionStorage.getItem('userkey') != null && sessionStorage.getItem('username') != null){
        coverUpLogin("LoggedInAt " + sessionStorage.getItem('userkey') + " " + sessionStorage.getItem('username'))
    }

    // overlay boy with logged-in display 
    function coverUpLogin(message){                
        const coverUpBox = ce('div')
        coverUpBox.id = "login-cover" 

        coverUpBoxTable = ce('table')
        coverUpBox.append(coverUpBoxTable) 

        coverUpBoxTableTr = ce('tr')
        coverUpBoxTable.append(coverUpBoxTableTr) 

        let loggedInText = ce('td') 
        loggedInText.innerHTML = "You are logged in as <span class='user-at'> @" + message.split(" ")[2] + "</span>"
        coverUpBoxTableTr.append(loggedInText) 

        let logoutButtonTd = ce('td')
        coverUpBoxTableTr.append(logoutButtonTd) 

        let logoutButton = ce('button') 
        logoutButton.innerText = "Logout" 
        logoutButtonTd.append(logoutButton) 


        pageHeader.append(coverUpBox)

        logoutButton.addEventListener('click', function(){
            sessionStorage.removeItem('userkey') 
            sessionStorage.removeItem('username')  
            coverUpBox.parentNode.removeChild(coverUpBox)
            textPage("1.1")  
        }) 
    }
    // <-- end of logging in and signing up 

    const bottomContainer = qs('div#bottom-container') 

    // SHOW TEXT TAB OF PAGE -- > 

    function textPage(chunkLocation){  

        bottomContainer.innerHTML = ""
        document.querySelectorAll('span.bar-link').forEach(link => {
            link.style.color = '#3F897B' 
        })
        qs('span#page-text').style.color = '#E63E35'

        const textContainer = ce('div') 
        textContainer.id = 'text-container'
        const textTable = ce('table')
        textTable.id = 'text-table' 
        textContainer.append(textTable)
        textContainer.append(ce('br'))
        bottomContainer.append(textContainer) 

        const textFootbar = ce('div')
        textFootbar.id = 'textfootbar' 
        bottomContainer.append(textFootbar)  

        const navigationTable = ce('table')
        navigationTable.id = "text-navigation" 
        textFootbar.append(navigationTable) 

        const navigateTr = ce('tr')
        navigationTable.append(navigateTr) 

        const navigateTdBack = ce('td')
        const backTextButton = ce('button') 
        backTextButton.id = "back-text" 
        backTextButton.innerText = "Back" 
        navigateTdBack.append(backTextButton) 
        navigateTr.append(navigateTdBack) 

        const navigateTdManual  = ce('td') 
        navigateTr.append(navigateTdManual) 

        const manualNavNumber = ce('form') 
        manualNavNumber.id ="go-to-page" 
        navigateTdManual.append(manualNavNumber) 

        const navInputText = ce('input')
        navInputText.type = "text" 
        navInputText.id = "smallnuminput" 
        manualNavNumber.append(navInputText) 

        const navInputGo = ce('input')
        navInputGo.type ="submit"
        navInputGo.value = "Go" 
        manualNavNumber.append(navInputGo) 

        const navigateTdNext = ce('td')
        const nextTextButton = ce('button')
        nextTextButton.id = "next-text"
        nextTextButton.innerText = "Next" 
        navigateTdNext.append(nextTextButton) 
        navigateTr.append(navigateTdNext) 

        const goToClickBar = ce('div') 
        goToClickBar.id = "go-to-click-bar" 
        textFootbar.prepend(goToClickBar)

        goToClickBar.addEventListener('mousedown', function(){
            const bounds = goToClickBar.getBoundingClientRect() 
            const coordinate = event.clientX - bounds.left 
            const range = bounds.right - bounds.left 
            console.log("Coordinate: " + coordinate," End: " + (range) );
            const address = getLocationFromCoordinate(coordinate, range)  
            autoNavNumber(address) 
        }) 

        function getLocationFromCoordinate(coordinate, range){
            const fraction = coordinate / range 
            const pageNumber = fraction * sumChunks  
            const bookNum = bookNumSplit(pageNumber)[0] 
            const pageNum = pageNumSplit(bookNumSplit(pageNumber)[1], bookNum) 
            console.log(bookNum)  
            console.log(pageNum)
            return `${bookNum}.${pageNum}`
        } 

        function bookNumSplit(pageNumber){
            for (book in bookEnds){
                pageNumber = pageNumber - Math.ceil( parseInt(bookEnds[book]) / 50 )
                if (pageNumber <= 0 ){
                    return [ book.split("k")[1], pageNumber]  
                }
            } 
        }

        function pageNumSplit(pageLeft, bookNum){
            console.log(pageLeft, bookNum)
            const totalPagesInBook = Math.ceil( parseInt( bookEnds['book' + bookNum]) / 50 )
            const currentPage = Math.floor( totalPagesInBook + pageLeft ) * 50 
            return currentPage 
        }

        // display text in container functionality --> 

        
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
        
        // recursive loading single line within chunk from loadText(chunkNumber)
        function grabLine(book, i, endI, skip){ 
            const currentReq = new XMLHttpRequest()
            currentReq.open("GET", "https://www.perseus.tufts.edu/hopper/CTS?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001:"+book+"."+i, true)
            currentReq.onload = function() {  
                // api behaving well 
                if (currentReq.responseText.split('Invalid URN reference').length == 1){
                    let lineOutput = currentReq.responseText.split('<tei:div type="line">')[1].split("</tei:div>")[0]
                    // if it is a new paragraph in the text 
                    console.log(lineOutput) 
                    if (lineOutput.toLowerCase().split('unit="para"/>').length == 2){
                        lineOutput = lineOutput.toLowerCase().split('unit="para"/>')[1]
                        addAnnotatedNormalText(lineOutput, book, i, "break") 
                    } 
                    // if it is NOT a new paragraph in the text 
                    else { 
                    addAnnotatedNormalText(lineOutput, book, i, "norm")   
                    }
                    // synchronous moving on to next line 
                    if (i + 1 <= endI){
                        grabLine(book, i+1, endI, 0)  
                    } else {
                        console.log("end")
                    } 
                } 
                // api doing the skip-lines error 
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
                        // if book or chapter has ended  
                        if (interval >= 20){
                            addEndText()
                            return 
                        } 
                    } 

                    if (delayedLine.toLowerCase().split('unit="para"/>').length == 2){
                        delayedLine = delayedLine.toLowerCase().split('unit="para"/>')[1]
                        addAnnotatedNormalText(delayedLine, book, i, "break") 
                    } 
                    // if it is NOT a new paragraph in the text 
                    else { 
                    addAnnotatedNormalText(delayedLine, book, i, "norm")   
                    }

                    // synchronous moving on to next line 
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

        // loading single word within line from grabLine(book, i, endI, skip)
        function addAnnotatedNormalText(lineText , lineBook, lineNum, option){
            const currentTableRow = ce('tr')
            const currentLineNumber = ce('td') 
            currentLineNumber.innerText = lineNum 
            const currentLineText = ce('td')

            // check if it is a new paragraph 
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

                // clicking on a word makes the annotation panel show up 
                wordSpan.addEventListener('click', function(){
                    console.log(wordSpan.id) // word location with dashes 
                    console.log(wordSpan.className) // "annotated-word"
                    console.log(wordSpan.innerText)  // greek word text 

                    // highlighting ucurrent word in text 
                    if (qs('span.annotated-word-target') != null) { 
                        const previousTarget = qs('span.annotated-word-target') 
                        previousTarget.style.backgroundColor = "white"
                        previousTarget.className = 'annotated-word'
                    } 
                    wordSpan.style.backgroundColor = "#fffb91"
                    wordSpan.className = 'annotated-word-target'

                    fetchDetails(wordSpan.id, wordSpan.innerText, 'norm') // fetch details input: location with dashes

                }) 
                // adding space between words 
                spaceSpan = ce('span')
                spaceSpan.innerText = " " 
                currentLineText.append(wordSpan, spaceSpan) 
                wordIndex = wordIndex + 1 
            })
            currentTableRow.append(currentLineNumber, currentLineText)
            textTable.append(currentTableRow) 
        }

        // display end of book/chapter text 
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


        // displaying annotations funtionality --> 

        let detailsBar = ce('div')
        detailsBar.id = "annotations-container" 
        bottomContainer.append(detailsBar)

        const textWelcomeCard = ce('div')
        textWelcomeCard.className = 'detail-card'
        textWelcomeCard.innerText = "Click on a word to see annotations" 
        detailsBar.append(textWelcomeCard)

        // const detailsBar = qs('div#annotations-container') 

        // <-- end of displaying annotations functionality 


        // navigation functionality -->  

        // const manualNavNumber = qs('form#go-to-page')
        // const backTextButton = qs('button#back-text')
        // const nextTextButton = qs('button#next-text') 

        // go to page with input number, book and line number given 
        // seperated with full stop 
        manualNavNumber.addEventListener('submit', function(){
            event.preventDefault() 
            const input = qs('#smallnuminput').value 
            const inputLine = parseInt(input.split(".")[1])
            const closestPoint = inputLine - (inputLine % 50) +1 
            const closestOutput = `${input.split(".")[0]}.${closestPoint}`
            loadText(closestOutput) 
        })  

        function autoNavNumber(address){  
            const inputLine = parseInt(address.split(".")[1])
            const closestPoint = inputLine - (inputLine % 50) +1 
            const closestOutput = `${address.split(".")[0]}.${closestPoint}`
            loadText(closestOutput) 
        }

        // go to next page with next 50 lines 
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

        // go to previous page with previous 50 lines 
        backTextButton.addEventListener('click', function(){
            const current = sessionStorage.getItem('currentText') 
            if (parseInt(current.split(".")[1]) != 1) {
                loadText(`${current.split(".")[0]}.${parseInt(current.split(".")[1])-50}`)
            } else {
                if (parseInt(current.split(".")[0]) <= 1 ){
                    console.log("it's the start")
                } else { 
                // use bookEnds data from above to check last page of previous chapter  
                let rightEnd = bookEnds[`book${parseInt(current.split(".")[0]) - 1}`]
                console.log(`${parseInt(current.split(".")[0]) - 1}.${rightEnd}`) 
                loadText(`${parseInt(current.split(".")[0]) - 1}.${rightEnd}`)
            }  
            } 
        }) 

        // always display first 50 lines of first book on page load 
        loadText(chunkLocation) 

        // <-- end of navigation functionality 


    } // end of textPage() function 

    // generalised annotation function --> 

        // fetch details on specific word 
        function fetchDetails(wordLoc, grkWord, type){ // input: word location with dashes 
            fetch('http://localhost:3000/words/check', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                    },
                body:  JSON.stringify({
                    'userkey': sessionStorage.getItem('userkey'), 
                    'location': wordLoc
                    }) 
            })
                .then(res => res.json()) 
                .then(json => displayDetails(json, wordLoc, grkWord, type)) 
        }

        // display all details on single word 
        // detailsLocation is word location with dashes 
        function displayDetails(detailsArray, detailsLocation, grkWord, type){ 
            let detailsBar = qs('div#annotations-container')
            detailsBar.innerHTML = "" 
            addCommentForm(detailsLocation, grkWord, type) 
            addSavedIndicator(detailsArray[0], detailsLocation, grkWord, type)    
            detailsArray.slice(1).forEach(detail => {
                displayDetailsCard(detail, detailsLocation, grkWord)
            })
        } 

        // display single details on single word 
        // detailsLocation is word location with dashes 
        function displayDetailsCard(detail, detailsLocation, grkWord){
            detailCard = ce('div') 
            detailCard.className = "detail-card"  
            detailCard.id = 'detail' + detail.id // id of detail/comment in database 

            detailUser = ce('p')
            detailUser.innerText = '@' + detail.user.username 
            detailUser.className = 'detail-user' 
            detailContent = ce('p')
            detailContent.innerText = detail.content 
            detailContent.className = 'detail-content' 
            detailCard.append(detailUser, detailContent)  

                // ability to delete, edit comment if same user 
            if (detail.user.password_digest == sessionStorage.getItem('userkey')){

                const editDelButtonTable = ce('table') 
                editDelButtonTable.id = "edit-delete-table"
                detailCard.append(editDelButtonTable)

                const editDelButtonTr = ce('tr')
                editDelButtonTable.append(editDelButtonTr)

                const delButtonTd = ce('td')
                editDelButtonTr.append(delButtonTd)

                const editButtonTd = ce('td')
                editDelButtonTr.append(editButtonTd) 

                // ability to delete comment if same user 
                const delButton = ce('button') 
                delButton.innerText = "Delete"
                delButton.className = "delete-comment-button" 
                delButtonTd.append(delButton) 

                delButton.addEventListener('click', function(){
                    fetch("http://localhost:3000/comments/" + detail.id, {
                        method: 'DELETE',
                    })
                        .then( res => res.json())
                        .then( json => {
                            console.log(json)
                            const thisCard = qs('div#detail' + detail.id) 
                            thisCard.remove() 
                        }) 
                }) 

                // ability to edit comment if same user 
                const editButton = ce('button') 
                editButton.innerText = "Edit"
                editButton.className = "edit-comment-button" 
                editButtonTd.append(editButton) 

                editButton.addEventListener('click', function(){

                    console.log(detail) 
                    qs('input#submit-comment').value = "Update"
                    qs('textarea#input-new-comment-content').value = detail.content

                    const cancelButton = ce('button')
                    cancelButton.innerText = 'cancel'
                    cancelButton.id ="cancel-edit-comment" 
                    qs('div#comment-form-card').append(cancelButton)

                    const hiddenIdField = ce('input')
                    hiddenIdField.type = "hidden" 
                    hiddenIdField.value = detail.id 
                    hiddenIdField.id = 'hidden-id-edit-comment'
                    qs('form#new-comment-form').append(hiddenIdField) 

                    cancelButton.addEventListener('click', function(){
                        fetchDetails(detailsLocation, detail.word.content , 'norm')
                    })

                    const thisCard = qs('div#detail' + detail.id) 
                    thisCard.remove() 
                }) 
            } 

            let detailsBar = qs('div#annotations-container')
            detailsBar.append(detailCard) 
        }

        // display the annotation form to create and edit comments 
        // pass in detailsLocation word location with dashes 
        function addCommentForm(detailsLocation, grkWord, type){
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
            submitComment.id = 'submit-comment' 
            submitComment.type = "submit" 
            submitComment.value = "Create" 

            newCommentForm.append(pContent, selectPrivacy, submitComment)

            commentFormCard = ce('div') 
            commentFormCard.id = 'comment-form-card' 
            commentFormCard.append(newCommentForm) 
            let detailsBar = qs('div#annotations-container')
            detailsBar.prepend(commentFormCard)

            newCommentForm.addEventListener('submit', function(){
                event.preventDefault() 
                // create comment 
                if (qs('input#submit-comment').value == "Create"){
                    createNewComment(detailsLocation, grkWord, type) 
                } 
                // edit comment 
                if (qs('input#submit-comment').value == "Update"){
                    editComment(detailsLocation, type) 
                } 
                newCommentForm.reset() 
            }) 
        }

        // logic and API to create new comment 
        // pass in detailsLocation as word location with dashes 
        function createNewComment(detailsLocation, grkWord, type){
            const inputContent = qs('textarea#input-new-comment-content').value 
            const inputPrivacy = qs('select#input-new-comment-privacy').value 
            fetch("http://localhost:3000/comments/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    location: detailsLocation,
                    content: inputContent,
                    userkey: sessionStorage.getItem('userkey'),  
                    privacy: inputPrivacy,
                    word_content: grkWord 
                })
            })
                .then(res => res.json()) 
                .then(json => {
                    console.log(json) 
                    if (json.error == null) { 
                        fetchDetails(detailsLocation, json.word.content, type) 
                    } else { 
                        const errorP = ce('p')
                        errorP.id = 'error-p'
                        errorP.innerText = json.error 
                        qs('form#new-comment-form').prepend(errorP) 
                    }
                })  
            }

        // logic and API to edit existing comment 
        // pass in detailsLocation as word location with dashes 
        function editComment(detailsLocation, type){
            const newContent = qs('textarea#input-new-comment-content').value 
            const newPrivacy = qs('select#input-new-comment-privacy').value 
            const id = qs('input#hidden-id-edit-comment').value 
            fetch("http://localhost:3000/comments/" + id, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body:  JSON.stringify({
                    content: newContent, 
                    privacy: newPrivacy, 
                    userkey: sessionStorage.getItem('userkey') 
                }) 
            }) 
                .then( res => res.json())
                .then( json => { 
                    fetchDetails(detailsLocation, json.word.content, type)  
                }) 
        } 

        // displays if word has been saved to user's word bank 
        function addSavedIndicator(indicator, detailsLocation, grkWord, type ) {
            indicatorCard = ce('div')
            indicatorCard.id = "saved-indicator-card" 

            // for textPage annotation bar 
            if (type == 'norm') {
                indicatorCard = ce('div')
                indicatorCard.id = "saved-indicator-card" 

                indicatorTable = ce('table') 
                indicatorTable.id = 'saved-indicator-table' 

                indicatorTableTr = ce('tr')
                indicatorTable.append(indicatorTableTr) 

                indicatorTextTd = ce('td') 
                indicatorTextTd.id = "saved-indicator-text"
                indicatorTableTr.append(indicatorTextTd) 

                changeSavedButtonTd = ce('td') 
                indicatorTableTr.append(changeSavedButtonTd) 

                changeSavedButton = ce('button') 
                changeSavedButton.id = "change-saved-status" 
                changeSavedButtonTd.append(changeSavedButton) 
                
                if (indicator == "saved"){
                    indicatorTextTd.innerText = "Word Saved"
                    changeSavedButton.innerText = "Unsave"
                }else { 
                    indicatorTextTd.innerText = "Word Not Saved"
                    changeSavedButton.innerText = "Save"
                }

                // toggle saved or unsaved function  
                changeSavedButton.addEventListener('click', function(){
                    fetch("http://localhost:3000/savedwords", {
                        method: 'PATCH',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body:  JSON.stringify({
                            userkey: sessionStorage.getItem('userkey'),
                            location: detailsLocation,  
                            content: grkWord
                        }) 
                    }) 
                        .then(res => res.json())
                        .then(json => { 
                            console.log(json) 

                            if (json.error == null) {
                                const buttonChange = qs('button#change-saved-status')
                                const indicatorTextChange = qs('td#saved-indicator-text')
                                if (buttonChange.innerText == "Unsave"){
                                    buttonChange.innerText = "Save" 
                                    indicatorTextChange.innerText =  "Word Not Saved"
                                }
                                else {
                                    buttonChange.innerText = "Unsave" 
                                    indicatorTextChange.innerText =  "Word Saved"
                                }
                            } else {
                                const errorP = ce('p')
                                errorP.id = 'error-p' 
                                errorP.innerText = json.error 
                                qs('div#saved-indicator-card').prepend(errorP) 
                                indicatorCard.append()
                            }
                        }) 
                })

                indicatorCard.append(indicatorTable)

            } 
            else { 
                
                const swContent = ce('div') 
                swContent.id = "saveword-indicator-top"
                swContent.innerText = grkWord + " (" + detailsLocation.split("-").slice(0, 2).join(".") + ')'
                indicatorCard.append(swContent) 

                const savewordIndicatorBottomTable = ce('table')
                savewordIndicatorBottomTable.id = "saveword-indicator-table" 
                indicatorCard.append(savewordIndicatorBottomTable)

                const savewordIndicatorBottomTableTr = ce('tr')
                savewordIndicatorBottomTable.append(savewordIndicatorBottomTableTr)

                const savewordIndicatorBottomTdLeft = ce('td')
                savewordIndicatorBottomTableTr.append(savewordIndicatorBottomTdLeft)

                const savewordIndicatorBottomTdRight = ce('td')
                savewordIndicatorBottomTableTr.append(savewordIndicatorBottomTdRight)
                

                // for savedwordsPage annotation bar 
                if (type == 'annotation'){
                            
                    const unsaveButton = ce('button')
                    unsaveButton.id = "unsave-word" 
                    unsaveButton.innerText = 'Unsave Word'
                    savewordIndicatorBottomTdLeft.append(unsaveButton) 

                    unsaveButton.addEventListener('click', function(){
                        console.log(event.target) 
                        fetch("http://localhost:3000/savedwords", {
                            method: 'PATCH',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body:  JSON.stringify({
                                userkey: sessionStorage.getItem('userkey'),
                                location: detailsLocation,   
                                content: grkWord
                            }) 
                        })
                            .then(res => res.json())
                            .then(json => { 
                                console.log(json) 
                    
                                let detailsBar = qs('div#annotations-container')
                                detailsBar.innerHTML = ""
                                fetchSavedwords("newestfirst") 
                            })  
                    })

                } 

                if (type.split("-")[0] == 'wordlist'){
                    
                    const removeButton = ce('button')
                    removeButton.id = "remove-word" 
                    removeButton.innerText = 'Remove From List'
                    savewordIndicatorBottomTdLeft.append(removeButton) 

                    removeButton.addEventListener('click', function(){
                        console.log(event.target) 
                        fetch("http://localhost:3000/listwords/remove", {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body:  JSON.stringify({ 
                                userkey: sessionStorage.getItem('userkey'),
                                savelist_id: type.split("-")[1],   
                                word_id: type.split("-")[2]
                            }) 
                        }) 
                            .then(res => res.json())
                            .then(json => { 
                                console.log(json) 
                                let detailsBar = qs('div#annotations-container')
                                detailsBar.innerHTML = ""
                                fetchWordList(type.split("-")[1]) 
                            })  
                    })

                }       

                const goToWord = ce('button')
                goToWord.id = 'go-to-word-from-savedword'
                goToWord.innerText = 'Go To Word'
                savewordIndicatorBottomTdRight.append(goToWord) 

                goToWord.addEventListener('click', async function(){
                    textPage(detailsLocation.split("-").slice(0, 2).join(".")) 
                })
            }
     
            let detailsBar = qs('div#annotations-container')
            detailsBar.prepend(indicatorCard) 
        }

    // <-- end of generalised annotation function  

    // < -- END OF SHOW TEXT TAB OF PAGE 
    


    //  SHOW WORDS TAB OF PAGE  --> 

    function savedwordsPage(){ 
        // let detailsBar = ce('div')
        // detailsBar.id = "annotations-container" 
        // bottomContainer.append(detailsBar)
        
        let savedwordsDisplaySettings = ce('div')
        savedwordsDisplaySettings.id = 'savedwords-display-settings'
        bottomContainer.append(savedwordsDisplaySettings) 

        makeSavedwordsDisplayForm()

        const savedwordsDisplayDiv = ce('div')
        savedwordsDisplayDiv.id = 'savedwords-display'
        bottomContainer.append(savedwordsDisplayDiv) 

        const savedwordsDetailDiv = ce('div')
        savedwordsDetailDiv.id="annotations-container" 
        bottomContainer.append(savedwordsDetailDiv) 

        const savedwordsWelcomeCard = ce('div')
        savedwordsWelcomeCard.className = 'detail-card'
        savedwordsWelcomeCard.innerText = "Click on a word to see annotations" 
        savedwordsDetailDiv.append(savedwordsWelcomeCard)

        const savedwordsDisplayCard = ce('div')
        savedwordsDisplayCard.id = 'words-card' 
        savedwordsDisplayDiv.append(savedwordsDisplayCard)

        const savedwordsDisplayList = ce('ul') 
        savedwordsDisplayList.id = "savedwords-display-list"
        savedwordsDisplayCard.append(savedwordsDisplayList)

        if (sessionStorage.getItem('userkey') == null ){
            savedwordsDisplayCard.innerHTML = "Please Log in to Save Words"
            savedwordsDisplayCard.style.fontFamily = "Futura"
        }else { 
            fetchSavedwords('newestfirst') 
        } 
    }

    function makeSavedwordsDisplayForm(){
        let savedwordsDisplaySettings = qs('div#savedwords-display-settings')

        let savedwordsDisplaySettingsLeft = ce('div')
        savedwordsDisplaySettingsLeft.id = "savedwords-display-settings-left" 
        savedwordsDisplaySettings.append(savedwordsDisplaySettingsLeft)

        const savedwordsDisplayForm = ce('form') 
        savedwordsDisplayForm.id = "savedwords-display-form" 
        savedwordsDisplaySettingsLeft.append(savedwordsDisplayForm) 

        // selection dropdown for display options 

        const savedwordsDisplaySelect = ce('select')
        savedwordsDisplaySelect.id = "savedwords-display-select"
        savedwordsDisplayForm.append(savedwordsDisplaySelect)

        const savedwordsDisplayNewestFirst = ce('option')
        savedwordsDisplayNewestFirst.innerText = "Newest First"
        savedwordsDisplayNewestFirst.value = "newestfirst" 
        savedwordsDisplaySelect.append(savedwordsDisplayNewestFirst)

        const savedwordsDisplayOldestFirst = ce('option')
        savedwordsDisplayOldestFirst.innerText = "Oldest First"
        savedwordsDisplayOldestFirst.value = "oldestfirst"
        savedwordsDisplaySelect.append(savedwordsDisplayOldestFirst)

        const savedwordsDisplayFromBookStart = ce('option')
        savedwordsDisplayFromBookStart.innerText = "From Start of Book"
        savedwordsDisplayFromBookStart.value = "firstbook"
        savedwordsDisplaySelect.append(savedwordsDisplayFromBookStart)

        const savedwordsDisplayFromBookEnd = ce('option')
        savedwordsDisplayFromBookEnd.innerText = "From End of Book"
        savedwordsDisplayFromBookEnd.value = "lastbook"
        savedwordsDisplaySelect.append(savedwordsDisplayFromBookEnd)

        // submit button for display options 
        const savedwordsDisplaySubmit = ce('input')
        savedwordsDisplaySubmit.type = "submit" 
        savedwordsDisplayForm.append(savedwordsDisplaySubmit)

        savedwordsDisplayForm.addEventListener('submit', function(){
            event.preventDefault() 
            const orderToDisplaySavedwords = qs('select#savedwords-display-select').value 
            console.log(orderToDisplaySavedwords)
            fetchSavedwords(orderToDisplaySavedwords)
        })

        let savedwordsDisplaySettingsRight = ce('div')
        savedwordsDisplaySettingsRight.id = "savedwords-display-settings-right" 
        savedwordsDisplaySettings.append(savedwordsDisplaySettingsRight)

        const showListManagement = ce('button')
        showListManagement.innerText = "Add Words to Lists" 
        savedwordsDisplaySettingsRight.append(showListManagement)

        showListManagement.addEventListener('click', function(){
            dragListManagementPane() 
        })
    } 

    function dragListManagementPane(){
        qs('div#annotations-container').innerHTML = "" 
        const listManagementWelcomeCard = ce('div')
        listManagementWelcomeCard.className = 'detail-card'
        listManagementWelcomeCard.innerText = "Drag a word into a list below:" 
        qs('div#annotations-container').append(listManagementWelcomeCard)

        fetch('http://localhost:3000/savelists/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userkey: sessionStorage.getItem('userkey') 
            })
        })
            .then(res => res.json())
            .then(json => { 
                json.forEach(savelist => {
                    displayDragBoxList(savelist)
                })
            })

    }

    function displayDragBoxList(savelist){
        const dragListBox = ce('div')
        dragListBox.className = 'detail-card'
        dragListBox.id = 'savelist-' + savelist.id 
        dragListBox.innerText = savelist.name 
        qs('div#annotations-container').append(dragListBox)

        dragListBox.ondragover = (event) => {
            dragListBox.style.backgroundColor = "#E63E35"
            dragListBox.style.color = "white"
            event.preventDefault() 
            console.log(event.target) 
        }
        dragListBox.ondragleave = (event) => {
            dragListBox.style.backgroundColor = "#e3ffe3"
            dragListBox.style.color = "black"
        }
        dragListBox.ondrop = (event) => { 
            dragListBox.style.backgroundColor = "#e3ffe3"
            dragListBox.style.color = "black"
            console.log(event) 
            const targetSavedwordId = event.dataTransfer.getData('text') 
            const targetSavelistId = event.target.id.split("-")[1]
            addSavedwordToSavelist(targetSavedwordId, targetSavelistId) 
        }
    }

    function fetchSavedwords(order){ 
        const wordList = qs('ul#savedwords-display-list') 
        wordList.innerHTML = ""
        fetch("http://localhost:3000/savedwords/show", {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:  JSON.stringify({
                userkey: sessionStorage.getItem('userkey'), 
                order: order 
            }) 
        }) 
            .then(res => res.json())
            .then(json =>{
                console.log(json) 
                json.forEach(savedword => {
                    console.log(savedword.word.content)
                    const wordLi = ce('li')
                    wordLi.draggable = "true" 
                    wordLi.ondragstart = (event) => {
                        console.log('yo') 
                        event.dataTransfer.setData('text', savedword.id) 
                        } 
                    
                    wordLi.innerText = savedword.word.content + " at " + savedword.word.location.split("-").slice(0,2).join(".") 
                    wordList.append(wordLi)

                    wordLi.addEventListener('click', function(){

                        if (qs('li#wordli-target') != null){
                            qs('li#wordli-target').style.backgroundColor = 'white'
                            qs('li#wordli-target').id = null 
                        } 

                        wordLi.style.backgroundColor = "#fffb91"
                        wordLi.id = "wordli-target"

                        fetchDetails(savedword.word.location, savedword.word.content, 'annotation')
                        // console.log(savedword) 
                        // displaysavedwordsAnnotation(savedword)
                    }) 
                })
            }) 
    }

    function addSavedwordToSavelist(savedwordId, savelistId){
        fetch("http://localhost:3000/listwords", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:  JSON.stringify({
                userkey: sessionStorage.getItem('userkey'),
                savedword_id: savedwordId,
                savelist_id: savelistId
            })
        } ) 
            .then(res => res.json())
            .then(json => {
                console.log(json) 
            })
    }




    // word lists page 

    function wordListsPage() {
        
        bottomContainer.innerHTML = ""
        let wordListDisplaySettings = ce('div')
        wordListDisplaySettings.id = 'wordlist-display-settings'
        bottomContainer.append(wordListDisplaySettings) 

        makeWordListsDisplayForm() 

        const wordListDisplayDiv = ce('div')
        wordListDisplayDiv.id = 'wordlist-display'
        bottomContainer.append(wordListDisplayDiv) 

        const wordListCard = ce('div') 
        wordListCard.id = "words-card" 
        wordListCard.innerText = "Select a list to display"
        wordListCard.style.textAlign = "center" 
        wordListCard.style.fontFamily = "Futura" 
        wordListDisplayDiv.append(wordListCard) 

        const wordListDetailDiv = ce('div')
        wordListDetailDiv.id="annotations-container" 
        bottomContainer.append(wordListDetailDiv) 
        
        const savedwordsWelcomeCard = ce('div')
        savedwordsWelcomeCard.className = 'detail-card'
        savedwordsWelcomeCard.innerText = "Click on a word to see annotations" 
        wordListDetailDiv.append(savedwordsWelcomeCard)

    }

    function makeWordListsDisplayForm() {

        let wordListDisplaySettingsDiv = qs('div#wordlist-display-settings')

        let newWordListFormDiv = ce('div')
        newWordListFormDiv.id = 'make-new-wordlist-form-div'
        wordListDisplaySettingsDiv.append(newWordListFormDiv) 
        makeNewListForm() 

        const wordListDisplayForm = ce('form') 
        wordListDisplayForm.id = "wordlist-display-form" 
        wordListDisplaySettingsDiv.append(wordListDisplayForm) 

        // selection dropdown for lists 
        let wordListDisplaySelect = ce('select')
        wordListDisplaySelect.id = "wordlist-display-select"
        wordListDisplayForm.append(wordListDisplaySelect) 

        fetchListDisplayOptions()

        const wordListDisplaySubmit = ce('input')
        wordListDisplaySubmit.type = "submit" 
        wordListDisplaySubmit.value = "Display List" 
        wordListDisplayForm.append(wordListDisplaySubmit) 

        let wordListEditingSection = ce('div')
        wordListEditingSection.id = "edit-wordlist-section"
        wordListDisplaySettingsDiv.append(wordListEditingSection) 

        wordListDisplayForm.addEventListener('submit', function(){
            event.preventDefault() 
            qs('div#words-card').innerHTML = "" 
            qs('div#words-card').style.textAlign = "left" 
            qs('div#words-card').style.fontFamily = "" 

            const wordListList = ce('ul')
            wordListList.id = "wordlist-list"
            qs('div#words-card').append(wordListList)

            const wordListChosenId = qs('select#wordlist-display-select').value 
            console.log(wordListChosenId) 
            fetchWordList(wordListChosenId)

            extraWordListEditingOptions(wordListChosenId)

        }) 

    }

    function fetchListDisplayOptions(){
        console.log('check')
        fetch("http://localhost:3000/savelists/check", { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userkey: sessionStorage.getItem('userkey') 
            })
    })
        .then(res => res.json())
        .then(json => {
            let wordListDisplaySelect = qs('select#wordlist-display-select')
            wordListDisplaySelect.innerHTML = ""
            json.forEach(list => {
                
                const wordListToDisplay = ce('option')
                wordListToDisplay.innerText = list.name 
                wordListToDisplay.value = list.id 
                wordListDisplaySelect.append(wordListToDisplay) 
            })
        })
    }

    function makeNewListForm(){ 
        const makeNewWordListForm = ce('form') 
        qs('div#make-new-wordlist-form-div').append(makeNewWordListForm)

        const newWordListInputName = ce('input')
        newWordListInputName.type = "text" 
        newWordListInputName.id = 'new-word-list-input-name'
        makeNewWordListForm.append(newWordListInputName)

        const newWordListSubmit = ce('input')
        newWordListSubmit.type = 'submit'
        newWordListSubmit.value = "Make New List" 
        makeNewWordListForm.append(newWordListSubmit)

        makeNewWordListForm.addEventListener('submit', function(){
            event.preventDefault() 
            let inputName = qs('input#new-word-list-input-name').value 

            fetch("http://localhost:3000/newsavelist", { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    userkey: sessionStorage.getItem('userkey'), 
                    name: inputName
                })
            })
                .then(res => res.json())
                .then(json => { 
                    console.log(json)
                    fetchListDisplayOptions() 
                }) 
            makeNewWordListForm.reset()
        })

    } 

    function extraWordListEditingOptions(wordlistId){
        qs('div#edit-wordlist-section').innerHTML = ""

        const deleteWordListButton = ce('button')
        deleteWordListButton.innerText = "Delete This List" 
        qs('div#edit-wordlist-section').append(deleteWordListButton)

        deleteWordListButton.addEventListener('click', function(){
            event.preventDefault()
            fetch("http://localhost:3000/savelists/" + wordlistId, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json) 
                    wordListsPage()
                })
        })

    }

    function fetchWordList(wordListId){
        qs('ul#wordlist-list').innerHTML = "" 
        fetch('http://localhost:3000/savelists/showone', {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:  JSON.stringify({
                userkey: sessionStorage.getItem('userkey'),
                savelist_id: wordListId
            })
        })  
            .then(res => res.json())
            .then(json => {
                console.log(json) 
                json.forEach(word => {

                    const wordLi = ce('li') 
                    wordLi.innerText =  word.content + " at " + word.location.split("-").slice(0,2).join(".") 
                    qs('ul#wordlist-list').append(wordLi) 

                    wordLi.addEventListener('click', function(){

                        if (qs('li#wordli-target') != null){
                            qs('li#wordli-target').style.backgroundColor = 'white'
                            qs('li#wordli-target').id = null 
                        } 

                        wordLi.style.backgroundColor = "#fffb91"
                        wordLi.id = "wordli-target"

                        fetchDetails(word.location, word.content, 'wordlist-' + wordListId + "-" + word.id)
                        // console.log(savedword) 
                        // displaysavedwordsAnnotation(savedword)
                    }) 

                })

            }) 
    }



    // function displaysavedwordsAnnotation(savedword){

        // const displaySwDetailDiv = qs('div#savedwords-detail')
        // displaySwDetailDiv.innerHTML = ""

        // const displaySwMainDetailCard = ce('div')
        // displaySwMainDetailCard.id = "comment-form-card"
        // displaySwDetailDiv.append(displaySwMainDetailCard)

        // const swContent = ce('p')
        // swContent.innerText = savedword.word.content + " (" + savedword.word.location.split("-").slice(0,2).join(".")  + ")"
        // displaySwMainDetailCard.append(swContent) 

        // const unsaveButton = ce('button')
        // unsaveButton.id = "unsave-word" 
        // unsaveButton.innerText = 'Unsave Word'
        // displaySwMainDetailCard.append(unsaveButton)

        // unsaveButton.addEventListener('click', function(){
        //     console.log(event.target) 
        //     fetch("http://localhost:3000/savedwords", {
        //         method: 'POST',
        //         headers: { 
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json'
        //         },
        //         body:  JSON.stringify({
        //             userkey: sessionStorage.getItem('userkey'),
        //             location: savedword.word.location,   
        //             content: savedword.word.content 
        //         }) 
        //     })
        //         .then(res => res.json())
        //         .then(json => { 
        //             console.log(json) 
        //             displaySwDetailDiv.innerHTML = ""
        //             fetchSavedwords() 
        //         })  
        // }) 

    //     displayPersonalAnnotations(savedword)

    // } 

    // function displayPersonalAnnotations(savedword) {
    //     fetch("http://localhost:3000/savedwords/privannotations",{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             userkey: sessionStorage.getItem('userkey'),
    //             location: savedword.word.location, 
    //             content: savedword.word.content 
    //         }) 
    //     }) 
    //         .then(res => res.json())
    //         .then(json => {
    //             console.log(json) 
    //             json.forEach(annotation => {
    //                 displayPersonalAnnotation(annotation)
    //             })
    //         })
    // }

    // function displayPersonalAnnotation(annotation){
    //     const displayHereDiv = qs('div#savedwords-detail')

    //     const privAnnotationCard = ce('div')
    //     privAnnotationCard.className = 'detail-card' 
    //     privAnnotationCard
    // }


    function annotationsPage(){ 
        bottomContainer.innerHTML = ""
        let annotationsDisplayDiv = ce('div')
        annotationsDisplayDiv.id = 'annotations-display'
        bottomContainer.append(annotationsDisplayDiv)

        const annotationsEditingContainer = ce('div')
        annotationsEditingContainer.id = "annotations-container"
        bottomContainer.append(annotationsEditingContainer) 

        const textWelcomeCard = ce('div')
        textWelcomeCard.className = 'detail-card'
        textWelcomeCard.innerText = "Click on an annotation to edit" 
        annotationsEditingContainer.append(textWelcomeCard)

        if (sessionStorage.getItem('userkey') == null ){
            annotationsDisplayDiv.innerHTML = "Please Log in to Save Words"
            annotationsDisplayDiv.style.fontFamily = "Futura"
            annotationsDisplayDiv.style.textAlign = "center"
        }else { 
            fetchAnnotations('timeadded')
        } 
    }

    function fetchAnnotations(type){
        fetch("http://localhost:3000/comments/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:  JSON.stringify({
                userkey: sessionStorage.getItem('userkey'),
                type: type 
            })
        }) 
            .then(res => res.json())
            .then(json => {

                json.forEach(annotation => {
                    displayAnnotation(annotation) 
                })
            })
    }

    function displayAnnotation(annotation){

        let annotationsDisplayDiv = qs('div#annotations-display')

        const annotationCard = ce("div")
        annotationCard.className = 'annotation-info-card' 
        annotationsDisplayDiv.append(annotationCard)

        const annotationWordInfoTable = ce('table')
        annotationWordInfoTable.className = "annotation-info-table"
        annotationCard.append(annotationWordInfoTable)

        const annotationWordInfoTr = ce('tr')
        annotationWordInfoTable.append(annotationWordInfoTr)

        const annotationWordInfo = ce('td')
        annotationWordInfo.className = 'annotation-word-info'
        annotationWordInfo.innerText = annotation.word.content + " (" + annotation.word.location.split("-").slice(0,2).join(".") + ")" 
        annotationWordInfoTr.append(annotationWordInfo) 

        annotationWordInfo.addEventListener('click', function(){
            if (qs('td#target-annotation') != null){
                qs('td#target-annotation').style.backgroundColor = 'white'
                qs('td#target-annotation').id = ""
            }  
            annotationWordInfo.style.backgroundColor = '#fffb91' 
            annotationWordInfo.id = "target-annotation"
            editAnnotationSidebar(annotation) 
        })

        const annotationWordGoTo = ce('td')
        annotationWordInfoTr.append(annotationWordGoTo) 

        const annotationWordGoToButton = ce('button') 
        annotationWordGoToButton.innerText = "Go To Word" 
        annotationWordGoTo.append(annotationWordGoToButton) 

        annotationWordGoToButton.addEventListener('click', function(){
            textPage(annotation.word.location.split("-").slice(0,2).join("."))
        })

        const annotationContentInfo = ce('p') 
        annotationContentInfo.className = 'annotation-content-info'
        annotationContentInfo.innerText = annotation.content
        annotationCard.append(annotationContentInfo) 
    } 

    function editAnnotationSidebar(annotation){

        const annotationForm = ce('form')
        annotationForm.id = 'update-comment-form' 

        const pContent = ce('p') 
        pContent.innerHTML = "Edit Annotation: <br/>"
        const inputContent = ce('textarea') 
        inputContent.id = 'input-new-comment-content'
        inputContent.value = annotation.content 
        pContent.append(inputContent) 

        const selectPrivacy = ce('select')
        selectPrivacy.id = "input-update-comment-privacy" 

        const publicOption = ce('option')
        publicOption.innerText = "Public"
        publicOption.value = "Public"
        selectPrivacy.append(publicOption)

        const privateOption = ce('option')
        privateOption.innerText = "Private"
        privateOption.value = "Private" 
        selectPrivacy.append(privateOption)

        const hiddenIdField = ce('input')
        hiddenIdField.type = "hidden" 
        hiddenIdField.value = annotation.id  
        hiddenIdField.id = 'hidden-id-update-comment'
        
        const submitComment = ce("input")
        submitComment.id = 'submit-comment' 
        submitComment.type = "submit" 
        submitComment.value = "Update"  

        annotationForm.append(pContent, selectPrivacy, hiddenIdField, submitComment)

        commentFormCard = ce('div') 
        commentFormCard.id = 'comment-form-card' 
        commentFormCard.append(annotationForm) 
        let detailsBar = qs('div#annotations-container')
        detailsBar.innerHTML = "" 
        detailsBar.prepend(commentFormCard)

        annotationForm.addEventListener('submit', function(){
            event.preventDefault() 
            // edit comment 
            const newContent = qs('textarea#input-new-comment-content').value 
            const newPrivacy = qs('select#input-update-comment-privacy').value 
            const id = qs('input#hidden-id-update-comment').value 
            fetch("http://localhost:3000/comments/" + id, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body:  JSON.stringify({
                    content: newContent, 
                    privacy: newPrivacy, 
                    userkey: sessionStorage.getItem('userkey') 
                }) 
            }) 
                .then(res => res.json())
                .then(json => {
                    annotationsPage()
            })

        })
        
        const deleteAnnotationCard = ce('div')
        deleteAnnotationCard.id = 'delete-annotation-card'  
        detailsBar.append(deleteAnnotationCard) 

        const deleteAnnotationButton = ce('button')
        deleteAnnotationButton.innerText = "Delete"
        deleteAnnotationCard.append(deleteAnnotationButton)

        deleteAnnotationButton.addEventListener('click', function(){
            fetch("http://localhost:3000/comments/" + annotation.id, {
                        method: 'DELETE',
                    })
                .then( res => res.json())
                .then( json => {
                    annotationsPage()
                }) 

        })
    }


    // run textpage() when site is opened 
    textPage("1.1") 

    // run textpage when tab is clicked 
    const textPageTab = qs('span#page-text')
    textPageTab.addEventListener('click', function(){
        bottomContainer.innerHTML = ""
        textPage("1.1") 
        document.querySelectorAll('span.bar-link').forEach(link => {
            link.style.color = '#3F897B' 
        })
        textPageTab.style.color = '#E63E35'
    })

    //saved words tab 
    const savedwordsTab = qs('span#page-saved-words')
    savedwordsTab.addEventListener('click', function(){
        bottomContainer.innerHTML = ""
        savedwordsPage() 
        document.querySelectorAll('span.bar-link').forEach(link => {
            link.style.color = '#3F897B' 
        })
        savedwordsTab.style.color = '#E63E35'
    }) 

    // word lists tab 
    const wordListsTab = qs('span#page-word-lists')
    wordListsTab.addEventListener('click', function(){
        bottomContainer.innerHTML = ""
        wordListsPage() 
        document.querySelectorAll('span.bar-link').forEach(link => {
            link.style.color = '#3F897B' 
        })
        wordListsTab.style.color = '#E63E35'
    }) 

    //annotations tab 
    const annotationsTab = qs('span#page-annotations')
    annotationsTab.addEventListener('click', function(){
        bottomContainer.innerHTML = "" 
        annotationsPage()
        document.querySelectorAll('span.bar-link').forEach(link => {
            link.style.color = '#3F897B' 
        })
        annotationsTab.style.color = '#E63E35'
    }) 
})

