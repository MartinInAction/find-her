

export let getRandomUsers = () => {
    return new Promise((resolve, reject) => {
        /* fetch(`/asset-detail/mosaics/more-like/169963171?&pagesize=200`, {
            method: 'GET'
        })*/
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