function ControlWeb() {

    this.mostrarObtenerUsuarios = function () {
        let cadena = '<div class="form-row" id="mOU">';
        cadena = cadena + '<button id="btnOU" type="submit" class="btn btn-primary">Obtener Usuarios</button>';
        cadena = cadena + '</div>';

        $("#ou").append(cadena); //ou = obtener usuarios

        $("#btnOU").on("click", function () {
            rest.obtenerUsuarios()
            $("#mOU").remove();
        });
    }

    this.mostrarNumeroUsuarios = function () {
        let cadena = '<div class="form-row" id="mNU">';
        cadena = cadena + '<button id="btnNU" type="submit" class="btn btn-primary">Numero Usuarios</button>';
        cadena = cadena + '</div>';

        $("#nu").append(cadena); //ou = obtener usuarios

        $("#btnNU").on("click", function () {
            rest.numeroUsuarios()
            $("#mNU").remove();
        });
    }

    this.mostrarUsuarioActivo = function () {
        let cadena = '<div class="form-row" id="mUA">';
        cadena = cadena + '<label for="email">Introduce el email para saber si está activo o no:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="email">';
        cadena = cadena + '<button id="btnUA" type="submit" class="btn btn-primary">¿Esta Activo?</button>';
        cadena = cadena + '</div>';

        $("#ua").append(cadena); //ua = usuario activo

        $("#btnUA").on("click", function () {
            let email = $("#email").val();
            rest.usuarioActivo(email)
            $("#mUA").remove();
        });
    }

    this.mostrarEliminarUsuario = function () {
        let cadena = '<div class="form-row" id="mEU">';
        cadena = cadena + '<label for="email">Introduce el email a eliminar:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="email">';
        cadena = cadena + '<button id="btnEU" type="submit" class="btn btn-primary">Eliminar</button>';
        cadena = cadena + '</div>';

        $("#eu").append(cadena); //eu = eliminar usuario

        $("#btnEU").on("click", function () {
            let email = $("#email").val();
            rest.deleteUsuario(email)
            $("#mEU").remove();
        });
    }
    this.mostrarMsg = function (msg) {
        cw.limpiar()
        $('#mMsg').remove()
        let cadena = '<h2 id="mMsg">' + msg + '</h2>';
        $('#msg').append(cadena);
     
            this.salir()
        
        

    }
    this.comprobarSesion=function(){
        //let email=localStorage.getItem("email");
        
        let email=$.cookie("email");
        if (email){
        //cw.mostrarMsg("Bienvenido al sistema, "+email);
        }
        else{
        cw.mostrarRegistro();
        //cw.init();
        }
    }


    this.salir = function() {
        // Boton de LogOut
        let cadena = '<div class="form-group" id="mExit">';
        
        cadena = cadena + '<button id="btnExit" type="button" class="btn btn-primary">Cerrar Sesion</button>';
        cadena = cadena + '</div';

        $("#Exit").append(cadena);

        $("#btnExit").on("click", function () {
             // Mostrar un mensaje de confirmación al usuario
            if (confirm("¿Estás seguro de que deseas salir?")) {
                // Si el usuario confirma, eliminar "email" del localStorage y recargar la página
                $.removeCookie("email");
                location.reload();
                rest.cerrarSesion();

            }
        });

    }

    this.volver = function() {
        // Boton de LogOut
        let cadena = '<div class="form-group" id="mExit">';
        
        cadena = cadena + '<button id="btnExit" type="button" class="btn btn-primary">Vuelta atrás</button>';
        cadena = cadena + '</div';

        $("#Exit").append(cadena);

        $("#btnExit").on("click", function () {
             // Mostrar un mensaje de confirmación al usuario
             
            if (confirm("¿Estás seguro de que quieres volver a la pantalla anterior?")) {
                // Si el usuario confirma, eliminar "email" del localStorage y recargar la página
                
                rest.volverPantallaAnterior()

            }
        });

    }

    this.init=function(){
        let cw=this;
        google.accounts.id.initialize({
        client_id:"440901487-mcubd2k2don88i6bl8f72kujb4fjlcfc.apps.googleusercontent.com", 
        //client_id:"440901487-c28nkgmcdl1sbbht79ucq3b4v6mf6rlg.apps.googleusercontent.com", //prod
        auto_select:false,
        callback:cw.handleCredentialsResponse
        });
        google.accounts.id.prompt();
    }  

    this.handleCredentialsResponse=function(response){
        let jwt=response.credential;
        //let user=JSON.parse(atob(jwt.split(".")[1]));
        //console.log(user.name);
        //console.log(user.email);
        //console.log(user.picture);
        rest.enviarJwt(jwt);
        }

    this.limpiar=function(){
       
        $("#mAU").remove();
        $("#fmRegistro").remove();
        $("#fmLogIn").remove();
       


    }
       
    this.mostrarRegistro=function(){
        if ($.cookie('email')){
            return true;
        };
        cw.limpiar();
        $("fmRegistro").remove();
        //en el div de index cargamos el html
        $("#registro").load("./Cliente/registro.html",function(){
            $("#btnRegistro").on("click",function(event){
                event.preventDefault();
                let email=$("#email").val();// recoger el valor del input text
                let pwd=$("#pwd").val();// recoger el valor del input text
                if (email && pwd){
                 
                    rest.registrarUsuario(email,pwd)// llamar al servidor usando rest
                    console.log(email+" "+pwd); 
                    
                }
            });
        });
    }

        this.mostrarLogin=function(){
            if ($.cookie('email')){
                return true;
            };
            cw.limpiar()
            $("#fmLogIn").remove();
            $("#registro").load("./Cliente/login.html",function(){
                $("#btnLogin").on("click",function(event){
                    event.preventDefault();
                    let email=$("#email").val();
               
                    let pwd=$("#pwd").val();
                    if (email && pwd){
                        rest.loginUsuario(email,pwd);
                        console.log(email+" "+pwd);
                        
                    }
                });
            });
        }

        this.mostrarFormulario = function(formularioId) {
           
            if (formularioId === 'fmRegistro') {
                // Muestra el formulario de registro
                this.mostrarRegistro()
            } else if (formularioId === 'fmLogIn') {
                // Muestra el formulario de inicio de sesión
                this.mostrarLogin()
                
                 // Para que permita loguearse con google
                //this.mostrarGoogle() 
            } else {
                // Mostrar un mensaje de error si el formulario no es válido

                console.log('Formulario no válido');
            }
        }

        this.mostrarModal = function(msg){//muestra que esta ocupado
            $("#msgModal").remove();
            let cadena="<div id='msgModal'>"+msg+"</div>";
            $('#bModal').append(cadena);
            $('#miModal').modal();
        }

        this.eliminarBtnGoogle=function(){
            $("#g_id_signin").remove();
            }
        
        this.mostrarPartidas = function(){
            cw.limpiar();
            this.salir();
            $("#oPartidas").load("./Cliente/partidas.html", function(response, status, xhr) {
                if (status == "error") {
                    console.log("Error loading file: " + xhr.status + " " + xhr.statusText);
                } else {
                    console.log("File loaded successfully");
                    $("#crearPartidaBtn").on("click",function(event){
                        event.preventDefault();
                        ws.crearPartida();
                        
                    });
                    ws.partidasDisponibles();
             } })
           
            
        };
        this.actualizarPartidas = function(partidas) {
            const tabla = document.getElementById('tablaPartidas');
            if (tabla) {
                const tbody = tabla.getElementsByTagName('tbody')[0];
                if (tbody) {
                    tbody.innerHTML = ''; // Limpiamos la tabla antes de actualizarla
            
                    partidas.forEach(partida => {
                        const nuevaFila = document.createElement('tr');
            
                        const celdaCodigo = document.createElement('td');
                        celdaCodigo.textContent = partida.codigo;
                        celdaCodigo.style.padding = '12px';
                        celdaCodigo.style.border = '1px solid #ddd';
            
                        const celdaCreador = document.createElement('td');
                        celdaCreador.textContent = partida.jugadores; // Supongo que 'partida.jugadores' es el creador
                        celdaCreador.style.padding = '12px';
                        celdaCreador.style.border = '1px solid #ddd';
            
                        const celdaUnirse = document.createElement('td');
                        const botonUnirse = document.createElement('button');
                        botonUnirse.textContent = 'Unirse';
                        botonUnirse.style.padding = '5px 10px';
                        botonUnirse.style.backgroundColor = '#0d47a1';
                        botonUnirse.style.color = '#fff';
                        botonUnirse.style.border = 'none';
                        botonUnirse.style.borderRadius = '5px';
                        botonUnirse.style.cursor = 'pointer';
                        botonUnirse.addEventListener('click', function() {
                            //if email es el mio no se une
                            alert('Te has unido a la partida ' + partida.codigo);
                            ws.unirAPartida(partida.codigo);
                            
                        });
            
                        celdaUnirse.appendChild(botonUnirse);
                        celdaUnirse.style.padding = '12px';
                        celdaUnirse.style.border = '1px solid #ddd';
            
                        nuevaFila.appendChild(celdaCodigo);
                        nuevaFila.appendChild(celdaCreador);
                        nuevaFila.appendChild(celdaUnirse);
            
                        tbody.appendChild(nuevaFila);
                    });
                } else {
                    console.error("Element 'tbody' not found in 'tablaaPartidas'");
                }
            } else {
                console.error("Element with id 'tablaaPartidas' not found");
            }
        };


        this.iniciarTresEnRaya = function () {
            this.tablero = ["", "", "", "", "", "", "", "", ""];
            this.turno = "X";
            this.jugando = true;
    
            this.mostrarTablero();
            this.configurarEventos();
        };
    
        this.mostrarTablero = function () {
            let boardHtml = '';
            for (let i = 0; i < 9; i++) {
                boardHtml += `<div class="cell" data-index="${i}"></div>`;
            }
            document.getElementById('board').innerHTML = boardHtml;
        };
    
        this.configurarEventos = function () {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.addEventListener('click', (e) => this.hacerMovimiento(e));
            });
    
            document.getElementById('new-game').addEventListener('click', () => this.iniciarTresEnRaya());
        };
    
        this.hacerMovimiento = function (e) {
            const index = e.target.getAttribute('data-index');
            if (this.tablero[index] === "" && this.jugando) {
                this.tablero[index] = this.turno;
                e.target.innerHTML = this.turno;
    
                if (this.verificarGanador()) {
                    this.jugando = false;
                    setTimeout(() => {
                        alert(`¡${this.turno} ha ganado!`);
                    }, 100); // Añade un breve retraso antes de mostrar la alerta
                } else if (this.tablero.every(cell => cell !== "")) {
                    this.jugando = false;
                    setTimeout(() => {
                        alert("¡Es un empate!");
                    }, 100); // Añade un breve retraso antes de mostrar la alerta
                } else {
                    this.turno = this.turno === "X" ? "O" : "X";
                }
            }
        };
    
        this.verificarGanador = function () {
            const combinacionesGanadoras = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
    
            return combinacionesGanadoras.some(combinacion => {
                const [a, b, c] = combinacion;
                return this.tablero[a] && this.tablero[a] === this.tablero[b] && this.tablero[a] === this.tablero[c];
            });
        };
        

    }
    

