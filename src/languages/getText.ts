import { useSelector } from 'react-redux';

import { AppState } from 'store';
import { LIBRARY } from './library';

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const getText = (text: string, isCapitalized?: boolean) => {
  const lang = useSelector(({ app: { language } }: AppState) => language);
  if (Object.keys(LIBRARY).includes(text)) {
    const value = LIBRARY[text as keyof typeof LIBRARY][lang];
    return isCapitalized ? capitalize(value) : value;
  }
  return 'no text';
};
