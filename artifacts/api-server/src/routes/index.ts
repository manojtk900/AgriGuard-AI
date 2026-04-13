import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cropRouter from "./crop";
import diseaseRouter from "./disease";
import financeRouter from "./finance";
import subsidiesRouter from "./subsidies";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cropRouter);
router.use(diseaseRouter);
router.use(financeRouter);
router.use(subsidiesRouter);

export default router;
