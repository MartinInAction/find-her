import React, {PureComponent} from 'react'
import { Form } from 'react-bootstrap'
// import { calculateAge } from '../libs/Common'

export default class MatchSearchInput extends PureComponent <{}, {}> {
    // state = {
    //     filteredMatches: [],
    //     hasReplied: false
    // }

    render() {
        return (
            <>
                <Form.Group style={{marginTop: '15px', maxWidth: '400px'}}>
                    <Form.Control size='sm' type='text' placeholder='Search name, age, bio...' onChange={this.onSearchChange} />
                </Form.Group>
                {/* <Form.Group controlId='formBasicRange'>
                    <Form.Label style={{color: 'white'}}>Range</Form.Label>
                    <Form.Control variant='light' tooltip tooltipLabel={(val => `Value: ${val}`)} size='sm' type='range' onChange={e => console.log(e.target.value)} min={2} max={2000} />
                </Form.Group> */}
                {/* <Form>
                    <div className="mb-3">
                        <Form.Check inline label="Has replied" type='checkbox' id='inline-checkbox-1' onChange={this.onSearchChange} />
                    </div>
                </Form> */}
            </>
        )
    }

    // onSetHasReplied = () => {
    //     let {matches, onFilteredMatches} = this.props
    //     let {hasReplied, filteredMatches} = this.state
    //     this.setState({hasReplied: !hasReplied}, () => {})
    // }

    onSearchChange = (event) => {
        let {matches, onFilteredMatches} = this.props
        // let {hasReplied} = this.state
        let input = event.target.value
        input = input.toLowerCase()

        let arr = []

        matches.filter(match => {
            switch (true) {
                case match.name.toLowerCase().includes(input): arr.push(match); break
                case match.bio.toLowerCase().includes(input): arr.push(match); break
                // case hasReplied && match.messages.length > 0: arr.push(match); break;
                // case calculateAge(match.birth_date) === (input): arr.push(match); break
                default: break
            }
        })

        if (arr.length > 0) {
            return onFilteredMatches(arr)
        }

        return null
    }
}