import React from 'react';
import useWindowDimensions from '../libs/useWindowDimensions';
import { getRandomUsers } from '../libs/getRandomUser';
import '../styles/BackgroundGrid.css'

const ImageGrid = ({images}) => {

    const { height, width } = useWindowDimensions()

    let nrHorizontalImages = Math.floor((width) / 100)
    let nrVerticalImages = Math.floor((height) / 100)

    return (
      <div className='backgroundGridContainer'>
        {images.map((item, index) => {
            if (index + 1 > nrHorizontalImages * nrVerticalImages) return null
            return <img src={item.picture.large} key={index} className={'gridImage gridImageAnimation'} alt='person' />
      })}
      </div>
    )
}

export default class BackgroundGrid extends React.PureComponent<{}, {}> {
    state = {
        isLoading: true,
        images: []
    }

    componentDidMount() {
        let {isLoading} = this.state
        getRandomUsers()
            .then(res => this.setState({images: res}))
            .finally(() => this.setState({isLoading: !isLoading}))
            .catch(err => console.log(err))
    }

    render() {
        let {images, isLoading} = this.state
        if (isLoading) return null
        return <ImageGrid images={images} />
    }
}
