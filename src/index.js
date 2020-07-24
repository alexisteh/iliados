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

    // making sure logged-in display is present 
    // if page was refreshed and previous user didn't log out 
    if (sessionStorage.getItem('userkey') != null && sessionStorage.getItem('username') != null){
        coverUpLogin("LoggedInAt " + sessionStorage.getItem('userkey') + " " + sessionStorage.getItem('username'))
    }

    // overlay boy with logged-in display 
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

    const bottomContainer = qs('div#bottom-container') 

    // SHOW TEXT TAB OF PAGE -- > 

    function textPage(){  

        bottomContainer.innerHTML = ""

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
                    addAnnotatedNormalText(delayedLine, book, i, "norm")  
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
                    wordSpan.style.backgroundColor = "yellow"
                    wordSpan.className = 'annotated-word-target'

                    fetchDetails(wordSpan.id, wordSpan.innerText) // fetch details input: location with dashes

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

        const detailsBar = ce('div')
        detailsBar.id = "annotations-container" 
        bottomContainer.append(detailsBar)

        // const detailsBar = qs('div#annotations-container') 

        // fetch details on specific word 
        function fetchDetails(wordLoc, grkWord){ // input: word location with dashes 
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
                .then(json => displayDetails(json, wordLoc, grkWord)) 
        }

        // display all details on single word 
        // detailsLocation is word location with dashes 
        function displayDetails(detailsArray, detailsLocation, grkWord){ 
            detailsBar.innerHTML = "" 
            addCommentForm(detailsLocation) 
            addSavedIndicator(detailsArray[0], detailsLocation, grkWord)   
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

            // ability to delete comment if same user 
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
                            const thisCard = qs('div#detail' + detail.id) 
                            thisCard.remove() 
                        }) 
                }) 
            } 

            // ability to edit comment if same user 
            if (detail.user.password_digest == sessionStorage.getItem('userkey')){
                const editButton = ce('button') 
                editButton.innerText = "Edit"
                editButton.className = "edit-comment-button" 
                detailCard.append(editButton) 

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
                        fetchDetails(detailsLocation)
                    })

                    const thisCard = qs('div#detail' + detail.id) 
                    thisCard.remove() 
                }) 
            } 

            detailsBar.append(detailCard) 
        }

        // display the annotation form to create and edit comments 
        // pass in detailsLocation word location with dashes 
        function addCommentForm(detailsLocation){
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
            detailsBar.prepend(commentFormCard)

            newCommentForm.addEventListener('submit', function(){
                event.preventDefault() 
                // create comment 
                if (qs('input#submit-comment').value == "Create"){
                    createNewComment(detailsLocation) 
                }
                // edit comment 
                if (qs('input#submit-comment').value == "Update"){
                    editComment(detailsLocation) 
                } 
                newCommentForm.reset() 
            }) 
        }

        // logic and API to create new comment 
        // pass in detailsLocation as word location with dashes 
        function createNewComment(detailsLocation){
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
                    privacy: inputPrivacy
                })
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json) 
                    if (json.error == null) {
                        fetchDetails(detailsLocation) 
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
        function editComment(detailsLocation){
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
                    fetchDetails(detailsLocation)  
                }) 
        }

        // displays if word has been saved to user's word bank 
        function addSavedIndicator(indicator, detailsLocation, grkWord) { 
            indicatorCard = ce('div')
            indicatorCard.id = "saved-indicator-card" 
            indicatorText = ce('p')
            indicatorText.id = "saved-indicator-text"
            changeSavedButton = ce('button') 
            changeSavedButton.id = "change-saved-status" 

            if (indicator == "saved"){
                indicatorText.innerText = "Word Saved"
                changeSavedButton.innerText = "Unsave"
            }else { 
                indicatorText.innerText = "Word Not Saved"
                changeSavedButton.innerText = "Save"
            }

            // toggle saved or unsaved function  
            changeSavedButton.addEventListener('click', function(){
                fetch("http://localhost:3000/savedwords", {
                    method: 'POST',
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
                            const indicatorTextChange = qs('p#saved-indicator-text')
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

            indicatorCard.append(indicatorText, changeSavedButton)
            detailsBar.prepend(indicatorCard) 
        }

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
        loadText("1.1") 

        // <-- end of navigation functionality 


    } // end of textPage() function 

    // < -- END OF SHOW TEXT TAB OF PAGE 
    



    //  SHOW WORDS TAB OF PAGE  --> 

    function savedwordsPage(){ 
        const savedwordsDisplayDiv = ce('div')
        savedwordsDisplayDiv.id = 'savedwords-display'
        bottomContainer.append(savedwordsDisplayDiv) 

        const savedwordsDetailDiv = ce('div')
        savedwordsDetailDiv.id="savedwords-detail" 
        savedwordsDetailDiv.innerText = "hello"
        bottomContainer.append(savedwordsDetailDiv) 

        const savedwordsDisplayCard = ce('div')
        savedwordsDisplayCard.id = 'words-card' 
        savedwordsDisplayDiv.append(savedwordsDisplayCard)

        const savedwordsDisplayList = ce('ul')
        savedwordsDisplayList.id = "savedwords-display-list"
        savedwordsDisplayCard.append(savedwordsDisplayList)

        if (sessionStorage.getItem(userkey) == null ){
            savedwordsDisplayCard.innerHTML = "Please Log in to Save Words"
        }else { 
            fetchsavedwords() 
        } 
    }

    function fetchsavedwords(){
        const wordList = qs('ul#savedwords-display-list') 
        fetch("http://localhost:3000/savedwords/show", {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:  JSON.stringify({
                userkey: sessionStorage.getItem('userkey') 
            }) 
        }) 
            .then(res => res.json())
            .then(json =>{
                console.log(json) 
                json.forEach(savedword => {
                    console.log(savedword.word.content)
                    const wordLi = ce('li')
                    wordLi.innerText = savedword.word.content + " at " + savedword.word.location.split("-").slice(0,2).join(".") 
                    wordList.append(wordLi)
                })
            }) 
    }


    // run textpage() when site is opened 
    textPage() 

    // run textpage when tab is clicked 
    const textPageTab = qs('span#page-text')
    textPageTab.addEventListener('click', function(){
        textPage() 
    })

    //saved words lab 
    const savedwordsTab = qs('span#page-saved-words')
    savedwordsTab.addEventListener('click', function(){
        bottomContainer.innerHTML = ""
        savedwordsPage() 
    }) 

    const annotationsTab = qs('span#page-annotations')
    annotationsTab.addEventListener('click', function(){
        bottomContainer.innerHTML = "annotations yoo"
    }) 

})

