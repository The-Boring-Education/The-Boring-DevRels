import { DevRelAdvocate } from '@/database/models';
import type { DatabaseQueryResponse, DevRelAdvocateModel } from '@/interfaces';

// Get advocate by email
export const getAdvocateByEmailFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<DevRelAdvocateModel>> => {
  try {
    const advocate = await DevRelAdvocate.findByEmail(email);
    
    if (!advocate) {
      return { error: 'Advocate not found' };
    }
    
    return { data: advocate };
  } catch (error) {
    console.error('Error fetching advocate by email:', error);
    return { error: 'Failed to fetch advocate' };
  }
};

// Get advocate by ID
export const getAdvocateByIdFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<DevRelAdvocateModel>> => {
  try {
    const advocate = await DevRelAdvocate.findById(id);
    
    if (!advocate) {
      return { error: 'Advocate not found' };
    }
    
    return { data: advocate };
  } catch (error) {
    console.error('Error fetching advocate by ID:', error);
    return { error: 'Failed to fetch advocate' };
  }
};

// Create new advocate
export const createAdvocateInDB = async (
  advocateData: Partial<DevRelAdvocateModel>
): Promise<DatabaseQueryResponse<DevRelAdvocateModel>> => {
  try {
    const advocate = await DevRelAdvocate.create(advocateData);
    return { data: advocate };
  } catch (error) {
    console.error('Error creating advocate:', error);
    return { error: 'Failed to create advocate' };
  }
};

// Update advocate
export const updateAdvocateInDB = async (
  id: string,
  updateData: Partial<DevRelAdvocateModel>
): Promise<DatabaseQueryResponse<DevRelAdvocateModel>> => {
  try {
    const advocate = await DevRelAdvocate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!advocate) {
      return { error: 'Advocate not found' };
    }
    
    return { data: advocate };
  } catch (error) {
    console.error('Error updating advocate:', error);
    return { error: 'Failed to update advocate' };
  }
};

// Get all advocates
export const getAllAdvocatesFromDB = async (): Promise<DatabaseQueryResponse<DevRelAdvocateModel[]>> => {
  try {
    const advocates = await DevRelAdvocate.find({}).sort({ createdAt: -1 });
    return { data: advocates };
  } catch (error) {
    console.error('Error fetching all advocates:', error);
    return { error: 'Failed to fetch advocates' };
  }
};

// Check if email is authorized (advocate exists)
export const checkAdvocateAuthorizationFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const isAuthorized = await DevRelAdvocate.isAuthorizedEmail(email);
    return { data: !!isAuthorized };
  } catch (error) {
    console.error('Error checking advocate authorization:', error);
    return { error: 'Failed to check authorization' };
  }
};

// Delete advocate
export const deleteAdvocateFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const result = await DevRelAdvocate.findByIdAndDelete(id);
    
    if (!result) {
      return { error: 'Advocate not found' };
    }
    
    return { data: true };
  } catch (error) {
    console.error('Error deleting advocate:', error);
    return { error: 'Failed to delete advocate' };
  }
};