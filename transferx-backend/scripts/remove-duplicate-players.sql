-- Remove duplicate players from the Player table, keeping only the player with the lowest player_id for each (first_name, last_name)
-- Update PlayerProfile and PlayerRating to reference the kept player_id

-- 1. Create a temp table to store the player_id to keep for each player

-- 1. Create a temp table to store the player_id to keep for each player
IF OBJECT_ID('tempdb..#PlayerToKeep') IS NOT NULL DROP TABLE #PlayerToKeep;
SELECT MIN(player_id) AS keep_id, first_name, last_name
INTO #PlayerToKeep
FROM Player
GROUP BY first_name, last_name;

-- 2. PlayerProfile does not have player_id, so skip updating PlayerProfile

-- 3. Update PlayerRating to reference the kept player_id
UPDATE pr
SET pr.player_id = pt.keep_id
FROM PlayerRating pr
JOIN Player p ON pr.player_id = p.player_id
JOIN #PlayerToKeep pt ON p.first_name = pt.first_name AND p.last_name = pt.last_name
WHERE pr.player_id <> pt.keep_id;

-- 4. Delete duplicate players, keeping only the one with the lowest player_id
DELETE FROM Player
WHERE player_id NOT IN (
    SELECT keep_id FROM #PlayerToKeep
);

-- 5. (Optional) Remove duplicate PlayerRating rows if any
-- (Uncomment if you want to ensure no duplicate rows remain)
-- IF OBJECT_ID('tempdb..#RatingDedup') IS NOT NULL DROP TABLE #RatingDedup;
-- SELECT MIN(id) AS keep_id, player_id, user_id
-- INTO #RatingDedup
-- FROM PlayerRating
-- GROUP BY player_id, user_id;
-- DELETE FROM PlayerRating
-- WHERE id NOT IN (SELECT keep_id FROM #RatingDedup);

-- End of script
