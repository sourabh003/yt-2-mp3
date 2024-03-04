require("dotenv").config();
const express = require("express");
const app = express();
const { decode } = require("url-encode-decode");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

ffmpeg.setFfmpegPath("C:/Users/csour/OneDrive/Documents/ffmpeg/bin/ffmpeg");

app.get("/", (_, res) => res.json({ success: true }));

app.get("/convert", async (req, res) => {
	const { url } = req.query;

	let decodedUrl = decode(url);
	const videoStream = ytdl(decodedUrl, { filter: "audioonly" });

	let filePath = "temp/" + Date.now() + ".mp3";

	ffmpeg()
		.input(videoStream)
		.audioCodec("libmp3lame")
		.audioBitrate(320)
		.save(filePath)
		.on("end", () => {
			const stat = fs.statSync(filePath);
			const readStream = fs.createReadStream(filePath);

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
				fs.unlinkSync(filePath);
			});
		})
		.on("error", (error) => {
			res.status(500).json({
				success: false,
				error,
			});
		});
});

app.listen(process.env.PORT || 5000, () => {
	console.log("Server started on port", process.env.PORT);
});
