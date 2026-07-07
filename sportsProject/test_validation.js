// test_validation.js
import { createMatchSchema } from './src/validation/matches.js';

console.log("Testing validation schemas...");

const badData = {
  sport: "", // Should fail (empty string)
  homeTeam: "Brisbane Roar",
  awayTeam: "Sydney FC",
  startTime: "2026-07-07T10:00:00Z",
  endTime: "2026-07-07T09:00:00Z" // Should fail (endTime is before startTime)
};

const result = createMatchSchema.safeParse(badData);

if (!result.success) {
  console.log("❌ Validation failed as expected!");
  console.log(JSON.stringify(result.error.format(), null, 2));
} else {
  console.log("✅ Validation passed unexpectedly!");
}

