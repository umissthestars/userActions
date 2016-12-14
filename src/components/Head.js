import React, { Component, PropTypes } from 'react';
import { head, next, prev } from '../style/main.css';

export default class Head extends Component {

	static contextTypes = {

		swiper: React.PropTypes.object
	}

	componentDidMount() {
		
		if( !this.props.isRegister ){

			const head = this.refs.head;
			const child = this.refs.head.querySelector( 'h3' );
			head.appendChild( head.removeChild( child ) );
		}
	}

	constructor( props ) {
		
		super( props );

		this.toSlide = () => {

			if( this.props.isRegister )
				this.context.swiper.slideNext();
			else
				this.context.swiper.slidePrev();
		}
	}

	render (){

		const roll = this.props.isRegister
			? next
			: prev;

		const rollText = this.props.isRegister
			? '>>'
			: '<<';

		return (
			<div className = { head } ref = "head" >
				<h3>{ this.props.title }</h3>
				<font className = { roll } onClick = { this.toSlide } >{ rollText }</font>
			</div>
		)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
	}
}