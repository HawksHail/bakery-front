class Product {
	constructor(
		id,
		productName,
		supplier,
		category,
		unitPrice,
		imgURL,
		imgCredit
	) {
		this.id = id;
		this.productName = productName;
		this.supplier = supplier;
		this.category = category;
		this.unitPrice = unitPrice;
		this.imgURL = imgURL;
		this.imgCredit = imgCredit;
	}
}

export default Product;
