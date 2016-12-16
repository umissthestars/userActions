import React, { Component, PropTypes } from 'react';
import Head from './Head';
import Register from './Register';
import Resettlement from './Resettlement';
import { addListener } from "../util";
import { head, body } from '../style/main.css';

/**
* @constructor 构建注册/重置 类
* @description 通过对父类继承 做出选择渲染
* @param {ReactClass} Props 父类
* @return {ReactClass} noName 子类
**/
export const Base = ( Props, context ) =>
	class extends Props {

		static childContextTypes = {

			_event: React.PropTypes.object.isRequired,
			swiper: React.PropTypes.object.isRequired
		}

		getChildContext (){
			
			return context;
		}

		componentDidMount() {

			;[].map.call( this.refs.content.querySelectorAll( 'input' ), ( v, i, a ) => {

				addListener( 'mouseenter', v, ( event ) => {

					if( this.props.isRegister )
						context.swiper.lockSwipeToNext();
					else
						context.swiper.lockSwipeToPrev();
					v.select();
				} );

				addListener( 'mouseleave', v, ( event ) => {

					if( this.props.isRegister )
						context.swiper.unlockSwipeToNext();
					else
						context.swiper.unlockSwipeToPrev();
				} );
			} );
		}

		componentWillUnmount() {
			
			;[].map.call( this.refs.content.querySelectorAll( 'input' ), ( v, i, a ) => {

				removeListener( 'mouseenter, mouseleave', v );
			} );
		}

		constructor( props ) {
			
			super( props );

			this.state = {
				
		   		account: this.props.account
			}
		}

		render (){

			this.state = {
				...this.state,
				...this.props,
		   		isRegister: this.props.isRegister
			}

			const title = this.state.isRegister
				? '申请账号'
				: '重置密码'; 
			const info = { 
				title: title,
				isRegister: this.props.isRegister
			}
			const content = this.state.isRegister
				? ( < Register { ...this.state } /> )
				: ( < Resettlement { ...this.state } /> );

			return (
				<div>
					<Head { ...info } />
					<div className = { body } ref = "content" >
						{ content }
					</div>
				</div>
			)
		}
	}