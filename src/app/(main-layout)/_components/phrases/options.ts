export const phraseOptions: Record<string, string[]> = {
  'About yourself': [
    'My name is [your name]',
    `I'm from [your country]`,
    `I'm a [your profession]`,
    `I'm [your age] years old`,
  ],
  'Family & Friends': [
    'There are [number] people in my family',
    'I have [number] friends',
  ],
  School: [
    'I study at [school name]',
    'I have [number] lessons a day',
    'I like [subject]',
    'I don’t like [subject]',
  ],
  Work: ['I work at [company name]', 'I have [number] working days a week'],
  Weather: ['It’s sunny'],
  Food: ['My favourite food is [food name]', 'I like to eat [food name]'],
  Travel: ['I like to visit [country name]'],
  Sport: ['I like to play [sport name]', 'I like to watch [sport name]'],
};
export const FAVORITE_OPTION_NAME = 'Your list';
export const phraseOptionNames: string[] =
  Object.keys(phraseOptions).concat(FAVORITE_OPTION_NAME);
