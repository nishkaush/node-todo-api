const SHA256 = require("crypto-js").SHA256;
const jwt = require("jsonwebtoken");

var data = {
    id: 10
};

var token = jwt.sign(data, "our secret/salting");
console.log(token);

var decoded = jwt.verify(token, "our secret/salting");


console.log("decoded string is : ", decoded);





// var message = "I m user number 56";
//
// var hash = SHA256(message).toString();
//
// // console.log(hash);
//
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + "secretvalue/ Salting").toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(token.data.id).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + "secretvalue/ Salting").toString();
//
//
// if (resultHash === token.hash) {
//     console.log("All good! Data was not changed!")
// } else {
//     console.log("BEWARE!!! Data got changed!!")
// }
