const youtubedl = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");

module.exports = async (videoUrl, outputFilePath) => {
	try {
		// Download the video using youtube-dl-exec
		// await youtubedl(videoUrl, { o: outputFilePath, f: "bestaudio[ext=m4a]" });
		const response = await axios.get(videoUrl, { responseType: "stream" });

		await new Promise((resolve, reject) => {
			const writeStream = fs.createWriteStream(outputFilePath);
			response.data.pipe(writeStream);
			writeStream.on("finish", resolve);
			writeStream.on("error", reject);
		});

		// Convert the downloaded video to MP3 using ffmpeg
		await new Promise((resolve, reject) => {
			ffmpeg()
				.input(outputFilePath)
				.audioCodec("libmp3lame")
				.audioBitrate(320)
				.save("output.mp3")
				.on("end", () => {
					console.log("Conversion finished.");
					// Optionally, delete the original downloaded file
					fs.unlink(outputFilePath, (err) => {
						if (err) {
							console.error("Error deleting file:", err);
						} else {
							console.log("Original file deleted successfully.");
						}
						resolve();
					});
				})
				.on("error", (err) => {
					console.error("Error during conversion:", err);
					reject(err);
				});
		});
	} catch (err) {
		console.error("Error:", err.message);
	}
};
