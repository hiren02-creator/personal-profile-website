const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
const frontendDist = path.join(__dirname, "frontend", "dist");

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

app.get("/api/profile", (req, res) => {
    res.json({
        name: "Hiren Visodiya",
        role: "AI Developer",
        interest: "Investment",
        website: "Personal Profile Website",
    });
});

app.get("/api/skills", (req, res) => {
    res.json({
        aiDeveloper: [
            "Python",
            "Node.js",
            "Express.js",
            "REST APIs",
            "Supabase",
            "PostgreSQL",
            "Git",
            "GitHub",
            "AI APIs",
        ],
        investment: [
            "Mutual Funds",
            "Asset Allocation",
            "Budget Planning",
            "Stock Market Research",
            "Risk Management",
        ],
    });
});

app.get("/api/projects", (req, res) => {
    res.json([
        {
            title: "AI Investment Analyzer",
            category: "AI + Investment",
            description:
                "An AI-powered project for analyzing company and investment information.",
        },
        {
            title: "Personal Profile Website",
            category: "Web Development",
            description:
                "A professional website showcasing my AI Developer and Investment skills.",
        },
        {
            title: "Stock Portfolio Tracker",
            category: "Investment",
            description:
                "A project for tracking investments and portfolio information.",
        },
    ]);
});

app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body || {};

    const hasValidFields =
        typeof name === "string" &&
        typeof email === "string" &&
        typeof message === "string" &&
        name.trim() !== "" &&
        email.trim() !== "" &&
        message.trim() !== "";

    if (!hasValidFields) {
        return res.status(400).json({
            success: false,
            message: "Name, email, and message are required.",
        });
    }

    res.json({
        success: true,
        message: "Contact message received successfully.",
        received: {
            name,
            email,
            message,
        },
    });
});

app.use(express.static(frontendDist));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
