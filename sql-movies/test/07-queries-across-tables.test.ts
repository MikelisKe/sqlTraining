import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async (done) => {
      const query = `select directors.full_name as director, round(sum(movies.budget_adjusted), 2) as total_budget
      from directors
      join movie_directors ON movie_directors.director_id = directors.id  
      join movies ON movie_directors.movie_id = movies.id
      group BY directors.full_name
      order BY total_budget DESC
	  limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58,
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1,
        },
        {
          director: "David Yates",
          total_budget: 504100108.5,
        },
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async (done) => {
      const query = `SELECT  keywords.keyword, count(*) as count
      FROM keywords
      JOIN movie_keywords on keywords.id = movie_keywords.keyword_id
      JOIN movies on movies.id=movie_keywords.movie_id
      GROUP by keyword
      ORDER by count DESC
      LIMIT 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162,
        },
        {
          keyword: "independent film",
          count: 115,
        },
        {
          keyword: "based on novel",
          count: 85,
        },
        {
          keyword: "duringcreditsstinger",
          count: 82,
        },
        {
          keyword: "biography",
          count: 78,
        },
        {
          keyword: "murder",
          count: 66,
        },
        {
          keyword: "sex",
          count: 60,
        },
        {
          keyword: "revenge",
          count: 51,
        },
        {
          keyword: "sport",
          count: 50,
        },
        {
          keyword: "high school",
          count: 48,
        },
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select all movies called Life and return amount of actors",
    async (done) => {
      const query = `select movies.original_title as original_title, count(actors.id) as count
      from movies
      join movie_actors on movie_actors.movie_id = movies.id
      join actors on movie_actors.actor_id = actors.id
      where movies.original_title = 'Life'`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12,
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async (done) => {
      const query = `select genres.genre, count(*) as five_stars_count
      from genres
      join movie_genres on movie_genres.genre_id = genres.id
      join movies on movies.id = movie_genres.movie_id
      join movie_ratings on movie_ratings.movie_id = movies.id
      where movie_ratings.rating = 5
      group by genres.genre
      order by five_stars_count DESC
      limit 3  
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052,
        },
        {
          genre: "Thriller",
          five_stars_count: 11771,
        },
        {
          genre: "Crime",
          five_stars_count: 8670,
        },
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async (done) => {
      const query = `select genres.genre, ROUND(avg(movie_ratings.rating), 2) as avg_rating
      from genres
      join movie_genres on movie_genres.genre_id = genres.id
      join movies on movies.id = movie_genres.movie_id
      join movie_ratings on movie_ratings.movie_id = movies.id
      group by genres.genre
      order by avg_rating DESC
      limit 3
      
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79,
        },
        {
          genre: "Music",
          avg_rating: 3.73,
        },
        {
          genre: "Documentary",
          avg_rating: 3.71,
        },
      ]);

      done();
    },
    minutes(3)
  );
});
