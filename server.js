const http = require("http");
const WebSocket = require("ws");


// ==========================================
// PORT RENDER
// ==========================================

const PORT = process.env.PORT || 10000;


// ==========================================
// SERVEUR HTTP
// ==========================================

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end(
            "WebSocket Server is running"
        );

        return;
    }

    res.writeHead(404);

    res.end("Not Found");
});


// ==========================================
// SERVEUR WEBSOCKET
// ==========================================

const wss = new WebSocket.Server({
    server: server
});


// ==========================================
// NOUVELLE CONNEXION
// ==========================================

wss.on("connection", (socket) => {

    console.log("🟢 Client WebSocket connecté");


    // Message de confirmation

    socket.send(
        JSON.stringify({
            type: "connected",
            message: "Connexion WebSocket réussie"
        })
    );


    // ==========================================
    // MESSAGE REÇU
    // ==========================================

    socket.on("message", (message) => {

        try {

            const data =
                JSON.parse(message.toString());

            console.log(
                "📩 Message reçu :",
                data
            );


            // ======================================
            // TEST BROADCAST
            // ======================================

            const response = JSON.stringify({
                type: "server_response",
                message: "Message reçu par le serveur",
                data: data
            });


            // Envoyer à tous les clients

            wss.clients.forEach((client) => {

                if (
                    client.readyState ===
                    WebSocket.OPEN
                ) {

                    client.send(response);

                }

            });


        } catch (error) {

            console.error(
                "❌ JSON invalide"
            );

        }

    });


    // ==========================================
    // DÉCONNEXION
    // ==========================================

    socket.on("close", () => {

        console.log(
            "🔴 Client WebSocket déconnecté"
        );

    });


    // ==========================================
    // ERREUR
    // ==========================================

    socket.on("error", (error) => {

        console.error(
            "❌ WebSocket error :",
            error
        );

    });

});


// ==========================================
// DÉMARRAGE
// ==========================================

server.listen(PORT, () => {

    console.log(
        `🚀 Serveur lancé sur le port ${PORT}`
    );

});
