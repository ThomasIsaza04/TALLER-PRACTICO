import Router from "express";
import passport from "../config/passport.js";
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from "../controllers/tasks.controller.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();


router.get(
  "/test",
  authenticate,
  (req, res) => {
    res.json({
      message: "Ruta protegida con middleware propio",
      userId: req.user.userId,
      email: req.user.email,
    });
  }
);


router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getTasks
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createTask
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateTask
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteTask
);

router.get(
  "/my-tasks",
  authenticate,
  getTasks
);

export default router;
