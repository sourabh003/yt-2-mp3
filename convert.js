const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath("C:/Program Files/ffmpeg/bin/ffmpeg");

module.exports = async (videoUrl, outputFilePath) => {
	try {
		const videoStream = ytdl(videoUrl, { filter: "audioonly" });

		return new Promise((resolve, reject) => {
			ffmpeg()
				.input(videoStream)
				.audioCodec("libmp3lame")
				.audioBitrate(320)
				.save(outputFilePath)
				.on("end", () => {
					resolve();
				})
				.on("error", (error) => {
					reject(error);
				});
		});
	} catch (err) {
		console.error("Error:", err.message);
	}
};
