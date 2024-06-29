function ClienteRest(){

    this.url="http://localhost:3001";

    this.obtenerUsuarios=function(email){
        var cli=this;
        $.getJSON(this.url+"/obtenerUsuarios/",function(data){
        console.log(data)
        })
        //Se dibuja la espera la ruleta de carga por ej
        
        }

    this.numeroUsuarios=function(email){
        var cli=this;
        $.getJSON(this.url+"/numeroUsuarios/",function(data){
        console.log("Número de usuarios que estan en el sistema es:"+data.num)
        })
            //Se dibuja la espera la ruleta de carga por ej
            
        }
    this.usuarioActivo=function(email){
        var cli=this;
        $.getJSON(this.url+"/usuarioActivo/"+email,function(data){
        if(data.activo){
                    console.log("El usuario "+email+" esta activo");
                }else{
                    console.log("El usuario "+email+" no esta activo");
                }
        })
                //Se dibuja la espera la ruleta de carga por ej
                
    }

    this.deleteUsuario=function(email){
        var cli=this;
        $.getJSON(this.url+"/deleteUsuario/"+email,function(data){
        if(data.email!=-1){
                    console.log("El usuario "+email+" ha sido eliminado");
                }else{
                    console.log("El usuario "+email+" no existe y no ha sido eliminado");
                }
        })
                //Se dibuja la espera la ruleta de carga por ej
                
    }

    this.enviarJwt=function(jwt){
        $.ajax({
        type:'POST',
        url:this.url +'/enviarJwt',
        data: JSON.stringify({"jwt":jwt}),
        success:function(data){
        let msg="El email "+data.email+" está ocupado";
        if (data.email!=-1){
        console.log("Usuario "+data.email+" ha sido registrado");
        cw.mostrarModal("Usuario "+data.email+" ha sido registrado")
        msg="Bienvenido al sistema2, "+data.email;
        $.cookie("email",data.email);
        $.cookie("token",data.data);
        ws.email=data.email;
        cw.limpiar();
        cw.mostrarPartidas()
        }
        else{

        console.log("El email ya está ocupado");
        cw.mostrarModal("Usuario "+data.email+" esta ocupado")
        }
        
        },
        error:function(xhr, textStatus, errorThrown){
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
        },
        contentType:'application/json'
        //dataType:'json'
        });
        }

        this.registrarUsuario=function(email,password){
            $.ajax({
                type:'POST',
                url:this.url +'/registrarUsuario',
                data: JSON.stringify({"email":email,"password":password}),
                success:function(data){
                    if (data.email!=-1){				
                        console.log("Usuario "+data.email+" ha sido registrado");
                        // mostrar un mensaje diciendo: consulta tu email
                        $.cookie("email",data.email);
                        

                        //cw.limpiar();
                        //cw.mostrarMensaje("Bienvenido al sistema, "+data.email);
                        
                        cw.mostrarLogin();
                    }
                    else{
                        console.log("El email está ocupado");
                        cw.mostrarModal("El email está ocupado")
                    }
                    },
                    error:function(xhr, textStatus, errorThrown){
                    console.log("Status: " + textStatus); 
                    console.log("Error: " + errorThrown); 
                    },
                contentType:'application/json'
            });
        }

        this.loginUsuario=function(email,password){
            $.ajax({
                type:'POST',
                url:this.url + '/loginUsuario',
                data: JSON.stringify({"email":email,"password":password}),
                success:function(data){
                    if (data.email!=-1){				
                        console.log("Usuario "+data.email+" ha sido registrado");
                        // mostrar un mensaje diciendo: consulta tu email
                        $.cookie("email",data.email);
                        $.cookie("token",data.data);
                        ws.email=data.email;
                        cw.limpiar();
                        cw.iniciarTresEnRaya()
                        
                        
                    }
                    else{
                        console.log("Correo o clave incorrecta");
                        cw.limpiar()
                        cw.mostrarMsg("Correo o clave incorrecta.");
                    }
                    },
                    error:function(xhr, textStatus, errorThrown){
                    console.log("Status: " + textStatus); 
                    console.log("Error: " + errorThrown); 
                    },
                contentType:'application/json'
            });
        }

        this.volverPantallaAnterior=function() {
            window.history.back();
        }

        this.cerrarSesion=function(){
            $.getJSON(this.url+"/cerrarSesion",function(){
                console.log("Sesión cerrada");
                $.removeCookie("email");
            });
        }
            
}

function onSignIn(response) {
    let jwt=response.credential;
    rest.enviarJwt(jwt);
    cw.eliminarBtnGoogle();
    }
    