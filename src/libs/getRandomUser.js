
export let getRandomUser = (female = true) => {
    return new Promise((resolve, reject) => {
        fetch('https://randomuser.me/api/?gender=female')
            .then(res => res.json())
            .then(res => resolve(res.results)) // [0].picture.large
            .catch(err => reject(err))
    })
}


export let getRandomUsers = (gender = 'female') => {
    return new Promise((resolve, reject) => {
        fetch(`https://randomuser.me/api/?results=150&gender=${gender}&inc=picture`)
            .then(res => res.json())
            .then(res => resolve(res.results))
            .catch(err => reject(err))
    })
}