import { adminSummary, getTopLeaders } from "../services/admin.service";
import { Request, Response } from "express";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const summary = await adminSummary();
    res.status(200).json(summary);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTop5Leaders = async (req: Request, res: Response) => {
    try{
        const topLeaders = await getTopLeaders();
        res.status(200).json(topLeaders);
    }catch(err: any){
        res.status(400).json({ message: err.message });
    }
}
