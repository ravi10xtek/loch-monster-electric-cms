import * as migration_20260515_151041_initial_schema from './20260515_151041_initial_schema';
import * as migration_20260518_124726 from './20260518_124726';
import * as migration_20260519_163820 from './20260519_163820';

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
    name: '20260519_163820'
  },
];
