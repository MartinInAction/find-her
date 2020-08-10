import React, {PureComponent} from 'react'
import 'swiper/swiper.scss'
import 'swiper/components/pagination/pagination.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination, Virtual } from 'swiper'
import { MILE_CONVERTER_NUMBER } from '../libs/Consts'
import { calculateAge } from '../libs/Common'
import styles from '../styles/matchcard.module.scss'
import cn from 'classnames'

SwiperCore.use([Pagination, Virtual]);
/**
 * TODO
 * seen: match_seen: true // can see if match is opened
 * 
     * sort on :
     * birth_date,
     * last_activity_date
     * common_friend_count
     * common_like_count
     * maybe show on map?
 */

export default class MatchCard extends PureComponent {
    render () {
        let {match} = this.props
        return (
            <div className={styles.container} onClick={this.openMatch}>
                <Swiper
                    pagination
                    spaceBetween={1}
                    slidesPerView={1}
                    className={cn(styles.swiper)}
                >
                    {match?.person?.photos.map((photo, index) => {
                        return <SwiperSlide key={index} className={styles.slide}>
                            <img src={photo?.url} className={cn(styles.image, styles.border)} alt='hot grill' />
                        </SwiperSlide>
                    })}
                </Swiper>
                <div className={cn(styles.textWrapper)}>
                <p>{match.person.name}</p>
                    <p>{Math.floor(match.distance_mi * MILE_CONVERTER_NUMBER)} km</p>
                    <p>{calculateAge(match.birth_date)} år</p>
                    {/* <p>{match.bio}</p> */}
                </div>
                </div>
        )
    }

    openMatch = () => {
        console.log('hej')
    }
}