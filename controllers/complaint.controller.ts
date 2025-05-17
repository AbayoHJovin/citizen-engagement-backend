import { Request, Response } from "express";
import * as complaintService from "../services/complaint.service";

export const create = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = req.user!.id;
  console.log("requestUserId", req.user);
  if(!userId){
    res.status(401).json({ message: "Re-login" });
    return;
  }
  try {
    const complaint = await complaintService.createComplaint(
      userId,
      title,
      description
    );
    res.status(201).json(complaint);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getMine = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const complaints = await complaintService.getMyComplaints(userId);
    res.json(complaints);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const { title, description } = req.body;

  try {
    const complaint = await complaintService.updateComplaint(id, userId, {
      title,
      description,
    });
    res.json(complaint);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const deleted = await complaintService.deleteComplaint(id, userId);
    res.json(deleted);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const complaint = await complaintService.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
export const getAll = async (req: Request, res: Response) => {
  try {
    const complaints = await complaintService.getAllComplaints();
    res.json(complaints);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
export const getByMyRegion = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const complaints = await complaintService.getComplaintsInMyRegion(userId);
    res.json(complaints);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const changeComplaintStatus = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const complaint = await complaintService.changeComplaintStatus(id, status);
    res.json(complaint);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}