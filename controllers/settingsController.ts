
import { Request, Response } from 'express';
import { Setting, SettingSchema } from '../models/Setting';

export const getSettings = async (req: Request, res: Response) => {
  try {
    // Find settings or create default if none exists
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        hotelName: 'Luxury Suites',
        hotelAddress: '123 Ocean Drive, Miami, FL 33139',
        contactEmail: 'info@luxurysuites.com',
        contactPhone: '+1 (555) 123-4567',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'English',
        checkInTime: '3:00 PM',
        checkOutTime: '11:00 AM',
        theme: 'light',
        animations: true,
        compactView: false,
        sessionTimeout: 30,
        passwordRequirements: {
          uppercase: true,
          numbers: true,
          specialChars: true,
          minLength: 8
        }
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = SettingSchema.parse(req.body);
    
    // Find settings or create default if none exists
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create(validatedData);
    } else {
      settings = await Setting.findOneAndUpdate({}, validatedData, { new: true });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: 'Error updating settings', error });
  }
};
