// =====================================
// SIGN IN JAVASCRIPT
// =====================================

const signinForm =
    document.getElementById("signinForm");

const signinMessage =
    document.getElementById("signinMessage");


signinForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        if (!email || !password) {

            signinMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        // Demo sign-in

        localStorage.setItem(
            "hotelUser",
            JSON.stringify({
                email: email
            })
        );


        signinMessage.textContent =
            "Sign in successful!";


        setTimeout(
            function() {

                window.location.href =
                    "index.html";

            },
            1000
        );

    }
);