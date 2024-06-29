const fs=require("fs");
const bodyParser=require("body-parser");
const express = require('express');
const app = express();
const httpServer = require ('http').Server(app);
const { Server } = require("socket.io");//aplicacion en tiempo real 

//const passport=require("passport");
const cookieSession=require("cookie-session");
//const LocalStrategy = require('passport-local').Strategy;
//require("./Servidor/passport-setup.js");
const jwt = require("jsonwebtoken");

const modelo = require("./Servidor/modelo.js");
const args = process.argv.slice(2); 
//para que las pruebas no se conecten a mongo

const cors=require("cors");//permite acceso al CW

/* const haIniciado=function(request,response,next){
    if (request.user){
    next();
    }
    else{
    response.redirect("/")
    }
    } */
const verifyToken = (req, res, next) => {
        const token = req.header('auth-token');
        if (!token) return res.status(401).json({ error: 'Acceso denegado' })
        try {
        const verified = jwt.verify(token, "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")
        req.user = verified
        next() // continuamos
        } catch (error) {
        res.status(400).json({error: 'token no es válido'})
        }   
    } 
const moduloWS = require ("./Servidor/servidorWS.js");
let ws = new moduloWS.ServidorWS();
let io = new Server(httpServer,{cors:{ origins: '*:*'}});   

const PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + "/"));

app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
   }));

/* app.use(passport.session()); */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3000"
}));


let test=false; 
test=eval(args[0]); //test=true test=false

let sistema = new modelo.Sistema(test); //se pasa un parametro al sistema

app.get("/", function(request,response){
  
    var contenido=fs.readFileSync(__dirname+"/Cliente/index.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
    
}); 

app.get("/agregarUsuario/:email",function(request,response){
    let email=request.params.email;
    let res=sistema.agregarUsuario(email);
    response.send(res);
    }); 

app.get("/obtenerUsuarios",verifyToken,function(request,response){
       
    let res=sistema.obtenerUsuarios();
    response.send(res);
        });


app.get("/usuarioActivo/:email",verifyToken,function(request,response){
     
    let email=request.params.email;
    let res=sistema.usuarioActivo(email);
    response.send(res);
     });

app.get("/numeroUsuarios",verifyToken,function(request,response){
       
    let res=sistema.numeroUsuarios();
    response.send(res);
    });

    app.get("/deleteUsuario/:email",verifyToken,function(request,response){
    let email=request.params.email;   
    let res=sistema.deleteUsuario(email);
    response.send(res);

    });
 
    
// app.listen(PORT, () => { 
// console.log(`App está escuchando en el puerto ${PORT}`);
// console.log('Ctrl+C para salir');
// });

httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});
//io.listen(httpServer);
ws.lanzarServidor(io,sistema);

app.post("/loginUsuario",function(request,response){
    sistema.loginUsuario(request.body,function(user){
    let token=jwt.sign({email:user.email,id:user._id},"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");
    response.header("authtoken",token).json({error:null,data:token,email:user.email});
    })
    })

/* app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] })); */


/* app.get('/google/callback',
 passport.authenticate('google', { failureRedirect: '/fallo' }),
 function(req, res) {
    res.redirect('/good');
});

app.post('/oneTap/callback',
 passport.authenticate('google-one-tap', { failureRedirect: '/fallo' }),
 function(req, res) {
    res.redirect('/good');
});
 */
/* app.get("/good", function(request,response){
    let email=request.user.emails[0].value;

    sistema.usuarioGoogle({"email":email},function(usr){
    response.cookie('email', usr.email);
    response.redirect('/');
    }); 
    });


   app.get("/fallo",function(request,response){
    response.send({email:"nook"})
   }); */

   app.post('/enviarJwt',function(request,response){
    let jswt=request.body.jwt;
    let user=JSON.parse(atob(jswt.split(".")[1]));
    let email=user.email;
    sistema.usuarioGoogle({"email":email},function(obj){
    let token=jwt.sign({email:obj.email,id:obj._id},"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");
    response.header("authtoken",token).json({error:null,data:token,email:obj.email});
    })
    });
    

   app.post("/registrarUsuario",function(request,response){
        sistema.registrarUsuario(request.body,function(res){
            response.send({"email":res.email});
        });
    });

  app.post("/loginUsuario",function(request,response){
        sistema.registrarUsuario(request.body,function(res){
        response.send({"email":res.email});
        });
        });
    

/*     app.post('/loginUsuario',passport.authenticate("local",{failureRedirect:"/fallo",successRedirect: "/ok"})
        );
         */
/*     app.get("/ok",function(request,response){
        response.send({email:request.user.email})
    }); */
        

    app.get("/confirmarUsuario/:email/:key",function(request,response){
            let email=request.params.email;
            let key=request.params.key;
            sistema.confirmarUsuario({"email":email,"key":key},function(usr){
                if (usr.email!=-1){
                    response.cookie('email',usr.email);
                }
                response.redirect('/');
              });
            })

    app.get("/cerrarSesion",verifyToken,function(request,response){
        let email=request.user.email;
        request.logout();
        response.redirect("/");
            if (email){
                sistema.deleteUsuario(email);
            }
    });