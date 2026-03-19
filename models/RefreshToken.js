const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    expires_at: {
        type: Date,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
)
refreshTokenSchema.index({expires_at:1},{expireAfterSeconds:0})
refreshTokenSchema.index({user_id:1})
const RefreshToken = mongoose.model("RefreshToken",refreshTokenSchema)
module.exports = RefreshToken;

