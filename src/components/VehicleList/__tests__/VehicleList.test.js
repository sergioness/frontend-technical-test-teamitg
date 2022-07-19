import React from 'react';
import { cleanup, render } from '@testing-library/react';

import VehicleList from '../index';
import useData from '../useData';

jest.mock('../useData');
afterEach(() => {
  useData.mockRestore();
  cleanup();
});
describe('<VehicleList /> Tests', () => {
  it('Should show loading state if it not falsy', () => {
    useData.mockReturnValue([true, 'An error occurred', 'results']);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).not.toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should show error if it is not falsy and loading is finished', () => {
    useData.mockReturnValue([false, 'An error occurred', 'results']);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).not.toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  const results = [
    {
      id: 'a',
      description: 'n/a',
      price: '100',
      media: [{ query: '', src: '' }],
    },
  ];

  it('Should render list items if there are vehicles', () => {
    useData.mockReturnValue([false, false, results]);
    const { queryByTestId, queryAllByTestId } = render(<VehicleList />);
    expect(queryByTestId('results')).not.toBeNull();
    const items = queryAllByTestId('item');
    expect(items).not.toBeNull();
    expect(items).toHaveLength(results.length);
  });

  const checkOnNull = (nullValue) => () => {
    useData.mockReturnValue([false, false, nullValue]);
    const { queryByTestId } = render(<VehicleList />);
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
    expect(queryByTestId('message')).not.toBeNull();
  };

  it('Should render a message if there are no vehicles (undefined)', checkOnNull(undefined));

  it('Should render a message if there are no vehicles (null)', checkOnNull(null));

  it('Should render a message if there are no vehicles ([])', checkOnNull([]));
});
