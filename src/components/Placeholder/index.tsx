import React from 'react';

const PLACEHOLDER_TYPES = {
  noData: 'No data yet.',
  noLangData: 'No data in this language yet. Try to switch language.',
};

type PlaceholderTypes = keyof typeof PLACEHOLDER_TYPES;

interface Props {
  className?: string;
  type?: PlaceholderTypes;
  children?: string;
}

export const Placeholder = (props: Props) => {
  const { className = '', children, type } = props;
  return (
    <p className={`p1 text-center ${className}`}>{type ? PLACEHOLDER_TYPES[type] : children}</p>
  );
};
