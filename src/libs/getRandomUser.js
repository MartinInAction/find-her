
import Config from './Config';

export let getRandomUsers = () => {
    return new Promise((resolve, reject) => {
        if (Config.enableSafeMode) return (
            fetch(`https://randomuser.me/api/?results=150&gender=female&inc=picture`)
                .then(res => res.json())
                .then(res => resolve(res.results))
                .catch(err => reject(err))
        )

        Promise.all([
            getImages(1),
            getImages(2),
            getImages(3),   
        ])
            .then((res) => res.flat())
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

let getImages = (page: number) => {
    return fetch(`/photos/hot-girls?page=${page}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then((res) => res.gallery.assets)
    .then((res) => res.map((item) => ({ image: item.thumbUrl, title: item.caption })))
}