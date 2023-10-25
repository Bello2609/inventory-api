// const multer = require("multer");
const formidable = require('formidable');
const Product = require("../../model/Product");
const statusCodes = require("../../constant/status");
const path = require("path");
const fs = require("fs");


module.exports.createProduct =  (req, res )=>{
    const form = new formidable.IncomingForm();
    
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(statusCodes.BAD_REQUEST).json({
                data:{
                    message: err.message
                }
            })
        }
        

        // the fields gotten from formidable is in an array the code below map it to an object
        let productField = {};
        let toString = Object.keys(fields);
        toString.map(prod=>{
            return productField[prod] = fields[prod][0]
        });
        const productDetails = {
            name: productField.name,
            price: productField.price,
            category: productField.category,
            sku: productField.sku,
            productImage: files.productImage[0].filepath
    }
    const uploadFolder = path.join(__dirname, "Uploads", files.productImage[0].originalFilename);
    //upload the files to disk
        fs.rename(files.productImage[0].filepath, uploadFolder, err=>{
            return res.status(statusCodes.BAD_REQUEST).json({
                data: {
                    message: err.message
                }
            })
        })
    const products = new Product(productDetails);
    return products.save().then(prod=>{
        console.log(prod);
        res.status(statusCodes.CREATED).json({
            message: "Product has been added successfully",
            data: {
                _id: prod._id,
                name: prod.name,
                price: prod.price,
                category: prod.category,
                productImg: prod.productImage
            }
        })
    }).catch(err=>{
        return res.status(statusCodes.SERVER_ERROR).json({
            data:{
                message: err.message
            }
        })
    })
     

    })
}
module.exports.getProduct = ((req, res, next)=>{
    Product.find({}).select("name price _id productImage").exec()
    .then(prod=>{
        const data = {
            products: prod.map(doc=>{
                return {
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    category: doc.category,
                    productImage: doc.productImage
                }
            })
        }
        res.status(statusCodes.OK).json(data);
    }).catch(err=>{
        res.status(statusCodes.SERVER_ERROR).json({
            message: err
        })
    });
});
module.exports.getEachProduct = (req, res, next)=>{
    const { sku } = req.body;
    const { productId } = req.params;
    Product.findById({ _id: productId, sku: sku }).exec().then(prod=>{
        const product = prod.map(allProd=>{
            return allProd;
        })
        return res.status(statusCodes.OK).json({
            data: product
        })
    }).catch(err=>{
        return res.status(statusCodes.SERVER_ERROR).json({
                data: {
                    message: err.message
                }
        })
    })
}

module.exports.deleteProduct = ((req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id}).exec().then(prod=>{
        res.status(statusCodes.OK).json({
            data:{
                message: "Product Deleted"
            },
        });
    }).catch(err=>{
        res.status(statusCodes.SERVER_ERROR).json({
            message: err
        })
    })
    res.status(200).json({
        message: "product deleted"
    })
})
module.exports.editProduct=(req, res, next)=>{
    const { productId } = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(statusCodes.BAD_REQUEST).json({
                data:{
                    message: err.message
                }
            })
        }
        // the fields gotten from formidable is in an array the code below map it to an object
        let productField = {};
        let toString = Object.keys(fields);
        toString.map(prod=>{
            return productField[prod] = fields[prod][0]
        });
        const productDetails = {
            name: productField.name,
            price: productField.price,
            category: productField.category,
            sku: productField.sku,
            productImage: files.productImage[0].filepath
    }
    const uploadFolder = path.join(__dirname, "Uploads", files.productImage[0].originalFilename);
    //upload the files to disk
        fs.rename(files.productImage[0].filepath, uploadFolder, err=>{
            return res.status(statusCodes.BAD_REQUEST).json({
                data: {
                    message: err.message
                }
            })
        })
    Product.findById({ _id: productId }).exec().then(products=>{
        products.name = productDetails.name;
        products.price = productDetails.price;
        products.category = productDetails.category;
        products.productImage = productDetails.productImage;
        return products.save();

    }).catch(err=>{
        return res.status(statusCodes.SERVER_ERROR).json({
            data: {
                message: err.message
            }
        }
        )
    })
    })
}