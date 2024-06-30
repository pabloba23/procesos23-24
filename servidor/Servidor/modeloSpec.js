const modelo = require("./modelo.js");

describe('El sistema', function() {
    let sistema;
    let usr;

    beforeEach(function() {
        sistema = new modelo.Sistema(true);
        usr = { "nick": "Pepe", "email": "pepe@pepe.es" };
    });

    it('Inicialmente no hay usuarios', function() {
        expect(sistema.numeroUsuarios()).toEqual(0);
        console.log("pasa");
    });

    it('Agregamos usuario', function() {
        sistema.agregarUsuario(usr);
        expect(sistema.numeroUsuarios()).toEqual(1);
        expect(sistema.usuarios[usr.email].nick).toEqual("Pepe");
        expect(sistema.usuarios[usr.email].email).toEqual("pepe@pepe.es");
    });

    it('Usuario activo', function() {
        sistema.agregarUsuario(usr);
        const resultadoT = sistema.usuarioActivo("pepe@pepe.es");
        expect(resultadoT.activo).toEqual(true);
        sistema.deleteUsuario("pepe@pepe.es");
        const resultadoF = sistema.usuarioActivo("pepe@pepe.es");
        expect(resultadoF.activo).toEqual(false);
    });

    it('Borramos usuario', function() {
        sistema.agregarUsuario(usr);
        expect(sistema.numeroUsuarios()).toEqual(1);
        sistema.deleteUsuario("pepe@pepe.es");
        expect(sistema.numeroUsuarios()).toEqual(0);
    });

    it('Obtenemos usuarios', function() {
        let lista = sistema.obtenerUsuarios();
        expect(Object.keys(lista).length).toEqual(0);
        sistema.agregarUsuario(usr);
        sistema.agregarUsuario({ "nick": "Pepe1", "email": "pepe1@pepe.es" });
        lista = sistema.obtenerUsuarios();
        expect(Object.keys(lista).length).toEqual(2);
    });

    it('Numero usuarios', function() {
        expect(sistema.numeroUsuarios()).toEqual(0);
        sistema.agregarUsuario(usr);
        expect(sistema.numeroUsuarios()).toEqual(1);
    });


    describe("Pruebas de las partidas", function() {
      let usr2, usr3;
  
      beforeEach(function(done) {
          usr2 = { "nick": "Pepa", "email": "pepa@pepa.es" };
          usr3 = { "nick": "Pepo", "email": "pepo@pepo.es" };
          sistema.cad.conectar(function() {
              sistema.agregarUsuario(usr);
              sistema.agregarUsuario(usr2);
              sistema.agregarUsuario(usr3);
              done();
          });
      });
  
      it("Usuarios y partidas en el sistema", function() {
          expect(sistema.numeroUsuarios()).toEqual(3);
          expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
      });
  
      it("Crear partida", function() {
          let res = sistema.crearPartida(usr.email);
          expect(res).not.toBe(-1);
          expect(sistema.obtenerPartidasDisponibles().length).toEqual(1);
       });
  
      it("Unir a partida", function() {
          let codigoPartida = sistema.crearPartida(usr.email);
          sistema.unirUsuarioPartida(usr2.email, codigoPartida);
          expect(sistema.partidas[codigoPartida].jugadores).toContain(usr2.email);
      });
  
      it("Usuario no puede estar dos veces en la misma partida", function() {
          let codigoPartida = sistema.crearPartida(usr.email);
          sistema.unirUsuarioPartida(usr.email, codigoPartida);
          expect(sistema.partidas[codigoPartida].jugadores.length).toEqual(1);
      });
  
      it("Obtener partidas", function() {
          let codigoPartida = sistema.crearPartida(usr.email);
          sistema.unirUsuarioPartida(usr2.email, codigoPartida);
          let partidas = sistema.obtenerPartidasDisponibles();
          expect(partidas.length).toEqual(0);
      });
  });
  

    describe("Metodos que acceden a datos", function() {
        let usrTest = { "email": "test@test.es", "password": "test", "nick": "test" };

         beforeEach(function(done){
            sistema.cad.conectar(function(){
            //sistema.registrarUsuario(usrTest,function(res){     //este codigo solo se ejecuta una vez para tener el usuario en la bbdd y despues se comenta
                  //sistema.confirmarCuenta(usrTest.email,function(){       //en vez de hacer este codigo para que lo confirme, confirmamos el usuario a mano en la base da datos
                  done();   //indica que ya nos hemos conectado  
                  //})
            //});
            // done();     
            })
         });
         afterEach(function(){
            //cerrar la conexion
         })
      
         it("Inicio de sesion correcto",function(done){
            sistema.loginUsuario(usrTest,function(res){
            expect(res.email).toEqual(usrTest.email);
            expect(res.email).not.toEqual(-1);
            done();
            });
         });
      
         it("Inicio de sesion incorrecto",function(done){
            let usr1= {"email":"test@test.es","password":"test23","nick":"test"}
            sistema.loginUsuario(usr1,function(res){
            expect(res.email).toEqual(-1);
            done();
            });
      
       });


      
    });
});
