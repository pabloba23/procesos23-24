function ServidorWS(io) {
    this.lanzarServidor = function(io, sistema) {

        io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado');

            socket.on("crearPartida", (datos) => {
                let codigo = sistema.crearPartida(datos.email);
                
                if (codigo != -1) {
                    socket.join(codigo);  
                }
                
                this.enviarAlRemitente(socket, "partidaCreada", { "codigo": codigo });
                let lista = sistema.obtenerPartidasDisponibles();
                this.enviarGlobal(socket, "listaPartidas", lista);
            });

            socket.on('unirAPartida', (datos) => {
                const { email, codigo } = datos;
                const res = sistema.unirUsuarioPartida(email, codigo);
                if (res) {
                    socket.join(codigo);
                    this.enviarAlRemitente(socket, "unidoAPartida", { "codigo": datos.codigo });
                    let lista = sistema.obtenerPartidasDisponibles();
                    this.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
                } else {
                    socket.emit('error', { message: 'No se pudo unir a la partida' });
                }
            });

            socket.on("partidasDisponibles", () => {
                
                let lista = sistema.obtenerPartidasDisponibles();
                this.enviarAlRemitente(socket, "listaPartidas", lista);
            });

            socket.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    };

    this.enviarAlRemitente = function(socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    };

    this.enviarATodosMenosRemitente = function(socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    };

    this.enviarGlobal = function(io, mens, datos) {
        io.emit(mens, datos);
    };
}

module.exports.ServidorWS = ServidorWS;