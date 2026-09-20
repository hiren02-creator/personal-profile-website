const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const frontendDist = path.join(__dirname, "frontend", "dist");

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

app.use(express.static(frontendDist));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
