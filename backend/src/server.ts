import "dotenv/config";
import { crearApp } from "./app";
import { inicializarBaseDeDatos } from "./db/database";

const PORT = process.env.PORT || 4000;

inicializarBaseDeDatos();

const app = crearApp();

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});