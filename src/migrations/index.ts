import * as migration_20260515_151041_initial_schema from './20260515_151041_initial_schema';
import * as migration_20260518_124726 from './20260518_124726';
import * as migration_20260519_163820 from './20260519_163820';
import * as migration_20260520_091540 from './20260520_091540';
import * as migration_20260520_093805 from './20260520_093805';
import * as migration_20260524_000000_page_seo_schema_markup from './20260524_000000_page_seo_schema_markup';
import * as migration_20260525_000000_locations_hero_intro_2 from './20260525_000000_locations_hero_intro_2';

export const migrations = [
  {
    up: migration_20260515_151041_initial_schema.up,
    down: migration_20260515_151041_initial_schema.down,
    name: '20260515_151041_initial_schema',
  },
  {
    up: migration_20260518_124726.up,
    down: migration_20260518_124726.down,
    name: '20260518_124726',
  },
  {
    up: migration_20260519_163820.up,
    down: migration_20260519_163820.down,
    name: '20260519_163820',
  },
  {
    up: migration_20260520_091540.up,
    down: migration_20260520_091540.down,
    name: '20260520_091540',
  },
  {
    up: migration_20260520_093805.up,
    down: migration_20260520_093805.down,
    name: '20260520_093805',
  },
  {
    up: migration_20260524_000000_page_seo_schema_markup.up,
    down: migration_20260524_000000_page_seo_schema_markup.down,
    name: '20260524_000000_page_seo_schema_markup',
  },
  {
    up: migration_20260525_000000_locations_hero_intro_2.up,
    down: migration_20260525_000000_locations_hero_intro_2.down,
    name: '20260525_000000_locations_hero_intro_2',
  },
];
