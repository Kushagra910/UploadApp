const File = require("../models/File");
// local-fileupload handler function

exports.localFileUpload = async(req,res) => {
  try{
    const file = req.files.file;
    console.log(file);
    // server me store karne ka path
    let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
    file.mv(path,(err)=>{
      console.log(err);
    });

    res.status(200).json({
      success:true,
      message:'Local file Upload Successfull'
    });
  } catch(err){
    console.log(err);
  }
}