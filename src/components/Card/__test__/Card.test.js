import React from 'react';
import { render } from '@testing-library/react';
import Card from '../index';

describe('<Card /> Tests', () => {
  const title = 'a card';
  const subtitle = 'card subtitle';
  const description = 'card text';
  const media = [{ query: '', url: 'source1' }, { query: '(max-width: 10)', url: 'source2' }, { query: '(max-width: 100)', url: 'https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image-300x203.jpg' }];
  it('Should render by default', () => {
    const { queryByTestId } = render(<Card description={null} media={null} title={null} subtitle={null} />);
    expect(queryByTestId('container')).not.toBeNull();
    expect(queryByTestId('title')).not.toBeNull();
    expect(queryByTestId('subtitle')).not.toBeNull();
    expect(queryByTestId('description')).not.toBeNull();
    expect(queryByTestId('thumbnail')).not.toBeNull();
  });
  it('Should render title', () => {
    const { queryByTestId } = render(<Card description="" media={null} title={title} subtitle="" />);
    const element = queryByTestId('title');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual(title);
  });
  it('Should render subtitle', () => {
    const { queryByTestId } = render(<Card description="" media={null} title={title} subtitle={subtitle} />);
    const element = queryByTestId('subtitle');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual(subtitle);
  });
  it('Should render description', () => {
    const { queryByTestId } = render(<Card description={description} media={null} title={title} subtitle={subtitle} />);
    const element = queryByTestId('description');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual(description);
  });
  it('Should render thumbnail', () => {
    const { queryByTestId } = render(<Card description={description} media={media} title={title} subtitle={subtitle} />);
    const element = queryByTestId('thumbnail');
    expect(element).not.toBeNull();
    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(media[0].url);
    expect(img.alt).not.toBeNull();
    expect(img.title).not.toBeNull();
  });
  it('Should render thumbnail sources', () => {
    const { queryByTestId } = render(<Card description={description} media={media} title={title} subtitle={subtitle} />);
    const element = queryByTestId('thumbnail');
    expect(element).not.toBeNull();
    const sources = Array.from(element.querySelectorAll('source'));
    expect(sources).not.toBeNull();
    const [, ...urls] = media;
    expect(sources.length).toBe(urls.length);
    expect(sources.map(({ srcset }) => srcset)).toEqual(expect.arrayContaining(urls.map(({ url }) => url)));
  });
});
