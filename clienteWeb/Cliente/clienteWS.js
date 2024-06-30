function ClienteWS(){
    this.socket;

    this.ini=function(){
        //this.socket=io.connect("http://localhost:3001");
        this.socket=io.connect("https://servidor-6bnn4osd7q-no.a.run.app");
    }
    this.ini();
    this.conectar=function(){
        //this.socket=io.connect("http://localhost:3001");
        this.socket=io.connect("https://servidor-6bnn4osd7q-no.a.run.app");
        this.lanzarServidorWS();
    }
 
        //al lanzar el io connect podemos recuperarlo
        this.lanzarServidorWS = function(){
            let cli=this;
            this.socket.on('connect', function(){                          
                console.log("Usuario conectado al servidor de WebSockets");
            });

            this.socket.on("partidaCreada",function(datos){
                console.log(datos.codigo);
                //ws.codigo=datos.codigo;
                console.log("la partida se ha creado", datos.codigo)
                // cw mostrar esperando rival
                });
            
            this.socket.on("unidoAPartida",function(datos){
                console.log("Te has unido a la partida", datos.codigo);
                cw.actualizarPartidas(lista)
                
            })

            this.socket.on("listaPartidas", function(lista) {
                console.log("Lista de partidas:", lista);
             
                cw.actualizarPartidas(lista)
            });
            
            this.socket.on("error", function(error) {
                console.log("Error:", error.message);
            });


                
        }
        this.crearPartida=function(){
            this.socket.emit("crearPartida",{"email":this.email});
            
        }

        this.partidasDisponibles=function(){
            this.socket.emit("partidasDisponibles");
        }

        this.unirAPartida=function(codigo){
                this.socket.emit("unirAPartida",{"email":this.email,"codigo":codigo});
        }


                
            
}