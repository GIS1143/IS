const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./logs.json";


const PORT = process.env.PORT || 3000;
// ===== โหลด DB =====
function loadDB() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
app.get("/", (req, res) => {
  res.send("🌍 Zero Waste Server is LIVE");
});

function saveDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}


app.post("/log", (req, res) => {
  const { student_id, A = 0, B = 0, C = 0, D = 0, time } = req.body;

  if (!student_id || !time) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
  }

  const db = loadDB();

  if (!db[student_id]) db[student_id] = [];

  db[student_id].push({
    A: Number(A),
    B: Number(B),
    C: Number(C),
    D: Number(D),
    time
  });

  saveDB(db);

  console.log("📥 LOG:", student_id, A, B, C, D, time);

  res.json({ status: "ok" });
});

app.get("/logs", (req, res) => {
  const db = loadDB();
  res.json(db);
});


app.get("/", (req, res) => {
  res.send("🌿 Zero Waste Server is alive");
});


app.listen(PORT, ()=> {
  console.log("Server running on port", PORT);
});