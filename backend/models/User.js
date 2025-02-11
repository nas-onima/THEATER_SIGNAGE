const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    uid: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['staff', 'admin', 'signage'],
        default: 'staff',
    },
}, { timestamps: true });

// // DBに保存するPWをハッシュ化
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 8);
//     }
//     next();
// });

// // ハッシュ化されたPWの検証関数
// userSchema.methods.chkPwd = function (password) {
//     return bcrypt.compare(password, this.password);
// }

module.exports = mongoose.model('User', userSchema);