// ==========================================
// SERVEUR WEBSOCKET — RÉSEAU SOCIAL
// ==========================================

const http = require("http");
const WebSocket = require("ws");


// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 10000;


// ==========================================
// SERVEUR HTTP
// ==========================================

const server = http.createServer((req, res) => {

    // Route principale
    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end(
            "Social WebSocket Server is running"
        );

        return;
    }


    // Autres routes
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Not Found");

});


// ==========================================
// SERVEUR WEBSOCKET
// ==========================================

const wss = new WebSocket.Server({
    server: server
});


// ==========================================
// NOMBRE DE CLIENTS CONNECTÉS
// ==========================================

function getConnectedClients() {

    let count = 0;

    wss.clients.forEach((client) => {

        if (
            client.readyState ===
            WebSocket.OPEN
        ) {

            count++;

        }

    });

    return count;
}


// ==========================================
// BROADCAST
// Envoie un événement à tous les clients
// ==========================================

function broadcast(data) {

    const message =
        JSON.stringify(data);

    wss.clients.forEach((client) => {

        if (
            client.readyState ===
            WebSocket.OPEN
        ) {

            client.send(message);

        }

    });

}


// ==========================================
// NOUVELLE CONNEXION
// ==========================================

wss.on("connection", (socket) => {

    console.log(
        "🟢 Client connecté"
    );

    console.log(
        "👥 Clients connectés :",
        getConnectedClients()
    );


    // ==========================================
    // MESSAGE DE BIENVENUE
    // ==========================================

    socket.send(
        JSON.stringify({

            type: "connected",

            message:
                "Connexion WebSocket réussie",

            clients:
                getConnectedClients()

        })
    );


    // ==========================================
    // MESSAGE REÇU
    // ==========================================

    socket.on("message", (message) => {

        try {

            const data =
                JSON.parse(
                    message.toString()
                );


            console.log(
                "📩 Événement reçu :",
                data.type
            );


            // ======================================
            // TEST
            // ======================================

            if (data.type === "test") {

                broadcast({

                    type: "server_response",

                    message:
                        "Message reçu par le serveur",

                    data: data

                });

            }


            // ======================================
            // NOUVELLE PUBLICATION
            // ======================================

            else if (
                data.type ===
                "new_publication"
            ) {

                broadcast({

                    type:
                        "new_publication",

                    post:
                        data.post

                });

            }


            // ======================================
            // PUBLICATION MODIFIÉE
            // ======================================

            else if (
                data.type ===
                "publication_updated"
            ) {

                broadcast({

                    type:
                        "publication_updated",

                    post:
                        data.post

                });

            }


            // ======================================
            // PUBLICATION SUPPRIMÉE
            // ======================================

            else if (
                data.type ===
                "publication_deleted"
            ) {

                broadcast({

                    type:
                        "publication_deleted",

                    publication_id:
                        data.publication_id

                });

            }


            // ======================================
            // NOUVEAU LIKE
            // ======================================

            else if (
                data.type ===
                "new_like"
            ) {

                broadcast({

                    type:
                        "new_like",

                    publication_id:
                        data.publication_id,

                    user_id:
                        data.user_id

                });

            }


            // ======================================
            // LIKE SUPPRIMÉ
            // ======================================

            else if (
                data.type ===
                "like_removed"
            ) {

                broadcast({

                    type:
                        "like_removed",

                    publication_id:
                        data.publication_id,

                    user_id:
                        data.user_id

                });

            }


            // ======================================
            // NOUVEAU COMMENTAIRE
            // ======================================

            else if (
                data.type ===
                "new_comment"
            ) {

                broadcast({

                    type:
                        "new_comment",

                    comment:
                        data.comment

                });

            }


            // ======================================
            // COMMENTAIRE SUPPRIMÉ
            // ======================================

            else if (
                data.type ===
                "comment_deleted"
            ) {

                broadcast({

                    type:
                        "comment_deleted",

                    comment_id:
                        data.comment_id,

                    publication_id:
                        data.publication_id

                });

            }


            // ======================================
            // NOUVELLE SAUVEGARDE
            // ======================================

            else if (
                data.type ===
                "new_save"
            ) {

                broadcast({

                    type:
                        "new_save",

                    publication_id:
                        data.publication_id,

                    user_id:
                        data.user_id

                });

            }


            // ======================================
            // NOUVEAU PARTAGE
            // ======================================

            else if (
                data.type ===
                "new_share"
            ) {

                broadcast({

                    type:
                        "new_share",

                    publication_id:
                        data.publication_id,

                    user_id:
                        data.user_id

                });

            }


            // ======================================
            // NOTIFICATION
            // ======================================

            else if (
                data.type ===
                "new_notification"
            ) {

                broadcast({

                    type:
                        "new_notification",

                    notification:
                        data.notification

                });

            }


            // ======================================
            // NOUVEAU MESSAGE
            // ======================================

            else if (
                data.type ===
                "new_message"
            ) {

                broadcast({

                    type:
                        "new_message",

                    message:
                        data.message

                });

            }


            // ======================================
            // ÉVÉNEMENT INCONNU
            // ======================================

            else {

                console.log(
                    "⚠️ Type inconnu :",
                    data.type
                );

            }


        } catch (error) {

            console.error(
                "❌ Erreur JSON :",
                error.message
            );

        }

    });


    // ==========================================
    // DÉCONNEXION
    // ==========================================

    socket.on("close", () => {

        console.log(
            "🔴 Client déconnecté"
        );

        console.log(
            "👥 Clients connectés :",
            getConnectedClients()
        );

    });


    // ==========================================
    // ERREUR
    // ==========================================

    socket.on("error", (error) => {

        console.error(
            "❌ WebSocket error :",
            error.message
        );

    });

});


// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

server.listen(PORT, () => {

    console.log(
        `🚀 Serveur lancé sur le port ${PORT}`
    );

});
