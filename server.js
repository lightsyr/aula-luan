const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const session = require("express-session")

// configurações de view engine
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

// config url enconded
app.use(express.urlencoded({extended:true}))

// configuração de sessão
app.use(session({
    secret:"testandoisso",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }
}))


function isAuth(req, res, next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/")
    }
}

app.get("/", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    if (email == "teste@email.com" && password == "123") {
      console.log("Logou com sucesso");
      req.session.userEmail = email;
      req.session.isAuth = true;
      return res.redirect("/dashboard");
    }
  
    return res.redirect("/");
  });
  

app.get("/dashboard", isAuth,(req, res) => {
    res.render("dashboard", {userEmail: req.session.userEmail})
})

app.get("/logout", (req, res) => {
    req.session.destroy((error)=>{
        if(error){
            console.log(error)
        }
    })
})

console.log("application running on http://localhost:3000")

app.listen(3000)