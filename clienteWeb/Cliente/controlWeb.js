function ControlWeb() {
    let cw = this;
    
    this.mostrarObtenerUsuarios = function () {
        let cadena = '<div class="form-row" id="mOU">';
        cadena = cadena + '<button id="btnOU" type="submit" class="btn btn-primary">Obtener Usuarios</button>';
        cadena = cadena + '</div>';

        $("#ou").append(cadena); // ou = obtener usuarios

        $("#btnOU").on("click", function () {
            rest.obtenerUsuarios();
            $("#mOU").remove();
        });
    };

    this.mostrarNumeroUsuarios = function () {
        let cadena = '<div class="form-row" id="mNU">';
        cadena = cadena + '<button id="btnNU" type="submit" class="btn btn-primary">Numero Usuarios</button>';
        cadena = cadena + '</div>';

        $("#nu").append(cadena); // nu = numero usuarios

        $("#btnNU").on("click", function () {
            rest.numeroUsuarios();
            $("#mNU").remove();
        });
    };

    this.mostrarUsuarioActivo = function () {
        let cadena = '<div class="form-row" id="mUA">';
        cadena = cadena + '<label for="email">Introduce el email para saber si está activo o no:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="email">';
        cadena = cadena + '<button id="btnUA" type="submit" class="btn btn-primary">¿Esta Activo?</button>';
        cadena = cadena + '</div>';

        $("#ua").append(cadena); // ua = usuario activo

        $("#btnUA").on("click", function () {
            let email = $("#email").val();
            rest.usuarioActivo(email);
            $("#mUA").remove();
        });
    };

    this.mostrarEliminarUsuario = function () {
        let cadena = '<div class="form-row" id="mEU">';
        cadena = cadena + '<label for="email">Introduce el email a eliminar:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="email">';
        cadena = cadena + '<button id="btnEU" type="submit" class="btn btn-primary">Eliminar</button>';
        cadena = cadena + '</div>';

        $("#eu").append(cadena); // eu = eliminar usuario

        $("#btnEU").on("click", function () {
            let email = $("#email").val();
            rest.deleteUsuario(email);
            $("#mEU").remove();
        });
    };

    this.mostrarMsg = function (msg) {
        cw.limpiar();
        $('#mMsg').remove();
        let cadena = '<h2 id="mMsg">' + msg + '</h2>';
        $('#msg').append(cadena);
        this.salir();
    };

    this.comprobarSesion = function() {
        let email = $.cookie("email");
        if (email) {
            // cw.mostrarMsg("Bienvenido al sistema, "+email);
        } else {
            cw.mostrarRegistro();
            // cw.init();
        }
    };

    this.salir = function() {
        let cadena = '<div class="form-group" id="mExit">';
        cadena = cadena + '<button id="btnExit" type="button" class="btn btn-primary">Cerrar Sesion</button>';
        cadena = cadena + '</div>';

        $("#Exit").append(cadena);

        $("#btnExit").on("click", function () {
            if (confirm("¿Estás seguro de que deseas salir?")) {
                $.removeCookie("email");
                location.reload();
                rest.cerrarSesion();
            }
        });
    };

    this.volver = function() {
        let cadena = '<div class="form-group" id="mExit">';
        cadena = cadena + '<button id="btnExit" type="button" class="btn btn-primary">Vuelta atrás</button>';
        cadena = cadena + '</div>';

        $("#Exit").append(cadena);

        $("#btnExit").on("click", function () {
            if (confirm("¿Estás seguro de que quieres volver a la pantalla anterior?")) {
                rest.volverPantallaAnterior();
            }
        });
    };

    this.init = function() {
        google.accounts.id.initialize({
            //client_id: "440901487-mcubd2k2don88i6bl8f72kujb4fjlcfc.apps.googleusercontent.com",
           client_id: "440901487-kg4t1t6mr91smv2bbb5v725g6q037ebs.apps.googleusercontent.com",
            auto_select: false,
            callback: cw.handleCredentialsResponse
        });
        google.accounts.id.prompt();
 

    };

    this.handleCredentialsResponse = function(response) {
        let jwt = response.credential;
        rest.enviarJwt(jwt);
    };

    this.limpiar = function() {
        $("#mAU").remove();
        $("#fmRegistro").remove();
        $("#fmLogIn").remove();
        //$("#tresEnRaya").remove();
    };

    this.mostrarRegistro = function() {
        if ($.cookie('email')) {
            return true;
        }
        cw.limpiar();
        $("fmRegistro").remove();
        $("#registro").load("./Cliente/registro.html", function() {
            $("#btnRegistro").on("click", function(event) {
                event.preventDefault();
                let email = $("#email").val();
                let pwd = $("#pwd").val();
                if (email && pwd) {
                    rest.registrarUsuario(email, pwd);
                    console.log(email + " " + pwd);
                }
            });
        });
    };

    this.mostrarLogin = function() {
        if ($.cookie('email')) {
            return true;
        }
        cw.limpiar();
        $("#fmLogIn").remove();
        $("#registro").load("./Cliente/login.html", function() {
            $("#loginForm").on("submit", function(event) {
                event.preventDefault();
                let email = $("#emailLogin").val();
                let pwd = $("#pwdLogin").val();
                if (email && pwd) {
                    rest.loginUsuario(email, pwd);
                    console.log(email + " " + pwd);
                }
            });
        });
    };

    this.mostrarFormulario = function(formularioId) {
        if (formularioId === 'fmRegistro') {
            this.mostrarRegistro();
        } else if (formularioId === 'fmLogIn') {
            this.mostrarLogin();
        } else {
            console.log('Formulario no válido');
        }
    };

    this.mostrarModal = function(msg) {
        $("#msgModal").remove();
        let cadena = "<div id='msgModal'>" + msg + "</div>";
        $('#bModal').append(cadena);
        $('#miModal').modal();
    };

    this.eliminarBtnGoogle = function() {
        $("#g_id_signin").remove();
    };

    this.mostrarPartidas = function() {
        cw.limpiar();
        this.salir();
        $("#oPartidas").load("./Cliente/partidas.html", (response, status, xhr) => {
            if (status == "error") {
                console.log("Error loading file: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("File loaded successfully");
                $("#crearPartidaBtn").on("click", function(event) {
                    event.preventDefault();
                    console.log("Crear Partida button clicked");
                    ws.crearPartida();
                });

                $("#LocalBtn").on("click", function(event) {
                    event.preventDefault();
                    $("#oPartidas").remove();
                    cw.iniciarTresEnRaya();
                });
               
                ws.partidasDisponibles();
            }
        });
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
                    celdaCreador.textContent = partida.jugadores; 
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
                console.error("Element 'tbody' not found in 'tablaPartidas'");
            }
        } else {
            console.error("Element with id 'tablaPartidas' not found");
        }
    };
    this.iniciarTresEnRaya = function() {
        const contenedor = document.getElementById('tresEnRaya');
        $(contenedor).load('./Cliente/tresEnRaya.html', function() {
            contenedor.style.display = 'block';

            const cells = document.querySelectorAll('.cell');
            let currentPlayer = 'X';
            let gameActive = true;
            const winningConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            cells.forEach(cell => {
                cell.addEventListener('click', function() {
                    if (cell.textContent === '' && gameActive) {
                        cell.textContent = currentPlayer;
                        cell.classList.add(currentPlayer);
                        if (checkWin()) {
                            setTimeout(() => alert(currentPlayer + ' ha ganado!'), 10);
                            gameActive = false;
                        } else if (checkDraw()) {
                            setTimeout(() => alert('Es un empate!'), 10);
                            gameActive = false;
                        } else {
                            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                        }
                    }
                });
            });

            document.getElementById('resetBtn').addEventListener('click', function() {
                resetGame();
            });

            function checkWin() {
                return winningConditions.some(condition => {
                    return condition.every(index => {
                        return cells[index].textContent === currentPlayer;
                    });
                });
            }

            function checkDraw() {
                return Array.from(cells).every(cell => {
                    return cell.textContent !== '';
                });
            }

            function resetGame() {
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('X', 'O');
                });
                currentPlayer = 'X';
                gameActive = true;
            }
        });
    };


}