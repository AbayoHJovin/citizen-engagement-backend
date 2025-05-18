import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const adminCreateLeader = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      adminstrationScope,
      province,
      district,
      sector,
      cell,
      village,
    } = req.body;

    if (!name || !email || !adminstrationScope) {
      res.status(400).json({ message: "Missing required fields" });
    }

    await userService.createLeader({
      name,
      email,
      adminstrationScope,
      province,
      district,
      sector,
      cell,
      village,
    });

    res.status(201).json({
      message: "Leader created successfully",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllLeaders = async (_req: Request, res: Response) => {
  try {
    const leaders = await userService.getAllLeaders();
    res.status(200).json(leaders);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeaderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leader = await userService.getLeaderById(id);
    res.status(200).json(leader);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeader = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const updatedLeader = await userService.updateLeader(id, data);
    res.status(200).json(updatedLeader);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const showCitizenLeaders = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leaders = await userService.showCitizenLeaders(id);
    res.status(200).json(leaders);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};