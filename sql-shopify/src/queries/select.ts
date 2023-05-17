export const selectCount = (table: string): string => {
  return `SELECT COUNT(*) as c FROM ${table}`;
};

export const selectRowById = (id: number, table: string): string => {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
};

export const selectCategoryByTitle = (title: string): string => {
  return `SELECT * FROM categories WHERE title = '${title}'`;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `SELECT apps.title as app_title, categories.title as category_title, categories.id as category_id
  FROM categories
  JOIN apps_categories ON apps_categories.category_id = categories.id
  JOIN apps ON apps_categories.app_id = apps.id
  WHERE apps.id = ${appId}`;
};

export const selectUnigueRowCount = (
  tableName: string,
  columnName: string
): string => {
  return `select count(distinct ${columnName}) as c from ${tableName}`;
};

export const selectReviewByAppIdAuthor = (
  appId: number,
  author: string
): string => {
  return `SELECT * FROM reviews WHERE app_id = ${appId} AND author = '${author}'`;
};

export const selectColumnFromTable = (
  columnName: string,
  tableName: string
): string => {
  return `SELECT ${columnName} FROM ${tableName}`;
};
