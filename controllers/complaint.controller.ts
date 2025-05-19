import { Request, Response } from "express";
import * as complaintService from "../services/complaint.service";

export const create = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = req.user!.id;
  if (!userId) {
    res.status(401).json({ message: "Not logged in!" });
    return;
  }

  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    const complaint = await complaintService.createComplaint(
      userId,
      title,
      description,
      imageUrls
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

  // Check if req.body exists and initialize an empty object if it doesn't
  const body = req.body || {};
  const { title, description, imagesToRemove } = body;

  // Validate that at least one field is provided
  if (!title && !description && !req.files && !imagesToRemove) {
    res.status(400).json({
      message:
        "At least one field (title, description, images, or imagesToRemove) is required for update",
    });
    return;
  }

  try {
    // Only include fields that are provided
    const updateData: {
      title?: string;
      description?: string;
      newImages?: string[];
      imagesToRemove?: string[];
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    // Handle new images from the multipart form
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const files = req.files as Express.Multer.File[];
      updateData.newImages = files.map((file) => file.path);
    }

    // Handle images to remove
    if (imagesToRemove) {
      // If imagesToRemove is a string, convert it to an array
      updateData.imagesToRemove = Array.isArray(imagesToRemove)
        ? imagesToRemove
        : [imagesToRemove];
    }

    const complaint = await complaintService.updateComplaint(
      id,
      userId,
      updateData
    );
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

export const changeComplaintStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const complaint = await complaintService.changeComplaintStatus(id, status);
    res.json(complaint);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
