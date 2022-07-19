// eslint-disable-next-line no-unused-vars
import { request } from './helpers';

export function appendQueryFromUrl(item, regex, matchToQuery) {
  const match = item.url ? item.url.match(regex) : '';
  const query = matchToQuery[match] || '';
  return { ...item, query };
}

export async function updateMedia(vehicle) {
  let result = vehicle;
  try {
    result = await vehicle;
    const ratioToQuery = { '1x1': '', '16x9': '(min-width: 768px)' };
    const media = result.media
      .map((item) => appendQueryFromUrl(item, /\d+x\d+/g, ratioToQuery))
      .sort((a, b) => a.query.localeCompare(b.query));
    result = { ...result, media };
  } catch { /* empty */ }
  return result;
}

async function expandDetail(vehicle) {
  let result = vehicle;
  try {
    const detail = await request(vehicle.apiUrl);
    result = { ...vehicle, ...detail };
  } catch { /* empty */ }
  return result;
}

/**
 * Pull vehicles information
 *
 * @return {Promise<Array.<vehicleSummaryPayload>>}
 */
export default async function getData() {
  let vehicles = await request('/api/vehicles.json');
  vehicles = await Promise.all(vehicles.map(expandDetail).map(updateMedia));
  vehicles = vehicles.filter(({ id, price }) => id && price);
  return vehicles;
}
