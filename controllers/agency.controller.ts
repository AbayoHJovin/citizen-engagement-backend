import { Request, Response } from 'express';
import { createAgency, addCategoryToAgency, getAllAgenciesWithCategories, getAgencyById, getAllAgencies, getCategoryById, getAllCategories, updateCategory, deleteCategory, deleteAgency, updateAgency } from '../services/agency.service';

export const createAgencyHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const agency = await createAgency(name, description);
    res.status(201).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create agency' });
  }
};

export const addCategoryHandler = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id: agencyId } = req.params;

  try {
    const category = await addCategoryToAgency(agencyId, name);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add category' });
  }
};

export const getAgenciesHandler = async (_req: Request, res: Response) => {
  try {
    const agencies = await getAllAgenciesWithCategories();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agencies' });
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
export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteCategory(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
export const updateCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await updateCategory(id, name);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category' });
  }
};
export const getCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
    } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category' });
    }
}
export const getAllCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};
export const getAllAgenciesHandler = async (_req: Request, res: Response) => {
  try {
    const agencies = await getAllAgencies();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agencies' });
  }
};

