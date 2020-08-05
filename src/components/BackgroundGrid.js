import React from 'react'
import useWindowDimensions from '../libs/useWindowDimensions'
import { getRandomUsers } from '../libs/getRandomUser'
import styles from '../styles/backgroundgrid.module.scss'
import cn from 'classnames'

const ImageGrid = ({images}) => {

    const { height, width } = useWindowDimensions()

    let sideMargin = 6
    let nrHorizontalImages = Math.floor((width) / (100 + sideMargin))
    let nrVerticalImages = Math.floor((height) / 100)
    let nrImages = nrHorizontalImages * nrVerticalImages

    return (
      <div className={styles.backgroundGridContainer}>
        {images.map((item, index) => {
            if (index + 1 > nrImages) return null
            return <img src={item.image} key={index} className={cn(styles.gridImage, styles.gridImageAnimation)} alt='person' />
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
