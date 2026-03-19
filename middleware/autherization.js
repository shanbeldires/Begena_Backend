const autherizationRoles =(...roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            const error = new Error("user not found");
            error.statusCode = 404;
            throw error;

        }
        if(!roles.includes(req.user.role)){
            const error = new Error("you are not authorized");
            error.statusCode = 403;
            throw error;
        }
        else{
            next();
        }
    }
}
module.exports = autherizationRoles;