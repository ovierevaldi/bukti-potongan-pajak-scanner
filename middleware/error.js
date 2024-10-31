const error = (err, req, res, next) =>{
    if(!err.status){
        res.status(500).json({msg: err.message})
    }
    else{
        res.status(err.status).json({msg: err.message})
    }
}

export default error;