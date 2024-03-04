require("dotenv").config();
const express = require("express");
const app = express();
const { decode } = require("url-encode-decode");
const fs = require("fs");
const convert = require("./convert");
const path = require("path");

app.get("/", (_, res) => res.json({ success: true }));

app.get("/convert", async (req, res) => {
	const { url } = req.query;

	let outputFilePath = path.join(process.cwd(), `tmp/${Date.now()}.mp3`);
	let decodedUrl = decode(url);

	await convert(decodedUrl, outputFilePath);

	const stat = fs.statSync(outputFilePath);
	const readStream = fs.createReadStream(outputFilePath);

	readStream.on("open", () => {
		res.writeHead(200, {
			"Content-Type": "audio/mpeg",
			"Content-Length": stat.size,
		});
	});

	readStream.on("data", (chunk) => {
		res.write(chunk);
	});

	readStream.on("end", () => {
		res.end();
		fs.unlinkSync(outputFilePath);
	});
});

app.listen(process.env.PORT || 5000, () => {
	console.log("Server started on port", process.env.PORT);
});
