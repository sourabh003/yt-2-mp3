const youtubedl = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");

module.exports = async (videoUrl, outputFilePath) => {
	try {
		// Download the video using youtube-dl-exec
		await youtubedl(videoUrl, { o: outputFilePath, f: "bestaudio[ext=m4a]" });

		// Convert the downloaded video to MP3 using ffmpeg
		await new Promise((resolve, reject) => {
			ffmpeg()
				.input(outputFilePath)
				.audioCodec("libmp3lame")
				.audioBitrate(320)
				.save(outputFilePath)
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
