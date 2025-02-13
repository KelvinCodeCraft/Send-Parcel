const regUserApi = 'http://localhost:4000/api/users/register'
const loginApiUrl = 'http://localhost:4000/api/users/login'
const usersApiUrl = 'http://localhost:4000/api/users'


const accountExistsMsg = document.getElementById("account-exists")
const invalidMessage = document.getElementById("incomplete")
const success = document.querySelector('.success')
const incorrectCredentials = document.querySelector(".incorret-credentials")
const loginErrorMsg = document.getElementById("login-error");

document.addEventListener("DOMContentLoaded", () => {
    const showRegForm = document.getElementById("showRegForm");
    const showLoginForm = document.getElementById("showLoginForm");
    const showPassResetForm = document.getElementById("showPassResetForm");

    const regForm = document.querySelector(".regForm");
    const loginForm = document.querySelector(".loginForm");
    const passwordReset = document.querySelector(".passwordReset");

    showRegForm.addEventListener("click", (event) => {
        event.preventDefault();
        regForm.style.display = "block";
        loginForm.style.display = "none";
        passwordReset.style.display = "none";
    });

    showLoginForm.addEventListener("click", (event) => {
        event.preventDefault();
        regForm.style.display = "none";
        loginForm.style.display = "block";
        passwordReset.style.display = "none";
    });

    showPassResetForm.addEventListener("click", (event) => {
        event.preventDefault();
        regForm.style.display = "none";
        loginForm.style.display = "none";
        passwordReset.style.display = "block";
    });
});


regForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // const name = document.getElementById("name").value.trim();
    // const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!phone || !email || !password) {
        invalidMessage.style.display = "block";
        setTimeout(() => {
            invalidMessage.style.display = "none";
        }, 4000);
        return;
    }

    try {
        let checkResponse = await fetch(usersApiUrl);
        let users = await checkResponse.json();
        let existingUser = users.find(user => user.email === email);

        if (existingUser) {
            accountExistsMsg.style.display = "block";
            setTimeout(() => {
                accountExistsMsg.style.display = "none";
            }, 4000);
            return;
        }

        const newUser = { email, password, phone };

        let response = await fetch(regUserApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const createdUser = await response.json();
        console.log("Created user: ", createdUser);

        success.textContent = "Account created successfully. Login to proceed";
        success.style.display = "block";
        setTimeout(() => {
            success.style.display = "none";
            regForm.reset();
        }, 5000);

    } catch (error) {
        console.log(error);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = document.getElementById("loginEmail").value.trim()
    const password = document.getElementById("loginPassword").value.trim()

    if (!email || !password) {
        console.log('Incomplete block');
        
        loginErrorMsg.textContent = 'Please fill in all the fields';
        loginErrorMsg.style.display = "block";
        setTimeout(() => {
            loginErrorMsg.style.display = "none";
        }, 4000);
        return;
    }

    try {
        let response = await fetch(loginApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed. Please try again.");
        }

        console.log("User logged in:", data);
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("is_admin", data.user.is_admin);
        sessionStorage.setItem("user_email", data.user.email)

       
        success.textContent = "Login successful!";
        success.style.display = "block";

        setTimeout(() => {
            success.style.display = "none";
            loginForm.reset();
            window.location.href = "dashboard.html"; 
        }, 3000);

        

    } catch (error) {
        loginErrorMsg.textContent = error.message;
        loginErrorMsg.style.display = "block";
        setTimeout(() => {
            loginErrorMsg.style.display = "none";
        }, 4000);
        console.log(error);
    }

})

