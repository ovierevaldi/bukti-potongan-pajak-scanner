const notFound = (req, res, next) =>{
    const error = new Error('Hello, the pages you are looking is not found');
    error.status = 404;
    next(error);
}

export default notFound;