import { Request, Response } from 'express';
import * as contactService from '../services/contact.services';

export const createContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.createContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error });
    }
};

export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};

export const getContactById = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.getContactById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact', error });
    }
};

export const updateContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.updateContact(req.params.id, req.body);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.deleteContact(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};
