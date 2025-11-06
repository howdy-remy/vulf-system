export interface Person {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  yearIntroduced: number;
}

export const people: Person[] = [
  {
    id: "joe-dart",
    name: "Joe Dart",
    firstName: "Joe",
    lastName: "Dart",
    yearIntroduced: 2011,
  },
  {
    id: "woody-goss",
    name: "Woody Goss",
    firstName: "Woody",
    lastName: "Goss",
    yearIntroduced: 2011,
  },
  {
    id: "theo-katzman",
    name: "Theo Katzman",
    firstName: "Theo",
    lastName: "Katzman",
    yearIntroduced: 2011,
  },
  {
    id: "jack-stratton",
    name: "Jack Stratton",
    firstName: "Jack",
    lastName: "Stratton",
    yearIntroduced: 2011,
  },
];
