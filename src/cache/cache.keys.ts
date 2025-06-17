import { ArticleEntity } from '../database/entities';
import { FindAllArticlesDto } from '../modules/article/dto';

export const cacheArticleById = (id: ArticleEntity['id']) => `cache:article:${id}`;
export const cacheArticlesList = (pattern: string) => `cache:articles:${pattern}`;
export const cacheArticlesListQuery = (query: FindAllArticlesDto) => {
  const { limit, offset, sortBy, sortDirection, search, authorId } = query;

  return cacheArticlesList(`${limit}-${offset}-${sortBy}-${sortDirection}-${search}-${authorId}`);
};
