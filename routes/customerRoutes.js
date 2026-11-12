const express = require("express");
const router = express.Router();

const Customer = require("../models/Customer");

router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: customers.length,
            customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
            error: error.message
        });
    }
});

module.exports = router;