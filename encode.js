// https://youtu.be/ouf06bPx_hY?si=V6ojdPDr1LchK2oA

const { encode, decode } = require("url-encode-decode");
const { TEST_URL } = require("./constants");

let encoded = encode(TEST_URL);

console.log({ encoded });

console.log({ decoded: decode(encoded) });
