// middleware/raw.js  — preserve raw body for signature verification
import bodyParser from "body-parser";
export const jsonWithRaw = bodyParser.json({
  verify: (req, _res, buf) => { req.rawBody = buf.toString("utf8"); }
});
