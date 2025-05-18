import { Request, Response } from "express";
import { leaderSummaryService, showLeaderHisCitizensService } from "../services/leader.service";

export const leaderSummary = async(req: Request, res: Response) => {
  const userId = req.user!.id;
    try{
        if(!userId){
            res.status(400).json({ message: "Missing leaderId" });
            return;
        }
        const summary = await leaderSummaryService(userId);
        res.status(200).json(summary);
    }catch(err: any){
        res.status(400).json({ message: err.message });
    }
}

export const showLeaderHisCitizens = async(req: Request, res: Response) => {
    const userId = req.user!.id;
    try{
        if(!userId){
            res.status(400).json({ message: "Missing leaderId" });
            return;
        }
        const citizens = await showLeaderHisCitizensService(userId);
        res.status(200).json(citizens);
    }catch(err: any){
        res.status(400).json({ message: err.message });
    }
}