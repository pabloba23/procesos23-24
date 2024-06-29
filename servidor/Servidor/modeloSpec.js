const modelo = require("./modelo.js");
const Sistema = modelo.Sistema;

describe('El sistema', function() {
   let sistema;
   
  beforeEach(function() {
   sistema=new Sistema(true)
   usr={"nick":"Pepe","email":"pepe@pepe.es"}

   });
   
  
   it('Inicialmente no hay usuarios', function() {
   expect(sistema.numeroUsuarios()).toEqual(0);
   });

   it('Agregamos usuario', function() {
      
      sistema.agregarUsuario(usr);
      expect(sistema.numeroUsuarios()).toEqual(1);
      expect(sistema.usuarios[usr.email].nick).toEqual("Pepe")
      expect(sistema.usuarios[usr.email].email).toEqual("pepe@pepe.es")
      });

   it('Usuario activo', function(){
      sistema.agregarUsuario(usr);
      const resultadoT = sistema.usuarioActivo("pepe@pepe.es");
      expect(resultadoT.activo).toEqual(true);
      sistema.deleteUsuario("Pepe");
      const resultadoF = sistema.usuarioActivo("Pepe");
      expect(resultadoF.activo).toEqual(false);
      })

   it('Borramos usuario', function() {
      sistema.agregarUsuario(usr);
      expect(sistema.numeroUsuarios()).toEqual(1);
      sistema.deleteUsuario("pepe@pepe.es");
      expect(sistema.numeroUsuarios()).toEqual(0);
         
         });

   it('Obtenemos usuarios', function() {
            let lista=sistema.obtenerUsuarios();
            expect(Object.keys(lista).length).toEqual(0);
            sistema.agregarUsuario(usr);
            sistema.agregarUsuario({"nick":"Pepe1","email":"pepe1@pepe.es"});
            lista=sistema.obtenerUsuarios();
            expect(Object.keys(lista).length).toEqual(2);
            });

   it('Numero usuarios',function(){
      let lista=sistema.obtenerUsuarios();
      expect(Object.keys(lista).length).toEqual(0);
      sistema.agregarUsuario({"nick":"Pepe1","email":"pepe1@pepe.es"});
      lista=sistema.obtenerUsuarios();
      expect(Object.keys(lista).length).toEqual(1);
      expect(sistema.numeroUsuarios()).toEqual(1);
   });

   describe("Pruebas de las partidas",function(){
      beforeEach(function(){
         let usr2;
         let usr3;
         beforeEach(function(){
            usr2={"nick":"Pepa","email":"pepa@pepa.es"};
            usr3={"nick":"Pepo","email":"pepo@pepo.es"};
            sistema.agregarUsuario(usr);
            sistema.agregarUsuario(usr2);
            sistema.agregarUsuario(usr3);
         
         });
         it("Usuarios y partidas en el sistema",function(){
            expect(sistema.numeroUsuarios()).toEqual(3);
            expect(sistema.obtenerPartidasDisponibles()).toEqual(0);//interasante por cambiar el numero de partidas mejor, ya aqui puede devolver null
         })

         xit("Crear partida",function(){

         })

         xit("Unir a partida",function(){

         })

         xit("Usuario no puede estar dos veces en la misma partida"),function(){

         }

         xit("Obtener partidas"),function(){

         }
      })
   })
   
   xdescribe("Metodos que acceden a datos",function(){

      let usrTest={"email":"test@test.es" , "password":"test", "nick":"test"};

      beforeEach(function(done){
         sistema.cad.conectar(function(){
            //sistema.registrarUsuario(usrTest,function(res){
               //sistema.confirmarCuenta(usrTest.email,function(){ con esto se puede hacer, registrar y borrar
                  done();
               //})

            //})
            //done();
         })
      })

      
      it("Inicio de sesion correcto",function(done){

         sistema.loginUsuario(usrTest,function(res){
            expect(res.email).toEqual(usrTest.email);
            expect(res.email).not.toEqual(-1);
            done();
         });

      });

      it("Inicio de sesion incorrecto",function(done){
         let usr1={"email":"test@test.es" , "password":"test23", "nick":"test"}
         sistema.loginUsuario(usr1,function(res){
            expect(res.email).toEqual(-1);
            //expect(res.email).toNotEqual(-1);
            done();
         });


      })   //bloques de comprobacion, usuario con contraseña equivoca 

   })

})