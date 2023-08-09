class APIFeatures {
    constructor (query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        
        // console.log(keyword);
        this.query = this.query.find({...keyword });
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryStr };

        //removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        
        // console.log(queryCopy);

        //advanced filtre Prix et rang etc
        var queryStr = JSON.stringify(queryCopy);
        const reg = /\b(gt|gte|lt|lte|in)\b/g;
        queryStr = queryStr.replace(reg, (match) => {
            return '$' + match
        })

        // console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(this.query.$regex);
        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;

    }
}
module.exports = APIFeatures;