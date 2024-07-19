const asyncHandler = require("express-async-handler");
 const Contact = require("../models/contactModel");
// 1 get all contacts
// get /api/contacts
//access private
const getContacts =asyncHandler(async(req, res) => {
   const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts );
});

// 2  create contacts
// post /api/contacts
//access private
const createContact = asyncHandler(async(req, res) => {
    console.log(req.body);
    const {name,email,phone} = req.body;
    if(!name || !email ||!phone){
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    const contact = await Contact.create({
        name,email,phone,user_id:req.user.id
});

  res.status(201).json({ contact });
});

// get contacts by id
// get/api/contacts/:id
//access private
const getContactById = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");

    }
    res.status(200).json(contact);
});

// update contact
// put/api/contacts/:id
//access private
const updateContact =asyncHandler( async(req, res) => {
 
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");

    } 

    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to updateother users contacts");
    }
     const updateContact = await Contact.findById(req.params.id,req.body,{new:true});
   

    res.status(200).json(updateContact);
});
// delete contact
// delete/api/contacts/:id
//access private
const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
} if(contact.user_id.toString()!== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to delete other users contacts");
}
   await Contact.deleteOne({_id:req.params.id});
   res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
