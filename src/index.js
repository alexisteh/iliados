document.addEventListener('DOMContentLoaded', function(){
    console.log('hi')

    function qs(identifier){
        return document.querySelector(identifier) 
    }

    function ce(element){
        return document.createElement(element) 
    }

    // logging in and signing up  functionality 
    const login_form = qs('form#login-form')
    const form_submit_button = qs('#login-form-submit') 
    const toggle_login_signup_button = qs('button#change-login-signup') 
    const input_username = qs('input#input-username')
    const input_password = qs('input#input-password')
    const user_message_slot = qs('td#login-message') 

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
        if (form_submit_button.value == "Log In"){
            fetch('http://localhost:3000/users/login', configObj)
            .then(res => res.json())
            .then(json => {
                if (json.message.split(" ")[0] == "LoggedIn"){
                    sessionStorage.setItem('userkey', json.message.split(" ")[1])
                    console.log(sessionStorage.getItem('userkey'))

                    let loginBox = qs('div#login-box')
                    loginbox.innerHTML = ""

                    logoutButton.addEventListener('click', function(){
                        loginBox.innerHTML = '<div id="login-box">
                        <table text-align="center"> 
                            <form id="login-form"> 
                                <tr> <td colspan="2" id="login-message"></td></tr>
                                <tr> <td>Username:</td>
                                    <td><input type="text" id="input-username"></td></tr> 
                                <tr> <td>Password:</td>
                                    <td><input type="text" id="input-password"></td></tr>
                                <tr><td></td><td><input type="submit" value="Log In" id="login-form-submit"> </form>
                                        <button id="change-login-signup">Or Sign Up</button></td></tr> 
                        </table>
                    </div>'

                        
                    })

                } 
                else {
                    user_message_slot.innerText = json.message
                }
            })  
        }
        if (form_submit_button.value == "Sign Up"){ 
            fetch('http://localhost:3000/users/new', configObj)
                .then(res => res.json())
                .then(json => {
                    user_message_slot.innerText = json.message 
                }) 
        } 
        
        login_form.reset() 
    }) 


})