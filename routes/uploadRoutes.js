const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const Customer = require("../models/Customer");

const upload = multer({ dest: "uploads/" ,
    limits:{
        fileSize:5*1024*1024
    }

});


router.post("/", upload.single("file"), async (req, res) => {
    // CSV processing will be implemented next.
    if(!req.file){
        return res.status(400).json({
            success: false,
            message:"Please upload A CSV file"
        })
    }
    try{
        const rows=[];
        const stream=fs.createReadStream(req.file.path).pipe(csv());
        for await (const row of stream){
            const customer={
                customer_name: row.customer_name?.trim(),
                customer_id:row.customer_id?.trim(),
                customer_email: row.customer_email?.trim() || "",
                customer_phone: row.customer_phone?.trim() || "",
                remark: row.remark?.trim() || ""
            }
            if(!customer.customer_name || !customer.customer_id || !customer.customer_email || !customer.customer_phone){
                throw new Error(
                    "Every row must have customer_name, customer_id, customer_email, and customer_phone fields."
                );
            }
            rows.push(customer);

        }
        if(rows.length===0){
            return res.status(400).json({
                success:false,
                message:"CSV file does not contains customer records."
            });
        }
        const operations =rows.map(customer=>({
            updateOne:{
                filter:{
                    customer_id:customer.customer_id
                },
                update:{
                $set:{
                    ...customer,
                    done:false,
                    status:"queued"
                }
                },
                upsert:true
            }
            

        }));
        const result=await Customer.bulkWrite(operations);
        res.status(200).json({
            success:true,
            message:"Customers uploaded successfully.",
            totalRows:rows.length,
            inserted:result.upsertedCount,
            updated:result.modifiedCount
        });

    }catch(error){
        res.status(400).json({
            success:false,
            message:"CSV processing failed.",
            error:error.message
        });
    }finally{
        fs.unlink(req.file.path, (error) =>{
            if(error){
                console.error("Temporary file cleanup Failed:", error.message);
            }
        });
    }

});

module.exports = router;