import { Request, Response } from 'express';
import { createAgency,  getAgencyById, getAllAgencies, deleteAgency, updateAgency } from '../services/agency.service';

export const createAgencyHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const agency = await createAgency(name, description);
    res.status(201).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create agency' });
  }
};

export const getAgencyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const agency = await getAgencyById(id);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.status(200).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agency' });
  }
};

export const updateAgencyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const agency = await updateAgency(id, name, description);
    res.status(200).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update agency' });
  }
};

export const deleteAgencyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteAgency(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete agency' });
  }
};
export const getAllAgenciesHandler = async (req: Request, res: Response) => {
  try {
    const agencies = await getAllAgencies();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agencies' });
  }
};