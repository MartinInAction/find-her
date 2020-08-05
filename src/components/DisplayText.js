
import React, {PureComponent} from 'react'

export default class DispayText extends PureComponent <{}, {}> {
    render() {
        let {number} = this.props
        if (number === 0) return null
        return <p style={{color: '#fff', marginTop: 20}}>Displaying {number} {number === 1 ? 'match' : 'matches'}</p>
    }
}