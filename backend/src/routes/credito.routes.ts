import { Router } from "express";
import { creditoController } from "../controllers/credito.controller";

const router = Router();

router.post("/", creditoController.crear);
router.get("/", creditoController.listar);
router.get("/:id", creditoController.obtenerPorId);
router.put("/:id", creditoController.actualizar);
router.delete("/:id", creditoController.eliminar);

export default router;