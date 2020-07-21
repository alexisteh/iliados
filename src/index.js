document.addEventListener('DOMContentLoaded', function(){

    // helper methods 
    function qs(identifier){
        return document.querySelector(identifier) 
    }

    function ce(element){
        return document.createElement(element) 
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
            debugger
            fetch('http://localhost:3000/users/login', configObj)
            .then(res => res.json())
            .then(json => {
                if (json.message.split(" ")[0] == "LoggedIn"){
                    sessionStorage.setItem('userkey', json.message.split(" ")[1])
                    console.log(sessionStorage.getItem('userkey'))

                    const coverUpBox = ce('div')
                    coverUpBox.id = "login-cover" 
                    let loggedInText = ce('p') 
                    loggedInText.innerText = "You are logged in as @" + json.message.split(" ")[2]
                    let logoutButton = ce('button') 
                    logoutButton.innerText = "Logout" 
                    coverUpBox.appendChild(loggedInText)
                    coverUpBox.appendChild(logoutButton)
                    pageHeader.append(coverUpBox)
                    logoutButton.addEventListener('click', function(){
                        sessionStorage.removeItem('userkey') 
                        coverUpBox.parentNode.removeChild(coverUpBox)

                    }) 

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
    // <-- end of logging in and signing up 


    // display text in container functionality --> 

    const textContainer = qs('div#text-container') 
    const textTable = qs('table#text-table')
    
    // load next 50 lines after chunkNumber, inclusive
    function loadText(chunkNumber){       
        textTable.innerHTML ="" 
        const book = parseInt(chunkNumber.split(".")[0]) 
        const startPoint = parseInt(chunkNumber.split(".")[1]) 
        const endPoint = startPoint + 49 
        grabLine(book, startPoint, endPoint, 0) 
    }

    function grabLine(book, i, endI, skip){ 
        const currentReq = new XMLHttpRequest()
        console.log("https://www.perseus.tufts.edu/hopper/CTS?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001:"+book+"."+i)
        currentReq.open("GET", "https://www.perseus.tufts.edu/hopper/CTS?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001:"+book+"."+i, true)
        currentReq.onload = function() { 
            if (currentReq.responseText.split('Invalid URN reference').length == 1){
                let lineOutput = currentReq.responseText.split('<tei:div type="line">')[1].split("</tei:div>")[0]
                if (lineOutput.split('<milestone ed="P" unit="para"/>').length == 2){
                    lineOutput = "<br/>" + lineOutput.split('<milestone ed="P" unit="para"/>')[1]
                } 
                console.log(lineOutput)
                console.log(lineOutput) 
                const currentTableRow = ce('tr')
                const currentLineNumber = ce('td') 
                currentLineNumber.innerText = i 
                const currentLineText = ce('td')
                currentLineText.innerHTML= lineOutput 
                currentTableRow.append(currentLineNumber, currentLineText)
                textTable.append(currentTableRow) 
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
                        console.log(delayedLine) 
                        passes = passes - 1
                    }  
                    interval = interval + 1 
                    console.log(interval) 
                    if (interval >= 20){
                        const currentTableRow = ce('tr')
                        const currentLineNumber = ce('td') 
                        const currentLineText = ce('td')
                        currentLineText.innerHTML= "END"   
                        currentLineText.style.textAlign="center"
                        currentLineText.style.fontWeight="bold"
                        currentTableRow.append(currentLineNumber, currentLineText)
                        textTable.append(currentTableRow) 
                        return 
                    } 
                } 
                const currentTableRow = ce('tr')
                const currentLineNumber = ce('td') 
                currentLineNumber.innerText = i 
                const currentLineText = ce('td')
                currentLineText.innerHTML= delayedLine  
                currentTableRow.append(currentLineNumber, currentLineText)
                textTable.append(currentTableRow) 
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

    const manualNavNumber = qs('form#go-to-page')

    manualNavNumber.addEventListener('submit', function(){
        event.preventDefault()
        const input = qs('#smallnuminput').value 
        const inputLine = parseInt(input.split(".")[1])
        const closestPoint = inputLine - (inputLine % 50) +1 
        const closestOutput = `${input.split(".")[0]}.${closestPoint}`
        const blank = qs('input#smallnuminput')
        blank.value = closestOutput 
        loadText(closestOutput) 
    }) 
})
