const datos = require("./cad.js");
const correo=require("./email.js");
const bcrypt=require("bcrypt")

function Sistema(test){
  this.usuarios={};  //this.usuarios=[]   esto seria un array normal basado en indices pero al usar {} es como un diccionario
  this.partidas={}
  this.test=test; //valor de tipo booleanoç
  this.cad=new datos.CAD() //nueva instancia de capa de acceso a datos
  
  this.agregarUsuario=function(usr){
      let email=usr.email;
      let res={"email":-1};
      if (!this.usuarios[email]){
      this.usuarios[email]=new Usuario(usr);
      console.log("el email "+email+" se ha añadido")
      res.email=email;
      
      }
      else{
      console.log("el email "+email+" está en uso");
      }
      return res;
      }
  
  this.usuarioGoogle=function(usr,callback){
    let modelo=this;
      this.cad.buscarOCrearUsuario(usr,function(res){
          console.log("El usuario"+res.email+ "está registrado en el sistema");
          callback(res);
          modelo.agregarUsuario(usr);
          //correcion pensada para contener a los usuarios que han llegado a iniciar sesion en mi sistemaz
      })
  }
      

  this.obtenerUsuarios=function(){
      return this.usuarios;
      }

  this.usuarioActivo=function(email){
      let res={"activo":-1};
      if(email in this.usuarios){
          console.log("el email "+email+" esta activo")
          res.activo=true;
          return res;

      }
      else{
          console.log("el email "+email+" no esta activo")
          res.activo=false;
          return res;
      }
  }

  this.deleteUsuario=function(email){
      let res={"email":-1};
      if(!this.usuarios[email]){

          return ("No se puede borrar, no existe usuario con estos datos")
      }
      else{
          delete this.usuarios[email]
          
          res.email=email;
          return ("Se ha eliminado el usuario "+ email)
      }
  }
  this.numeroUsuarios = function() {
      let res={"num":-1};
      // Contar el número de usuarios (claves) en el objeto usuarios
      res.num = Object.keys(this.usuarios).length;
      return res.length;
  }
  
  if(!this.test){
      this.cad.conectar(function(){
          console.log("Conectando a Mongo Atlas")
      });
        

  }

  correo.conectar( function(res){
      console.log("Variables secretas obtenidas.")
  })

  this.registrarUsuario = (obj, callback) => {
    let modelo = this;
    if (!obj.email) {
      obj.email = obj.email;
    }
  
    // Genera un hash de la clave antes de almacenarla
    bcrypt.hash(obj.password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return callback({ "error": "No se pudo cifrar la clave" });
      }
  
      // Sustituye la clave original con el hash
      obj.password = hash;
  
      modelo.cad.buscarUsuario({"email": obj.email}, (usr) => {
        if (!usr) {
          // El usuario no existe, luego lo puedo registrar
          obj.key = Date.now().toString();
          obj.confirmada = false;
          modelo.cad.insertarUsuario(obj, (res) => {
            // Una vez registrado en la base de datos, lo añadimos a la lista de usuarios
            modelo.usuarios[obj.email] = new Usuario(obj);
            callback(res);
          });
  
          if (!modelo.test) {
            correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
          }
        } else {
          callback({ "email": -1 });
        }
      });
    });
  }
  

 this.confirmarUsuario=function(obj,callback){
      let modelo=this;
      this.cad.buscarUsuario({"email": obj.email, "confirmada":false, "key":obj.key},function(usr){
          if(usr){
              usr.confirmada=true;
              modelo.cad.actualizarUsuario(usr,function(res){
                  modelo.usuarios[obj.email] = new Usuario(obj);
                  callback({"email":res.email});
              })
          }
          else{
              callback({"email":-1});
          }
      })
 }

 this.loginUsuario = (obj, callback) => {
  this.cad.buscarUsuario({ "email": obj.email, "confirmada": true }, (usr) => {
    if (usr) {
      bcrypt.compare(obj.password, usr.password, (err, result) => {
        if (err) {
          console.error(err);
          return callback({ "error": "Error al comparar las claves" });
        }
        if (result) {
          console.log("Las contraseñas coinciden.");
          this.usuarios[obj.email] = new Usuario(usr);
          callback(usr);
        } else {
          console.log("Las contraseñas no coinciden.");
          callback({ "email": -1 });
        }
      });
    } else {
      callback({ "email": -1 });
    }
  });
}


this.crearPartida = function(email) {
  
      let codigoPartida = obtenerCodigo(); // Obtener un código aleatorio para la partida
      let nuevaPartida = new Partida(codigoPartida);
      nuevaPartida.jugadores.push(email); // Agregar el creador de la partida como jugador
      this.partidas[codigoPartida] = nuevaPartida;
      
      this.registrarLog("Partida creada", email)
      console.log("Se ha creado una nueva partida con código: " + codigoPartida);
      return codigoPartida;
  
}


this.unirUsuarioPartida = function(email, codigoPartida) {
  
      let partida = this.partidas[codigoPartida];
      if (partida.jugadores.includes(email)) {
          console.log("El usuario con email " + email + " ya está en la partida con codigo " + codigoPartida);
          return partida;
      } else if (partida.jugadores.length < partida.maxJug) {
          partida.jugadores.push(email);
          console.log("El usuario con email " + email + " se ha unido a la partida con codigo " + codigoPartida);
          return partida;
      } else {
          console.log("La partida esta llena. No se puede unir mas usuarios.");
          return null;
      }
  
}


this.usuariosEnPartida = function(codigoPartida) {
  if (codigoPartida in this.partidas) {
      let partida = this.partidas[codigoPartida];
      console.log("Usuarios en la partida con código " + codigoPartida + ":");
      partida.jugadores.forEach(function(email, index) {
          console.log((index + 1) + ". " + email);
      });
      return partida.jugadores;
  } else {
      console.log("La partida con código " + codigoPartida + " no existe en el sistema.");
      return null;
  }
}


this.obtenerPartidasDisponibles = function() {
  let partidasDisponibles = [];
  for (let codigoPartida in this.partidas) {
      let partida = this.partidas[codigoPartida];
      if (partida.jugadores.length < partida.maxJug) {
          partidasDisponibles.push(partida);
      }
  }
  if (partidasDisponibles.length > 0) {
      console.log("Partidas disponibles:");
      partidasDisponibles.forEach(function(codigo) {
          console.log("- Codigo de partida: " + codigo);
      });
      return partidasDisponibles;
  } else {
      console.log("No hay partidas disponibles en este momento.");
      return null;
  }
}


this.registrarLog = function(tipoOperacion, email){
  console.log(email)
    let log = {
    "tipoOperacion": tipoOperacion,
    "email": email,
    "fecha-hora":new Date().toISOString()
  };
  this.cad.insertarLog(log,(res)=>{
    console.log("Log registrado",res);
  })


}

}

function obtenerCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const longitudCodigo = 6;
  let codigo = '';
  for (let i = 0; i < longitudCodigo; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}



function Usuario(usr){
  this.nick=usr.nick;
  this.email=usr.email;
  this.clave;
  //se pueden añadir mas datos
 }
function Partida(codigo){
  this.codigo=codigo;
  this.jugadores=[];
  this.maxJug=2;
  //se pueden añadir mas datos
 }

   module.exports.Sistema=Sistema