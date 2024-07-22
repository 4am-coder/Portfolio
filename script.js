//FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyDpMgubNJgQKnUXpXLdqbX8ONeKUYlSVsE",
    authDomain: "portfolio-manan-2703.firebaseapp.com",
    databaseURL: "https://portfolio-manan-2703-default-rtdb.firebaseio.com",
    projectId: "portfolio-manan-2703",
    storageBucket: "portfolio-manan-2703.appspot.com",
    messagingSenderId: "76323952350",
    appId: "1:76323952350:web:48d1b1ff600a072f69944f"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database()

auth.onAuthStateChanged(function (user) {

    if (user) {
        console.log("User signed in:", user.uid);
        const navItem = document.getElementById("checkUser")
        const a = document.createElement('a');
        a.href = 'account.html';
        a.innerText = "Account";
        navItem.innerHTML = ""
        navItem.appendChild(a);
        const usersRef = database.ref("users");
        const userId = user.uid;
        usersRef.child(userId).once("value")
            .then((snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    document.getElementById("account-username").innerHTML = userData.name
                    document.getElementById("account-email").innerHTML += userData.email
                    document.getElementById("account-uid").innerHTML += user.uid
                    let d = new Date(userData.account_created)
                    document.getElementById("account-created").innerHTML += d.toString()
                    d = new Date(userData.last_login)
                    document.getElementById("account-lastLogin").innerHTML += d.toString()
                } else {
                    console.log("User not found.");
                }
            })
            .catch((error) => {
                console.log("Error reading user data:", error);
            });
    } else {
        const navItem = document.getElementById("checkUser")
        const a = document.createElement('a');
        a.href = 'login.html';
        a.innerText = "Login";
        navItem.innerHTML = ""
        navItem.appendChild(a);
    }
});


function register(event) {
    event.preventDefault()
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser
            var user_data = {
                email: email,
                name: name,
                password: password,
                account_created: Date.now(),
                last_login: Date.now()
            }
            alert("User Created Successfully!")

            const usersRef = database.ref("users");
            usersRef.child(user.uid).set(user_data)
                .then(() => {
                    window.location.replace("account.html");
                })
                .catch((error) => {
                    alert(`Error saving data: ${error.message}`)
                });
        })
        .catch(function (error) {
            alert(`Error - ${error.message} Try Logging in instead`)
        });
}


function login(event) {
    event.preventDefault()
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser
            var user_data = {
                last_login: Date.now()
            }
            alert("User Logged in successfully!")

            const usersRef = database.ref("users");

            usersRef.child(user.uid).update(user_data)
                .then(() => {
                    window.location.replace("account.html");
                })
                .catch((error) => {
                    alert(`Error updating data: ${error.message}`)
                });
        })
        .catch(function (error) {
            alert(`Error - ${error.message}`)
        });
}
function logout(event) {
    event.preventDefault()
    auth.signOut().then(() => {
        window.location.replace("login.html");
    }).catch((error) => {
        alert(`Error signing out: ${error.message}`);
    });
}

//ON LOAD FUNCTION
let currentTheme = localStorage.getItem("theme");

window.onload = load();
function load() {
    document.querySelector('body').classList.add(currentTheme)
    if (currentTheme == "light") {
        document.getElementById("themeIcon").classList.remove("fa-moon-o", "fa-sun-o");
        document.getElementById("themeIcon").classList.add("fa-moon-o")
    } else {
        document.getElementById("themeIcon").classList.remove("fa-moon-o", "fa-sun-o");
        document.getElementById("themeIcon").classList.add("fa-sun-o")
    }
}

//HAMBURGER AND THEME
let navbarOpen = false
function toggleMenu() {
    if (!navbarOpen){
        navbarOpen= true
        document.getElementById('sidebar').classList.add('sidebar-open')
        document.getElementById('menuline1').classList.add('menuline-1-open')
        document.getElementById('menuline2').classList.add('menuline-2-open')
        document.getElementById('menuline3').classList.add('menuline-3-open')
    } else {
        navbarOpen= false
        document.getElementById('sidebar').classList.remove('sidebar-open')
        document.getElementById('menuline1').classList.remove('menuline-1-open')
        document.getElementById('menuline2').classList.remove('menuline-2-open')
        document.getElementById('menuline3').classList.remove('menuline-3-open')
    }
}

function switchTheme() {
    document.querySelector('body').classList.remove("light", "dark")
    if (currentTheme == "light") {
        currentTheme = "dark"
        document.getElementById("themeIcon").classList.remove("fa-moon-o", "fa-sun-o");
        document.getElementById("themeIcon").classList.add("fa-sun-o")
    } else {
        currentTheme = "light"
        document.getElementById("themeIcon").classList.remove("fa-moon-o", "fa-sun-o");
        document.getElementById("themeIcon").classList.add("fa-moon-o")
    }
    localStorage.setItem("theme", currentTheme)
    document.querySelector('body').classList.add(currentTheme)
}