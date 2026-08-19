import { AppTabRoute } from '../utils/routingEngine';

export type PrimaryCategoryId =
  | 'home'
  | 'services'
  | 'finance'
  | 'documents'
  | 'civic'
  | 'news'
  | 'tools'
  | 'account';

export interface PrimaryCategory {
  id: PrimaryCategoryId;
  title: string;
  titleNp: string;
  description: string;
  descriptionNp: string;
  iconName: string;
  route: AppTabRoute;
  badge?: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  title: string;
  titleNp: string;
  description: string;
  descriptionNp: string;
  iconName: string;
}

export interface ServiceDefinition {
  id: string;
  number: number;
  title: string;
  titleNp: string;
  parentCategory: PrimaryCategoryId;
  subcategory: string;
  description: string;
  descriptionNp: string;
  iconName: string;
  badge?: string;
  targetTab: AppTabRoute;
  subViewId?: string;
  isExternal?: boolean;
  externalUrl?: string;
  tags: string[];
}
