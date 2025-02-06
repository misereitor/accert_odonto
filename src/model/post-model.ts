import { logos, posts, squares, type_post } from '@prisma/client';

export interface Posts extends posts {
  type_post: type_post;
  squares: squares[];
}

export interface SquaresMeasure {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scalePercentage: number;
  type: number;
}

export interface ContentToInsert {
  squareId: number;
  type: 'logo' | 'information';
  content: logos | string;
}
