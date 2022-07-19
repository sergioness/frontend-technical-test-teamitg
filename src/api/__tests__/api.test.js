import getData, { updateMedia, appendQueryFromUrl } from '../index';
import { request } from '../helpers';

jest.mock('../helpers');

describe.skip('getData Tests', () => {
  const safelyCallApi = async () => {
    try {
      return await getData();
    } catch (e) {
      return null;
    }
  };

  it('Should fail if initial api call is failed', () => {
    request.mockRejectedValueOnce('An error occurred');

    return expect(() => getData()).rejects.not.toBeFalsy();
  });

  it('Should make an api call to receive a list of general vehicle information', async () => {
    expect.assertions(1);
    request.mockResolvedValueOnce([]);
    await safelyCallApi();

    expect(request).toBeCalledWith('/api/vehicles.json');
  });

  it('Should traverse and make further api calls on main results', async () => {
    expect.assertions(3);
    request.mockResolvedValueOnce([{ apiUrl: '/api/vehicle_ftype.json' }, { apiUrl: '/api/vehicle_xj.json' }]);
    request.mockResolvedValueOnce({ id: 'ftype', price: '£36,000' });
    request.mockResolvedValueOnce({ id: 'xj', price: '£40,000' });
    await safelyCallApi();

    expect(request).toBeCalledWith('/api/vehicles.json');
    expect(request).toBeCalledWith('/api/vehicle_ftype.json');
    expect(request).toBeCalledWith('/api/vehicle_xj.json');
  });

  it('Should ignore failed API calls during traversing', () => {
    request.mockResolvedValueOnce([{ apiUrl: '/api/vehicle_ftype.json' }, { apiUrl: '/api/vehicle_xj.json' }]);
    request.mockResolvedValueOnce({ id: 'ftype', price: '£36,000' });
    request.mockRejectedValueOnce('An error occurred');

    expect(safelyCallApi()).resolves.toEqual([
      { apiUrl: '/api/vehicle_ftype.json', id: 'ftype', price: '£36,000' }
    ]);
  });

  it('Should ignore vehicles without valid price during traversing', () => {
    request.mockResolvedValueOnce([{ apiUrl: '/api/ftype.json' }, { apiUrl: '/api/xe.json' }, { apiUrl: '/api/xj.json' }]);
    request.mockResolvedValueOnce({ id: 'ftype', price: '' });
    request.mockResolvedValueOnce({ id: 'xe' });
    request.mockResolvedValueOnce({ id: 'xj', price: '£40,000' });

    return expect(safelyCallApi()).resolves.toEqual([
      { apiUrl: '/api/xj.json', id: 'xj', price: '£40,000' }
    ]);
  });
});

describe('updateMedia Tests', () => {
  it('Should return Promise', async () => {
    let value = 10;
    expect(await updateMedia(value)).toEqual(value);
    value = null;
    expect(await updateMedia(Promise.resolve(value))).toEqual(value);
  });
  it('Should not update media if there is nothing to', async () => {
    expect(await updateMedia(Promise.resolve({}))).not.toHaveProperty('media');
    let media = null;
    expect(await updateMedia(Promise.resolve({ media }))).toHaveProperty('media', media);
    media = [];
    expect(await updateMedia(Promise.resolve({ media }))).toHaveProperty('media', media);
  });
  it('Should update media object', async () => {
    const media = [{ url: '' }];
    const mediafull = await updateMedia(Promise.resolve({ media }));
    expect(mediafull).toHaveProperty('media');
    expect(mediafull.media).toHaveLength(media.length);
  });
});

describe('appendQueryFromUrl Tests', () => {
  const lookupMap = {
    '10x10': 'ten', hi: 'hello', 10: '10', '/lg/': 'full'
  };
  const baseline = '';
  it('Should set \'query\' property to empty string if no value is looked up', () => {
    let regex = /\d+x\d+/g;
    expect(appendQueryFromUrl({}, regex, lookupMap))
      .toHaveProperty('query', baseline);
    expect(appendQueryFromUrl({ url: '' }, regex, lookupMap))
      .toHaveProperty('query', baseline);
    expect(appendQueryFromUrl({ url: '123' }, regex, lookupMap))
      .toHaveProperty('query', baseline);
    regex = /\d+/;
    expect(appendQueryFromUrl({ url: 'api/xl/1234/10' }, regex, lookupMap))
      .toHaveProperty('query', '');
  });
  it('Should set \'query\' property to a looked up value ', () => {
    let regex = /\d+x\d+/g;
    expect(appendQueryFromUrl({ url: '10x10x10' }, regex, lookupMap))
      .toHaveProperty('query', lookupMap['10x10']);
    regex = /\d+/;
    expect(appendQueryFromUrl({ url: '10x10x10' }, regex, lookupMap))
      .toHaveProperty('query', lookupMap[10]);
    regex = /\/\w+\//;
    expect(appendQueryFromUrl({ url: 'http://api.image.com/lg/10/1234' }, regex, lookupMap))
      .toHaveProperty('query', lookupMap['/lg/']);
  });
});
