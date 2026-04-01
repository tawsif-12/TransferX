import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const query = `SET NOCOUNT ON;
SELECT TOP 2
    CAST(player_id as VARCHAR(10)) as player_id,
    CAST(ISNULL(current_club_id, 0) as VARCHAR(10)) as current_club_id,
    first_name,
    last_name,
    position,
    nationality,
    CONVERT(VARCHAR(10), date_of_birth, 121) as date_of_birth,
    CAST(ISNULL(fee, 0) as VARCHAR(20)) as fee
FROM Player
ORDER BY player_id`;

let tempFile = join(tmpdir(), `query_test.sql`);
writeFileSync(tempFile, query, 'utf-8');

try {
  const result = execSync(
    `sqlcmd -S "DESKTOP-3HO2U54\\SQLEXPRESS" -E -C -d "transferx" -i "${tempFile}" -s "," -W`,
    {
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
      timeout: 30000
    }
  );
  console.log('Output length:', result.length);
  console.log('Lines:', result.split('\n').length);
  console.log('First 1000 chars:');
  console.log(result.slice(0, 1000));
} catch (e) {
  console.error('Error:', e.message);
} finally {
  unlinkSync(tempFile);
}
