import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, deleteCompany } from "../controllers/company.controller.js";
import { singleUpload, handleMulterError } from "../middlewares/mutler.js";

const router = express.Router();

// Register requires authentication (recruiter)
router.route("/register").post(isAuthenticated, registerCompany);

// Get all companies for recruiting staff (authenticated)
router.route("/get").get(isAuthenticated, getCompany);

// Get company by id (public - anyone can view company details)
router.route("/get/:id").get(getCompanyById);

// Update company (authenticated + file upload optional)
router.route("/update/:id").put(isAuthenticated, singleUpload, handleMulterError, updateCompany);

// Delete company (authenticated + owner only)
router.route("/delete/:id").delete(isAuthenticated, deleteCompany);

export default router;

