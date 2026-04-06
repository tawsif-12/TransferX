-- Add more test players
INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES 
  ('Cristiano', 'Ronaldo', '1985-02-05', 'Centre-Forward', 'Portugal', 1, 100000000),
  ('Lionel', 'Messi', '1987-06-24', 'Left Winger', 'Argentina', 2, 110000000),
  ('Luka', 'Modric', '1985-09-09', 'Central Midfield', 'Croatia', 3, 20000000),
  ('Manuel', 'Neuer', '1986-03-27', 'Goalkeeper', 'Germany', 1, 15000000),
  ('Virgil', 'van Dijk', '1991-07-08', 'Centre-Back', 'Netherlands', 2, 85000000),
  ('Robert', 'Lewandowski', '1988-08-21', 'Centre-Forward', 'Poland', 4, 75000000),
  ('Kevin', 'De Bruyne', '1991-06-28', 'Attacking Midfield', 'Belgium', 3, 95000000),
  ('Karim', 'Benzema', '1987-12-19', 'Centre-Forward', 'France', 5, 30000000);

PRINT 'Test players added successfully';
