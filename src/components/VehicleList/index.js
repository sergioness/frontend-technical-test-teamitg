import React, { useEffect, useState } from 'react';
import useData from './useData';
import Card from '../Card/index';
import './style.scss';

const getItem = (getContent) => (vehicle) => (
  <li
    data-testid="item"
    key={vehicle.id}
    className={`VehicleList__item
              block border-bottom-1 border-300
              md:h-auto md:w-6 md:border-none
              lg:w-3 lg:border-right-1`}
  >
    {getContent(vehicle)}
  </li>
);

const getCard = ({
  id, description, price, media
}) => (
  <Card
    description={description}
    media={media}
    title={id}
    subtitle={price ? ['From', price].join(' ').trim() : null}
  />
);

export default function VehicleList() {
  // eslint-disable-next-line no-unused-vars
  const [loading, error, vehicles] = useData();
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    let _message = '';
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const _vehicles = Array.from(vehicles);
      const _cards = _vehicles.map(getItem(getCard));
      setCards(_cards);
    } else {
      _message = 'Unfortunately, no vehicles available at the moment';
    }
    setMessage(_message);
  }, [vehicles]);

  if (loading) {
    return <p data-testid="loading">Loading</p>;
  }

  if (error) {
    return <strong data-testid="error">{error.toString()}</strong>;
  }

  if (message) {
    return <p data-testid="message">{message.toString()}</p>;
  }

  return (
    <ul
      data-testid="results"
      className={`VehicleList
                w-full flex flex-column flex-nowrap list-none m-0 p-0
                md:flex-row md:flex-wrap`}
    >
      {cards}
    </ul>
  );
}
