import { ModuleItem } from '../types';
import { SERVICE_DEFINITIONS } from '../services/serviceRegistry';

export const ALL_45_MODULES: ModuleItem[] = SERVICE_DEFINITIONS.map((def) => ({
  id: def.id,
  number: def.number,
  title: def.title,
  titleNp: def.titleNp,
  category: (def.parentCategory === 'civic' ? 'government' : def.parentCategory === 'tools' ? 'utilities' : def.parentCategory === 'news' ? 'community' : def.parentCategory) as any,
  description: def.description,
  descriptionNp: def.descriptionNp,
  iconName: def.iconName,
  badge: def.badge,
}));
