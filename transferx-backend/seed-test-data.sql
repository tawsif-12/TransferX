-- Insert test clubs
INSERT INTO League (name, country) VALUES ('Premier League', 'England');

INSERT INTO Club (league_id, name, country, founded_year) 
VALUES 
  (1, 'Manchester United', 'England', 1878),
  (1, 'Liverpool FC', 'England', 1892),
  (1, 'Manchester City', 'England', 1880),
  (1, 'Arsenal', 'England', 1886),
  (1, 'Chelsea', 'England', 1905);

-- Insert test player
INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES 
  ('Harry', 'Kane', '1993-07-28', 'Centre-Forward', 'England', 1, 150000000),
  ('Mohamed', 'Salah', '1992-06-15', 'Right Winger', 'Egypt', 2, 200000000),
  ('Erling', 'Haaland', '2000-07-21', 'Centre-Forward', 'Norway', 3, 180000000);

PRINT 'Test data inserted successfully'
