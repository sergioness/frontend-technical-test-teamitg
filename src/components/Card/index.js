import React from 'react';
import './style.scss';

export default function Card({
  description, media, title, subtitle
}) {
  const [{ url }, ...sources] = media || [{ url: '' }];
  const alt = [title, 'thumbnail'].join(' ').trim();
  return (
    <article
      data-testid="container"
      title={title}
      className={`Card
            flex text-xs
            md:flex-column md:text-base md:align-items-center md:text-center
            lg:text-lg`}
    >
      <picture
        data-testid="thumbnail"
        className={`Card__thumbnail
                flex w-8rem h-8rem
                md:w-full md:h-auto md:flex`}
      >
        {sources.map(({ query, url: src }) => (
          <source key={src.toString()} media={query} srcSet={src} />
        ))}
        <img
          className="md:w-full md:h-auto"
          src={url}
          alt={alt}
          title={alt}
        />
      </picture>
      <div
        className={`Card__content
                flex flex-column justify-content-center py-3 px-4
                md:w-full md:align-items-center md:p-1
                lg:p-3`}
      >
        <h4
          data-testid="title"
          className={`Card__content__title
                p-0 m-0 text-xl uppercase border-500 text-900
                md:border-y-1 md:my-3 md:py-1`}
        >
          {title}
        </h4>
        <h5
          data-testid="subtitle"
          className={`Card__content__subtitle
                text-base text-500 font-medium p-0 my-1
                md:my-2 md:text-sm`}
        >
          {subtitle}
        </h5>
        <p
          data-testid="description"
          className={`Card__content__description
                text-base my-2 py-1 w-full
                md:m-1 md:p-0 lg:my-2
                lg:p-0 lg:text-base`}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
