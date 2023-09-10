const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
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

// image upload ka handler

function isFileSupported(type,supportedTypes){
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
  const options = {folder};
  if(quality){
    options.quality = quality;
  }
  options.resource_type = "auto";
  console.log("tempFilePath",file.tempFilePath);
  return await cloudinary.uploader.upload(file.tempFilePath,options);
}
exports.imageUpload = async(req,res) =>{
  try{
    // data fetch 
    const {name,email,tags} = req.body;
    console.log(name , tags, email);

    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportedTypes = ["jpg","jpeg","png"];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("file type :" , fileType);
    if(!isFileSupported(fileType,supportedTypes)){
      return res.status(400).json({
        success:false,
        message:"file format not supported",
      });
    }
    // file format supported so upload at cloudinary
    console.log('uploading to code help');
    const response = await uploadFileToCloudinary(file,"Codehelp");
    console.log(response);
    // Db ke andar enty save karlo 
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl:response.secure_url,
    });
    res.status(200).json({
      sucess:true,
      imageUrl : response.secure_url,
      message: 'Image successfully uploaded' ,
    })
  } catch(err){
    console.log(err);
    res.status(400).json({
      success:false,
      message:'something went wrong',
    });
  }
}

// video upload handler

exports.videoUpload = async(req,res) => {
  try{
        // data fetch 
        const {name,email,tags} = req.body;
        console.log(name , tags, email);

        const file = req.files.videoFile;
        console.log(file);
         // validation
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("file type :" , fileType);
        if(!isFileSupported(fileType,supportedTypes)){
          return res.status(400).json({
            success:false,
            message:"file format not supported",
          });
        }
        // Todo - add a upper limit of 5mb for video
        if(file.size > 5*1024*1024){
          return res.status(400).json({
            success:false,
            message:'File size exceeded the limit (5MB)',
          })
        }
        // file format supported so upload at cloudinary
        console.log('uploading to code help');
        const response = await uploadFileToCloudinary(file,"Codehelp");
        console.log(response);
        // Db ke andar enty save karlo 
        const fileData = await File.create({
          name,
          tags,
          email,
          imageUrl:response.secure_url,
        });
        res.status(200).json({
          sucess:true,
          imageUrl : response.secure_url,
          message: 'Video successfully uploaded' ,
        })

  } catch(err){
      console.log(err);
      res.status(400).json({
        success:false,
        message:'something went wrong',
      });
  }
}

// Image Reduce handler

exports.imageSizeReducer = async(req,res) =>{
  try{
    // data fetch 
    const {name,email,tags} = req.body;
    console.log(name , tags, email);

    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportedTypes = ["jpg","jpeg","png","webp"];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("file type :" , fileType);
    if(!isFileSupported(fileType,supportedTypes)){
      return res.status(400).json({
        success:false,
        message:"file format not supported",
      });
    }
    // file format supported so upload at cloudinary
    console.log('uploading to code help');
    const response = await uploadFileToCloudinary(file,"Codehelp",30);
    console.log(response);
    // Db ke andar enty save karlo 
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl:response.secure_url,
    });
    res.status(200).json({
      sucess:true,
      imageUrl : response.secure_url,
      message: 'Image successfully Reduced & uploaded' ,
    })
  } catch(err){
    console.log(err);
    res.status(400).json({
      success:false,
      message:'something went wrong',
    });
  }
}