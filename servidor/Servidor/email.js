const nodemailer = require('nodemailer'); 
const gv = require('./gestorVariables.js');//llamamos al gestor de variables.
const url = "http://localhost:3005/"
//const url= "https://arquitecturabaseprocesos-6bnn4osd7q-ew.a.run.app/";

let options={
    user: "",
    pass: ""
}

/* gv.accessClaveCorreo(function(clave){ //seteo la clave

    
    options.pass=clave;
    
})  */

let transporter;

module.exports.conectar=function(callback){
gv.obtenerOptions(function(res){ 

    //console.log(res)
    options=res;
    callback(res);  
})  
}



module.exports.enviarEmail=async function(direccion, key,men) {

/*     const transporter = nodemailer.createTransport({
    service: 'gmail',
/*     auth: {
        user: 'pablobobilloalbendea@gmail.com',
        pass: 'jssa lxcf abao jgkj' //no es la clave de gmail
    } 
    auth:options
}); */

    transporter=nodemailer.createTransport({
        service: 'gmail',
        
        auth:options
    });

    const result = await transporter.sendMail({
        from: 'pablobobilloalbendea@gmail.com',
        to: direccion,
        subject: 'Confirmar cuenta',
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
console.log(JSON.stringify(result, null, 4));
}
