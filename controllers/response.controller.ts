import { Request, Response } from 'express';
import * as responseService from '../services/response.service';

export const create = async (req: Request, res: Response) => {
  const { complaintId, message } = req.body;
  const responderId = req.user!.id;

  try {
    const result = await responseService.createResponse(responderId, complaintId, message);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const result = await responseService.updateResponse(id, message);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await responseService.deleteResponse(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const responses = await responseService.getAllResponses();
    res.json(responses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getByComplaint = async (req: Request, res: Response) => {
  const { complaintId } = req.params;

  try {
    const response = await responseService.getResponseByComplaint(complaintId);
    res.json(response);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
