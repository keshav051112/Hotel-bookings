//get /api/user

export const getUserData = async(req,res)=>{
    try {
        const role = req.user.role;
        const recentSerachCities = req.user.recentSerachCities
        res.json({success:true,role,recentSerachCities})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//store user recent search cities

export const storeRecentSearchCities = async(req, res)=>{
    try {
        const {recentSerachCities} = req.body;
        const user = req.user;
        if(user.recentSerachCities.length < 3){
            user.recentSerachCities.push(recentSerachCities);
        }else{
            user.recentSerachCities.shift();
            user.recentSerachCities.push(recentSerachCities);
        }
        await user.save();
        res.json({success:true, message:"city added"})
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}