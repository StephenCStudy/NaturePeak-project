import Property from "../models/Property";
import { Request, Response } from "express";

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().populate("agent");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: (err as any).message });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: (err as any).message });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: (err as any).message });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: (err as any).message });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: (err as any).message });
  }
};
