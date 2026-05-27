if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser   = require("body-parser");

const itemController     = require("./routes/itemController");
const userController     = require("./routes/userController");
const claimantController = require("./routes/claimantController");
const helperController   = require("./routes/helperController");
const requireAuth        = require("./middleware/requireAuth");
const requireAdmin       = require("./middleware/requireAdmin");
const errorHandler       = require("./middleware/errorHandler");
const {
  validateSignup, validateLogin,
  validateItem, validateClaimant, validateHelper,
} = require("./middleware/validationMiddleware");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, "http://localhost:3000"]
  : ["http://localhost:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ── Auth ───────────────────────────────────────────────────────────────────────
app.post("/signup",     validateSignup, userController.signup);
app.post("/login",      validateLogin,  userController.login);
app.get("/logout",      userController.logout);
app.get("/check-auth",  requireAuth,    userController.checkAuth);
app.get("/fetchuser/:id", requireAuth,  userController.fetchUser);

// ── Admin: users ───────────────────────────────────────────────────────────────
app.get("/admin/users", requireAuth, requireAdmin, userController.fetchAllUsers);

// ── Stats ──────────────────────────────────────────────────────────────────────
app.get("/stats", requireAuth, itemController.getStats);

// ── Items ──────────────────────────────────────────────────────────────────────
app.post("/item/:id",         itemController.createItem);
app.put("/item/status/:id",   requireAuth, requireAdmin, itemController.updateItemStatus);
app.put("/item/:id",          requireAuth, itemController.updateItem);
app.get("/item/user/:id",     itemController.fetchUserSpecificItems);
app.get("/item/",             itemController.fetchItems);
app.get("/item/:id",          itemController.fetchItem);
app.delete("/item/:id",       requireAuth, requireAdmin, itemController.deleteItem);

// ── Claimants ──────────────────────────────────────────────────────────────────
app.post("/claimant",       claimantController.createClaimant);
app.put("/claimant/:id",    requireAuth, requireAdmin, claimantController.updateClaimant);
app.get("/claimant",        requireAuth, claimantController.fetchClaimants);
app.get("/claimant/:id",    requireAuth, claimantController.fetchClaimant);
app.delete("/claimant/:id", requireAuth, requireAdmin, claimantController.deleteClaimant);

// ── Helpers ────────────────────────────────────────────────────────────────────
app.post("/helper",       helperController.createHelper);
app.put("/helper/:id",    requireAuth, requireAdmin, helperController.updateHelper);
app.get("/helper",        requireAuth, helperController.fetchHelpers);
app.get("/helper/:id",    requireAuth, helperController.fetchHelper);
app.delete("/helper/:id", requireAuth, requireAdmin, helperController.deleteHelper);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
