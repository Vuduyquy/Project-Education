import Contact, { IContact } from '../models/contact.models';

export const createContact = async (data: Partial<IContact>) => {
    return await Contact.create(data);
};

export const getAllContacts = async () => {
    return await Contact.find();
};

export const getContactById = async (id: string) => {
    return await Contact.findById(id);
};

export const updateContact = async (id: string, data: Partial<IContact>) => {
    return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = async (id: string) => {
    return await Contact.findByIdAndDelete(id);
};
