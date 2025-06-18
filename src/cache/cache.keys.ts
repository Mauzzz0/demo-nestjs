import { ArticleEntity } from '../database/entities';
import { FindAllArticlesDto } from '../modules/article/dto';

export const cacheRefreshToken = (token: string) => `refresh:${token}`;

export const cacheArticleById = (id: ArticleEntity['id']) => `article:${id}`;
export const cacheArticlesList = (pattern: string) => `articles:${pattern}`;
export const cacheArticlesListQuery = (query: FindAllArticlesDto) => {
  const { limit, offset, sortBy, sortDirection, search, authorId } = query;

  return cacheArticlesList(`${limit}-${offset}-${sortBy}-${sortDirection}-${search}-${authorId}`);
};
