import matchImg from '../images/placeholderMatch.jpeg'

export let testMatch = {
    distance_mi: 3,
    birth_date: 2000,
    bio: 'Om man är rolig så kommer man långt. Gillar mat och äventyr.',
    person: {
        name: 'Grill',
        photos: [
            {url: matchImg},
            {url: matchImg},
            {url: matchImg},
            {url: matchImg}
        ]
    }
}

export let testMatches = [testMatch, testMatch, testMatch]