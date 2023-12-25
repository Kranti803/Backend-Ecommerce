import jwt from 'jsonwebtoken';

export const sendToken = (res, statusCode, newUser,message) => {

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY,{
        expiresIn:'30d'
    });

    return res.status(statusCode).cookie('token', token, {
        expires:new Date(Date.now()+30*24*60*60*1000),
        httpOnly:true,
        secure:true,
        sameSite:'none',
    }).json({
        success: true,
        message:message,
        newUser
    })

};