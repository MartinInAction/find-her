import React, {PureComponent} from 'react'
import { Form } from 'react-bootstrap'
import styles from '../styles/matchsearchinput.module.scss'

export default class MatchSearchInput extends PureComponent <{}, {}> {

    render() {
        return (
            <Form.Group className={styles.formInput}>
                <Form.Control size='sm' type='text' placeholder='Search name, age, bio...' onChange={this.onSearchChange} />
            </Form.Group>
        )
    }

    onSearchChange = (event) => {
        let {matches, onFilteredMatches} = this.props
        let input = event.target.value
        input = input.toLowerCase()

        let arr = []
        
        // eslint-disable-next-line
        matches.filter(match => {
            switch (true) {
                case match.name.toLowerCase().includes(input): arr.push(match); break
                case match.bio.toLowerCase().includes(input): arr.push(match); break
                default: break
            }
        })

        if (arr.length > 0) return onFilteredMatches(arr)
        return null
    }
}