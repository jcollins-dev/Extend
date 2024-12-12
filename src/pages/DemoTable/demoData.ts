interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
}

export const data = [
  {
    firstName: 'Jose',
    lastName: 'Dibbert',
    age: 17,
    visits: 847,
    progress: 76,
    status: 'relationship',
    subRows: [
      {
        firstName: 'Destini',
        lastName: 'Rice',
        age: 38,
        visits: 500,
        progress: 95,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Clemens',
            lastName: 'Russel',
            age: 0,
            visits: 514,
            progress: 85,
            status: 'single'
          },
          {
            firstName: 'Alia',
            lastName: 'Parker',
            age: 1,
            visits: 265,
            progress: 48,
            status: 'complicated'
          },
          {
            firstName: 'Abdullah',
            lastName: 'Ratke',
            age: 7,
            visits: 388,
            progress: 78,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Jaqueline',
        lastName: 'Ritchie',
        age: 38,
        visits: 732,
        progress: 74,
        status: 'single',
        subRows: [
          {
            firstName: 'Clementina',
            lastName: 'Maggio-Dach',
            age: 39,
            visits: 550,
            progress: 93,
            status: 'relationship'
          },
          {
            firstName: 'Dino',
            lastName: 'Bauch',
            age: 6,
            visits: 564,
            progress: 43,
            status: 'complicated'
          },
          {
            firstName: 'Aiyana',
            lastName: 'Grant',
            age: 33,
            visits: 816,
            progress: 84,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Danika',
        lastName: 'Berge',
        age: 3,
        visits: 969,
        progress: 37,
        status: 'single',
        subRows: [
          {
            firstName: 'Rosalee',
            lastName: 'Kreiger',
            age: 32,
            visits: 994,
            progress: 8,
            status: 'relationship'
          },
          {
            firstName: 'Blanca',
            lastName: 'Rath',
            age: 8,
            visits: 124,
            progress: 24,
            status: 'relationship'
          },
          {
            firstName: 'Ophelia',
            lastName: 'Cassin',
            age: 38,
            visits: 366,
            progress: 38,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Julia',
        lastName: 'Heaney',
        age: 33,
        visits: 217,
        progress: 94,
        status: 'single',
        subRows: [
          {
            firstName: 'Zena',
            lastName: 'Harris',
            age: 26,
            visits: 876,
            progress: 81,
            status: 'single'
          },
          {
            firstName: 'Susana',
            lastName: 'Jacobi',
            age: 16,
            visits: 53,
            progress: 33,
            status: 'single'
          },
          {
            firstName: 'Osvaldo',
            lastName: 'Runolfsdottir',
            age: 0,
            visits: 325,
            progress: 11,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Aiden',
        lastName: 'Kuvalis',
        age: 10,
        visits: 355,
        progress: 18,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Floy',
            lastName: 'Boyle',
            age: 11,
            visits: 185,
            progress: 33,
            status: 'relationship'
          },
          {
            firstName: 'Jany',
            lastName: 'McCullough',
            age: 12,
            visits: 806,
            progress: 40,
            status: 'relationship'
          },
          {
            firstName: 'Alberta',
            lastName: 'Kuhic',
            age: 18,
            visits: 542,
            progress: 68,
            status: 'relationship'
          }
        ]
      }
    ]
  },
  {
    firstName: 'Layne',
    lastName: 'Sipes',
    age: 14,
    visits: 773,
    progress: 96,
    status: 'single',
    subRows: [
      {
        firstName: 'Casandra',
        lastName: 'Schiller',
        age: 18,
        visits: 994,
        progress: 4,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Ova',
            lastName: 'Pacocha',
            age: 10,
            visits: 627,
            progress: 5,
            status: 'complicated'
          },
          {
            firstName: 'Vicky',
            lastName: 'Boyer',
            age: 8,
            visits: 446,
            progress: 44,
            status: 'complicated'
          },
          {
            firstName: 'Lemuel',
            lastName: 'Beahan-Bartoletti',
            age: 25,
            visits: 378,
            progress: 99,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Preston',
        lastName: 'Hickle-Abshire',
        age: 21,
        visits: 700,
        progress: 35,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Tara',
            lastName: 'Leannon',
            age: 17,
            visits: 614,
            progress: 70,
            status: 'single'
          },
          {
            firstName: 'Florence',
            lastName: 'Hirthe',
            age: 20,
            visits: 324,
            progress: 31,
            status: 'relationship'
          },
          {
            firstName: 'Emily',
            lastName: 'Hane',
            age: 8,
            visits: 884,
            progress: 3,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Joseph',
        lastName: 'Smitham',
        age: 8,
        visits: 445,
        progress: 62,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Georgiana',
            lastName: 'Shields',
            age: 22,
            visits: 649,
            progress: 45,
            status: 'relationship'
          },
          {
            firstName: 'Elroy',
            lastName: 'Runolfsson',
            age: 38,
            visits: 769,
            progress: 68,
            status: 'relationship'
          },
          {
            firstName: 'Gregoria',
            lastName: 'Haley',
            age: 18,
            visits: 460,
            progress: 6,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Celestine',
        lastName: 'Crona',
        age: 21,
        visits: 383,
        progress: 73,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Keanu',
            lastName: 'Hamill',
            age: 16,
            visits: 611,
            progress: 30,
            status: 'single'
          },
          {
            firstName: 'Pearline',
            lastName: 'Frami',
            age: 3,
            visits: 893,
            progress: 91,
            status: 'single'
          },
          {
            firstName: 'Hudson',
            lastName: 'Powlowski',
            age: 25,
            visits: 573,
            progress: 91,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Bernadine',
        lastName: 'Kreiger',
        age: 12,
        visits: 523,
        progress: 16,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Adele',
            lastName: 'Cronin',
            age: 29,
            visits: 740,
            progress: 49,
            status: 'single'
          },
          {
            firstName: 'Abagail',
            lastName: 'Robel',
            age: 13,
            visits: 102,
            progress: 27,
            status: 'complicated'
          },
          {
            firstName: 'Jolie',
            lastName: 'Vandervort',
            age: 21,
            visits: 722,
            progress: 92,
            status: 'complicated'
          }
        ]
      }
    ]
  },
  {
    firstName: 'Ava',
    lastName: 'Pfeffer',
    age: 40,
    visits: 97,
    progress: 79,
    status: 'single',
    subRows: [
      {
        firstName: 'Queenie',
        lastName: 'Sipes',
        age: 14,
        visits: 960,
        progress: 36,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Janick',
            lastName: 'Mitchell',
            age: 12,
            visits: 719,
            progress: 49,
            status: 'relationship'
          },
          {
            firstName: 'Amina',
            lastName: 'Jaskolski',
            age: 14,
            visits: 979,
            progress: 37,
            status: 'relationship'
          },
          {
            firstName: 'Opal',
            lastName: 'Murazik',
            age: 4,
            visits: 178,
            progress: 88,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Darron',
        lastName: 'Wintheiser',
        age: 14,
        visits: 93,
        progress: 13,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Cristina',
            lastName: 'Larson-Pollich',
            age: 26,
            visits: 615,
            progress: 68,
            status: 'complicated'
          },
          {
            firstName: 'Jedediah',
            lastName: 'Senger',
            age: 15,
            visits: 849,
            progress: 23,
            status: 'relationship'
          },
          {
            firstName: 'Nola',
            lastName: 'Rice',
            age: 37,
            visits: 917,
            progress: 63,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Madalyn',
        lastName: 'Kuphal',
        age: 5,
        visits: 532,
        progress: 80,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Daniela',
            lastName: 'Mann-Wiegand',
            age: 39,
            visits: 538,
            progress: 98,
            status: 'single'
          },
          {
            firstName: 'Sandrine',
            lastName: 'Howell',
            age: 9,
            visits: 440,
            progress: 83,
            status: 'single'
          },
          {
            firstName: 'Jayne',
            lastName: 'Moore',
            age: 27,
            visits: 327,
            progress: 0,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Raina',
        lastName: 'Kunze',
        age: 10,
        visits: 610,
        progress: 34,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Isai',
            lastName: 'Littel',
            age: 21,
            visits: 217,
            progress: 44,
            status: 'single'
          },
          {
            firstName: 'Kane',
            lastName: 'Pollich',
            age: 26,
            visits: 774,
            progress: 37,
            status: 'relationship'
          },
          {
            firstName: 'Freda',
            lastName: 'Kuvalis',
            age: 38,
            visits: 962,
            progress: 35,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Brigitte',
        lastName: 'Erdman',
        age: 37,
        visits: 873,
        progress: 99,
        status: 'single',
        subRows: [
          {
            firstName: 'Bill',
            lastName: 'Schmeler',
            age: 25,
            visits: 983,
            progress: 35,
            status: 'relationship'
          },
          {
            firstName: 'Adonis',
            lastName: 'Zboncak',
            age: 21,
            visits: 38,
            progress: 10,
            status: 'single'
          },
          {
            firstName: 'Jarod',
            lastName: 'Mann',
            age: 36,
            visits: 618,
            progress: 11,
            status: 'complicated'
          }
        ]
      }
    ]
  },
  {
    firstName: 'Janice',
    lastName: 'Bauch',
    age: 17,
    visits: 714,
    progress: 28,
    status: 'single',
    subRows: [
      {
        firstName: 'Jamie',
        lastName: 'Barrows',
        age: 27,
        visits: 319,
        progress: 32,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Afton',
            lastName: 'Turner',
            age: 32,
            visits: 526,
            progress: 79,
            status: 'complicated'
          },
          {
            firstName: 'Magdalena',
            lastName: 'Muller',
            age: 7,
            visits: 396,
            progress: 40,
            status: 'relationship'
          },
          {
            firstName: 'Tanya',
            lastName: 'Leffler',
            age: 4,
            visits: 37,
            progress: 12,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Kenya',
        lastName: 'Koepp',
        age: 17,
        visits: 783,
        progress: 56,
        status: 'relationship',
        subRows: [
          {
            firstName: 'Sharon',
            lastName: 'Spencer',
            age: 23,
            visits: 502,
            progress: 100,
            status: 'relationship'
          },
          {
            firstName: 'Brayan',
            lastName: 'VonRueden',
            age: 38,
            visits: 594,
            progress: 70,
            status: 'complicated'
          },
          {
            firstName: 'Eulalia',
            lastName: 'Farrell',
            age: 29,
            visits: 204,
            progress: 10,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Zora',
        lastName: 'Russel',
        age: 13,
        visits: 742,
        progress: 16,
        status: 'single',
        subRows: [
          {
            firstName: 'Hollie',
            lastName: 'Hilpert-Johns',
            age: 36,
            visits: 874,
            progress: 23,
            status: 'relationship'
          },
          {
            firstName: 'Kole',
            lastName: 'Schmeler',
            age: 2,
            visits: 365,
            progress: 7,
            status: 'complicated'
          },
          {
            firstName: 'Yasmine',
            lastName: 'Fadel',
            age: 2,
            visits: 696,
            progress: 60,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Nichole',
        lastName: 'Lueilwitz',
        age: 17,
        visits: 113,
        progress: 85,
        status: 'single',
        subRows: [
          {
            firstName: 'Matilda',
            lastName: 'Bahringer',
            age: 7,
            visits: 405,
            progress: 85,
            status: 'relationship'
          },
          {
            firstName: 'Fannie',
            lastName: 'Greenfelder',
            age: 12,
            visits: 200,
            progress: 60,
            status: 'complicated'
          },
          {
            firstName: 'Libby',
            lastName: 'Halvorson',
            age: 36,
            visits: 768,
            progress: 4,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Anabelle',
        lastName: 'Orn',
        age: 14,
        visits: 118,
        progress: 89,
        status: 'single',
        subRows: [
          {
            firstName: 'Kelton',
            lastName: "Ratke-O'Connell",
            age: 6,
            visits: 302,
            progress: 64,
            status: 'complicated'
          },
          {
            firstName: 'Amos',
            lastName: 'Heidenreich',
            age: 34,
            visits: 364,
            progress: 83,
            status: 'relationship'
          },
          {
            firstName: 'Mohamed',
            lastName: "O'Keefe",
            age: 40,
            visits: 466,
            progress: 49,
            status: 'single'
          }
        ]
      }
    ]
  },
  {
    firstName: 'Emerson',
    lastName: 'Boehm',
    age: 1,
    visits: 440,
    progress: 41,
    status: 'complicated',
    subRows: [
      {
        firstName: 'Madalyn',
        lastName: 'Bahringer',
        age: 31,
        visits: 299,
        progress: 89,
        status: 'single',
        subRows: [
          {
            firstName: 'Stephanie',
            lastName: 'Beatty',
            age: 17,
            visits: 880,
            progress: 8,
            status: 'single'
          },
          {
            firstName: 'Rosemary',
            lastName: 'Johns',
            age: 37,
            visits: 625,
            progress: 62,
            status: 'complicated'
          },
          {
            firstName: 'August',
            lastName: 'Kassulke',
            age: 29,
            visits: 846,
            progress: 66,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Marilyne',
        lastName: 'Brekke',
        age: 13,
        visits: 894,
        progress: 2,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Montana',
            lastName: 'Heidenreich',
            age: 13,
            visits: 600,
            progress: 97,
            status: 'complicated'
          },
          {
            firstName: 'Irwin',
            lastName: 'Cronin',
            age: 28,
            visits: 899,
            progress: 89,
            status: 'relationship'
          },
          {
            firstName: 'Faye',
            lastName: 'Nader',
            age: 40,
            visits: 415,
            progress: 74,
            status: 'complicated'
          }
        ]
      },
      {
        firstName: 'Ashlee',
        lastName: 'Howe-Emmerich',
        age: 33,
        visits: 750,
        progress: 78,
        status: 'single',
        subRows: [
          {
            firstName: 'Paula',
            lastName: 'Johnson',
            age: 28,
            visits: 76,
            progress: 16,
            status: 'complicated'
          },
          {
            firstName: 'Sibyl',
            lastName: 'Nolan',
            age: 0,
            visits: 350,
            progress: 12,
            status: 'single'
          },
          {
            firstName: 'Johnny',
            lastName: 'Hauck',
            age: 32,
            visits: 432,
            progress: 35,
            status: 'relationship'
          }
        ]
      },
      {
        firstName: 'Stephan',
        lastName: 'Daniel-Will',
        age: 26,
        visits: 88,
        progress: 19,
        status: 'complicated',
        subRows: [
          {
            firstName: 'Darby',
            lastName: 'Aufderhar',
            age: 27,
            visits: 167,
            progress: 55,
            status: 'single'
          },
          {
            firstName: 'Elissa',
            lastName: 'Block',
            age: 20,
            visits: 635,
            progress: 82,
            status: 'single'
          },
          {
            firstName: 'Dena',
            lastName: 'Wisoky',
            age: 15,
            visits: 650,
            progress: 28,
            status: 'single'
          }
        ]
      },
      {
        firstName: 'Esta',
        lastName: 'Anderson',
        age: 13,
        visits: 545,
        progress: 71,
        status: 'single',
        subRows: [
          {
            firstName: 'Tyree',
            lastName: 'Cole-Wiegand',
            age: 21,
            visits: 224,
            progress: 79,
            status: 'single'
          },
          {
            firstName: 'Marc',
            lastName: 'Kunze',
            age: 38,
            visits: 589,
            progress: 30,
            status: 'single'
          },
          {
            firstName: 'Celestine',
            lastName: 'Kunde',
            age: 5,
            visits: 754,
            progress: 47,
            status: 'complicated'
          }
        ]
      }
    ]
  }
] as Person[];
