class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let queryObj = { ...this.queryString };
    let excludeAbleFields = ["createdAt"];
    excludeAbleFields.forEach((el) => {
      delete queryObj[el];
    });
    // Advance filtering>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.split(",").join(" ");
      // console.log(`SORTBY IS NOW : ${sortBy}`);
      this.query = this.query.sort(sortBy);
      // console.log(`lastttttt ${query}`);
    } else {
      this.tour = this.tour.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    if (this.queryString.page) {
      const limit = this.queryString.limit * 1 || 10;
      const page = this.queryString.page * 1 || 1;
      const skip = (page - 1) * limit;
      // const numTours = await Tour.countDocuments();
      // if (skip >= numTours) {
      //   throw new Error("This page does not exist");
      // } else {
      this.query = this.query.skip(skip).limit(limit);
      // }
    }
    return this;
  }
}
module.exports = ApiFeatures;
