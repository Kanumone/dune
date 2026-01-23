-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  title VARCHAR(255) NOT NULL,
  size VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  badges TEXT[] NOT NULL DEFAULT '{}',
  categories TEXT[] NOT NULL DEFAULT '{}',
  popularity VARCHAR(20) NOT NULL CHECK (popularity IN ('small', 'medium', 'large')),
  clicks INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO locations (lat, lng, title, size, description, badges, categories, popularity, clicks) VALUES
(53.9045, 27.5615, 'Сугроб №1', '220 м²', 'Уютное пространство с живой музыкой и дружелюбной атмосферой. Идеально для вечерних встреч с друзьями.', ARRAY['Музыка', 'Движ на 220 m²'], ARRAY['music', 'party'], 'large', 0),
(53.9145, 27.5715, 'Сугроб №2', '150 m²', 'Странное и веселое место, где всегда что-то происходит. Арт-пространство с непредсказуемой атмосферой.', ARRAY['Странно', 'Весело'], ARRAY['weird', 'party'], 'medium', 0),
(53.8945, 27.5515, 'Сугроб №3', '80 m²', 'Тихое место для душевных разговоров за чаем или глинтвейном. Камин, книги и уютная атмосфера.', ARRAY['Чай', 'Глинтвейн', 'Камин'], ARRAY['cozy'], 'small', 0),
