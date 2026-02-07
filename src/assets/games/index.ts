// Game cover images - ES6 imports for proper bundling
import minecraftCover from './minecraft-cover.jpg';
import fivemCover from './fivem-cover.jpg';
import fivemCoverNew from './fivem-cover-new.jpg';
import cs2Cover from './cs2-cover.jpg';
import rustCover from './rust-cover.jpg';
import arkCover from './ark-cover.jpg';
import arma3Cover from './arma3-cover.jpg';
import dayzCover from './dayz-cover.jpg';
import valheimCover from './valheim-cover.jpg';
import garrysModCover from './garrys-mod-cover.jpg';
import palworldCover from './palworld-cover.jpg';
import sevenDtdCover from './7dtd-cover.jpg';
import projectZomboidCover from './project-zomboid-cover.jpg';
// New game covers
import metin2Cover from './metin2-cover.jpg';
import cs16Cover from './cs16-cover.jpg';
import farmingsim25Cover from './farmingsim25-cover.jpg';
import terrariaCover from './terraria-cover.jpg';
import unturnedCover from './unturned-cover.jpg';
import enshroudedCover from './enshrouded-cover.jpg';
import arkAscendedCover from './ark-ascended-cover.jpg';
import amongusCover from './amongus-cover.jpg';
import ragempCover from './ragemp-cover.jpg';
import sampCover from './samp-cover.jpg';
import mtasaCover from './mtasa-cover.jpg';
import dayofdragonsCover from './dayofdragons-cover.jpg';

export const gameCoverImages: Record<string, string> = {
  minecraft: minecraftCover,
  fivem: fivemCoverNew, // Use the new GTA V style cover
  cs2: cs2Cover,
  rust: rustCover,
  ark: arkCover,
  arma3: arma3Cover,
  dayz: dayzCover,
  valheim: valheimCover,
  'garrys-mod': garrysModCover,
  palworld: palworldCover,
  '7-days-to-die': sevenDtdCover,
  'project-zomboid': projectZomboidCover,
  // New games with proper covers
  metin2: metin2Cover,
  cs16: cs16Cover,
  'farming-simulator-25': farmingsim25Cover,
  farmingsim25: farmingsim25Cover,
  terraria: terrariaCover,
  unturned: unturnedCover,
  enshrouded: enshroudedCover,
  arkAscended: arkAscendedCover,
  'ark-ascended': arkAscendedCover,
  amongus: amongusCover,
  'among-us': amongusCover,
  ragemp: ragempCover,
  samp: sampCover,
  'mta-sa': mtasaCover,
  mtasa: mtasaCover,
  dayofdragons: dayofdragonsCover,
  'day-of-dragons': dayofdragonsCover,
};

export {
  minecraftCover,
  fivemCover,
  fivemCoverNew,
  cs2Cover,
  rustCover,
  arkCover,
  arma3Cover,
  dayzCover,
  valheimCover,
  garrysModCover,
  palworldCover,
  sevenDtdCover,
  projectZomboidCover,
  metin2Cover,
  cs16Cover,
  farmingsim25Cover,
  terrariaCover,
  unturnedCover,
  enshroudedCover,
  arkAscendedCover,
  amongusCover,
  ragempCover,
  sampCover,
  mtasaCover,
  dayofdragonsCover,
};
